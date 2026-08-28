import { expect, test } from '@playwright/test';

test('@claim:offline-reload reviews work offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Remember three ideas today');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Offline. Your saved clips and review queue still work.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reveal my takeaway' })).toBeVisible();
});

test('@claim:demo-isolation demo changes never enter the real note library', async ({ page }) => {
  await page.goto('/demo');
  await saveClip(page, 'A demo-only question?');
  await expect(page.getByText('6 saved clips.')).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByText('No clips yet. Saved questions will appear here.')).toBeVisible();
  await expect(page.getByText('A demo-only question?')).toHaveCount(0);
});

test('@claim:rss-lookup an RSS feed fills podcast and episode fields', async ({ page }) => {
  await page.route('https://feeds.example.test/learning.xml', route => route.fulfill({
    contentType: 'application/rss+xml',
    body: `<?xml version="1.0"?><rss><channel><title>Careful Learner</title><item><title>The testing effect</title><link>https://example.test/episode</link><pubDate>Wed, 26 Aug 2026 10:00:00 GMT</pubDate></item></channel></rss>`
  }));
  await page.goto('/demo');
  await page.getByLabel('Podcast RSS feed').fill('https://feeds.example.test/learning.xml');
  await page.getByRole('button', { name: 'Find episodes' }).click();
  await expect(page.getByText('Found 1 recent episodes.')).toBeVisible();
  await expect(page.getByLabel('Podcast name')).toHaveValue('Careful Learner');
  await expect(page.getByLabel('Episode title')).toHaveValue('The testing effect');
  await expect(page.getByLabel('Episode link optional')).toHaveValue('https://example.test/episode');
});

test('@claim:daily-three daily recall presents no more than three due questions', async ({ page }) => {
  await page.goto('/demo');
  for (let index = 0; index < 3; index += 1) {
    await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
    await page.getByRole('button', { name: 'I remembered' }).click();
  }
  await expect(page.getByRole('heading', { name: 'You are caught up' })).toBeVisible();
});

test('@claim:csv-export exports five saved clips as CSV', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const content = await readDownload(download.createReadStream());
  const lines = content.trim().split('\n');
  expect(lines[0]).toBe('podcast,episode,timestamp,prompt,takeaway,due_date,reviews');
  expect(lines).toHaveLength(6);
  expect(content).toContain('Why retrieval beats rereading');
});

test('@claim:markdown-export exports five saved clips as Markdown', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).click();
  const content = await readDownload((await downloadPromise).createReadStream());
  expect(content.match(/^## /gm)).toHaveLength(5);
  expect(content).toContain('# Podcast recall clips');
});

test('@claim:free-limit the free library accepts eight clips and refuses a ninth', async ({ page }) => {
  await page.goto('/demo');
  for (let index = 6; index <= 8; index += 1) await saveClip(page, `Free clip ${index}?`);
  await expect(page.getByText('8 saved clips.')).toBeVisible();
  await fillClip(page, 'Ninth clip?');
  await page.getByRole('button', { name: 'Save recall question' }).click();
  await expect(page.getByText('The free library holds eight clips. Export your notes, delete one, or buy unlimited.')).toBeVisible();
});

test('@claim:local-privacy the demo recall flow sends no note data to another origin', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: 'I remembered' }).click();
  expect(external).toEqual([]);
});

async function fillClip(page: import('@playwright/test').Page, question: string): Promise<void> {
  await page.getByLabel('Podcast name').fill('The Useful Hour');
  await page.getByLabel('Episode title').fill('A durable idea');
  await page.getByLabel('Timestamp').fill('12:34');
  await page.getByLabel('Your recall question').fill(question);
  await page.getByLabel('Your takeaway').fill('A clear takeaway written by the listener.');
}

async function saveClip(page: import('@playwright/test').Page, question: string): Promise<void> {
  await fillClip(page, question);
  await page.getByRole('button', { name: 'Save recall question' }).click();
  await expect(page.getByText(question, { exact: true }).first()).toBeVisible();
}

async function readDownload(streamPromise: ReturnType<import('@playwright/test').Download['createReadStream']>): Promise<string> {
  const stream = await streamPromise;
  if (!stream) return '';
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}
