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

test('@claim:demo-isolation demo never reads or writes real notes or licenses', async ({ page }) => {
  await page.goto('/app');
  await saveClip(page, 'A real-library question?');
  const external: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  const before = await page.evaluate(async () => {
    localStorage.setItem('sb_license:podcast-recall-loop', 'real-license');
    localStorage.setItem('sb_license:podcast-recall-loop:verdict', JSON.stringify({ valid: true, checkedAt: 1 }));
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('podcast-recall-loop'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    const value = await new Promise<unknown>((resolve, reject) => {
      const request = database.transaction('workspace').objectStore('workspace').get('state'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    database.close();
    return { storage: Object.fromEntries(Object.entries(localStorage)), value };
  });
  await page.goto('/?demo=1&license=demo-url-token');
  await expect(page.getByText('Unlimited clips active.')).toHaveCount(0);
  await saveClip(page, 'A demo-only question?');
  await expect(page.getByText('6 saved clips.')).toBeVisible();
  const after = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('podcast-recall-loop'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    const value = await new Promise<unknown>((resolve, reject) => {
      const request = database.transaction('workspace').objectStore('workspace').get('state'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    database.close();
    return { storage: Object.fromEntries(Object.entries(localStorage)), value };
  });
  expect(after).toEqual(before);
  expect(external).toEqual([]);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete question: A demo-only question?' }).click();
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: 'I remembered' }).click();
  await expect(page.getByLabel('2 questions due')).toBeVisible();
  const restoreExit = page.getByRole('link', { name: 'Restore a license' });
  await expect(restoreExit).toHaveAttribute('href', '/#restore-license');
  await restoreExit.click();
  await expect(page).toHaveURL('/#restore-license');
  await expect(page.getByLabel('License token')).toBeVisible();
  await expect(page.getByLabel('License token')).toBeFocused();
  await page.goto('/demo');
  await expect(page.getByText('5 saved clips.')).toBeVisible();
  await expect(page.getByLabel('3 questions due')).toBeVisible();
  await expect(page.getByText('A demo-only question?')).toHaveCount(0);
  await page.route('https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout', route => route.fulfill({
    contentType: 'text/html',
    body: '<title>Recorded checkout</title><main><h1>Recorded checkout</h1></main>'
  }));
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: 'I remembered' }).click();
  await page.getByRole('link', { name: 'Buy unlimited — $9 once' }).click();
  await expect(page).toHaveTitle('Recorded checkout');
  await page.goto('/?demo=1');
  await expect(page.getByText('5 saved clips.')).toBeVisible();
  await expect(page.getByLabel('3 questions due')).toBeVisible();
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: 'I remembered' }).click();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByText('A real-library question?', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('A demo-only question?')).toHaveCount(0);
  await page.goto('/demo');
  await expect(page.getByText('5 saved clips.')).toBeVisible();
  await expect(page.getByLabel('3 questions due')).toBeVisible();
});

test('@claim:rss-lookup an RSS feed fills podcast and episode fields', async ({ page }) => {
  await page.route('https://feeds.example.test/learning.xml', route => route.fulfill({
    contentType: 'application/rss+xml',
    body: `<?xml version="1.0"?><rss><channel><title>Careful Learner</title><item><title>The testing effect</title><link>https://example.test/episode</link><pubDate>Wed, 26 Aug 2026 10:00:00 GMT</pubDate></item></channel></rss>`
  }));
  await page.goto('/demo');
  await page.getByLabel('Podcast feed address').fill('https://feeds.example.test/learning.xml');
  await page.getByRole('button', { name: 'Find episodes' }).click();
  await expect(page.getByText('Found 1 recent episodes.')).toBeVisible();
  await expect(page.getByLabel('Podcast name')).toHaveValue('Careful Learner');
  await expect(page.getByLabel('Episode title')).toHaveValue('The testing effect');
  await expect(page.getByLabel('Episode link optional')).toHaveValue('https://example.test/episode');
});

test('@claim:feed-explicit-request the feed address is contacted only after Find episodes is pressed', async ({ page }) => {
  const requestedFeeds: string[] = [];
  await page.route('https://feeds.example.test/private.xml', route => {
    requestedFeeds.push(route.request().url());
    return route.fulfill({
      contentType: 'application/rss+xml',
      body: '<?xml version="1.0"?><rss><channel><title>Private Learning</title><item><title>One saved lesson</title></item></channel></rss>'
    });
  });
  await page.goto('/demo');
  await page.getByLabel('Podcast feed address').fill('https://feeds.example.test/private.xml');
  await page.waitForTimeout(200);
  expect(requestedFeeds).toEqual([]);
  await page.getByRole('button', { name: 'Find episodes' }).click();
  await expect(page.getByText('Found 1 recent episodes.')).toBeVisible();
  expect(requestedFeeds).toEqual(['https://feeds.example.test/private.xml']);
});

test('@claim:atom-lookup an Atom feed fills podcast, episode, and link fields', async ({ page }) => {
  await page.route('https://feeds.example.test/learning.atom', route => route.fulfill({
    contentType: 'application/atom+xml',
    body: `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Atom Learning</title><entry><title>An Atom episode</title><link href="https://example.test/atom-episode"/><updated>2026-08-28T10:00:00Z</updated></entry></feed>`
  }));
  await page.goto('/demo');
  await page.getByLabel('Podcast feed address').fill('https://feeds.example.test/learning.atom');
  await page.getByRole('button', { name: 'Find episodes' }).click();
  await expect(page.getByText('Found 1 recent episodes.')).toBeVisible();
  await expect(page.getByLabel('Podcast name')).toHaveValue('Atom Learning');
  await expect(page.getByLabel('Episode title')).toHaveValue('An Atom episode');
  await expect(page.getByLabel('Episode link optional')).toHaveValue('https://example.test/atom-episode');
});

test('@claim:daily-three daily recall presents no more than three due questions', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('podcast-recall-loop-demo');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const state = await new Promise<{ clips: Array<{ dueAt: string }>; dailyQueue?: unknown }>((resolve, reject) => {
      const request = database.transaction('workspace').objectStore('workspace').get('state');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    state.clips.forEach(clip => { clip.dueAt = '2020-01-01T08:00:00.000Z'; });
    delete state.dailyQueue;
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('workspace', 'readwrite');
      transaction.objectStore('workspace').put(state, 'state');
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  });
  await page.reload();
  await expect(page.getByText('Question 1 of 3 today')).toBeVisible();
  for (let index = 0; index < 3; index += 1) {
    await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
    await page.getByRole('button', { name: 'I remembered' }).click();
    if (index < 2) await expect(page.getByText(`Question ${index + 2} of 3 today`)).toBeVisible();
  }
  await expect(page.getByRole('heading', { name: 'You are caught up for today' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'You are caught up for today' })).toBeVisible();
  await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('podcast-recall-loop-demo');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const state = await new Promise<{ dailyQueue: { day: string } }>((resolve, reject) => {
      const request = database.transaction('workspace').objectStore('workspace').get('state');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    state.dailyQueue.day = '2000-01-01';
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('workspace', 'readwrite');
      transaction.objectStore('workspace').put(state, 'state');
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  });
  await page.reload();
  await expect(page.getByText('Question 1 of 2 today')).toBeVisible();
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
  await expect(page.locator('#clip-status')).toHaveText('The free library holds eight clips. Export your notes or delete one to add another.');
});

test('@claim:free-reviews-exports reviews and CSV exports work without a license', async ({ page }) => {
  await page.goto('/demo');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:podcast-recall-loop'))).toBeNull();
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: 'I remembered' }).click();
  await expect(page.getByLabel('2 questions due')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const content = await readDownload((await downloadPromise).createReadStream());
  expect(content).toContain('podcast,episode,timestamp,prompt,takeaway,due_date,reviews');
});

test('@claim:local-privacy saved note flows send no note data or tracking requests to another origin', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/app');
  await saveClip(page, 'What stays private across every note action?');
  await page.reload();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const content = await readDownload((await downloadPromise).createReadStream());
  await page.locator('#import-file').setInputFiles({
    name: 'podcast-recall-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(content)
  });
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete question: What stays private across every note action?' }).click();
  await expect(page.getByText('No clips yet. Saved questions will appear here.')).toBeVisible();
  expect(external).toEqual([]);
});

test('@claim:no-account the demo recall flow works without an account', async ({ page }) => {
  const authenticationRequests: string[] = [];
  page.on('request', request => {
    if (/auth|login|sign-in|signup|register/i.test(request.url())) authenticationRequests.push(request.url());
  });
  await page.goto('/demo');
  await expect(page.locator('input[type="password"], input[autocomplete="username"], input[autocomplete="email"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: 'I remembered' }).click();
  await expect(page.getByLabel('2 questions due')).toBeVisible();
  expect(authenticationRequests).toEqual([]);
});

test('@claim:browser-persistence saved questions stay in this browser after reload', async ({ page }) => {
  await page.goto('/app');
  await saveClip(page, 'What should survive this reload?');
  await page.reload();
  await expect(page.getByText('What should survive this reload?', { exact: true }).first()).toBeVisible();
});

test('@claim:metadata-only the demo stores written metadata and no audio', async ({ page }) => {
  const mediaRequests: string[] = [];
  page.on('request', request => {
    if (request.resourceType() === 'media') mediaRequests.push(request.url());
  });
  await page.goto('/demo');
  await expect(page.locator('audio, video')).toHaveCount(0);
  const clips = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('podcast-recall-loop-demo');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const state = await new Promise<{ clips: Record<string, unknown>[] }>((resolve, reject) => {
      const request = database.transaction('workspace').objectStore('workspace').get('state');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    database.close();
    return state.clips;
  });
  expect(clips.every(clip => !('audio' in clip) && !('audioUrl' in clip) && !('transcript' in clip))).toBe(true);
  expect(mediaRequests).toEqual([]);
});

test('@claim:manual-authorship questions and takeaways are saved exactly as written', async ({ page }) => {
  await page.goto('/app');
  await saveClip(page, 'Which exact question did I write?');
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await expect(page.getByText('A clear takeaway written by the listener.', { exact: true })).toBeVisible();
  await expect(page.getByText('Which exact question did I write?', { exact: true }).first()).toBeVisible();
});

test('@claim:json-backup exports and restores the complete clip library', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const content = await readDownload((await downloadPromise).createReadStream());
  expect(JSON.parse(content).clips).toHaveLength(5);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: /^Delete question:/ }).first().click();
  await expect(page.getByText('4 saved clips.')).toBeVisible();
  await page.locator('#import-file').setInputFiles({
    name: 'podcast-recall-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(content)
  });
  await expect(page.getByText('5 saved clips.')).toBeVisible();
});

test('@claim:invalid-backup-recovery a parseable invalid backup leaves saved clips intact after reload', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/app');
  await saveClip(page, 'Will my good note survive a bad backup?');

  await page.locator('#import-file').setInputFiles({
    name: 'wrong-shaped-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ clips: [{}] }))
  });
  await expect(page.locator('#toast')).toHaveText('That backup could not be read. Choose a Recall Loop JSON file.');
  await expect(page.getByText('Will my good note survive a bad backup?', { exact: true }).first()).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Remember three ideas today' })).toBeVisible();
  await expect(page.getByText('Will my good note survive a bad backup?', { exact: true }).first()).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('@claim:spaced-schedule a recalled question leaves today’s queue and stays scheduled', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByLabel('3 questions due')).toBeVisible();
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: 'I remembered' }).click();
  await expect(page.getByLabel('2 questions due')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('2 questions due')).toBeVisible();
});

test('@claim:review-results both review results schedule the next review from the answer', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: 'Review sooner' }).click();
  await expect(page.getByLabel('2 questions due')).toBeVisible();
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: 'I remembered' }).click();
  await expect(page.getByLabel('1 questions due')).toBeVisible();
});

test('@claim:calendar-reminder downloads a local recurring daily reminder for the recall queue', async ({ page }) => {
  await page.goto('/app');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Add a daily calendar reminder' }).click();
  const content = await readDownload((await downloadPromise).createReadStream());
  expect(content).toContain('RRULE:FREQ=DAILY');
  expect(content).toContain('URL:https://podcast-recall-loop.sociobot.in/app');
  expect(content).toContain('SUMMARY:Recall three podcast ideas');
});

test('@claim:installable-pwa exposes an install manifest and active service worker', async ({ page, request }) => {
  const manifestResponse = await request.get('/manifest.webmanifest');
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(manifest).toMatchObject({ display: 'standalone', name: 'Podcast Recall Loop' });
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
});

test('@claim:license-storage licensing stores only the token and daily verification result', async ({ page }) => {
  const beforeVerification = Date.now();
  await page.route('https://api.sociobot.in/api/v1/products/podcast-recall-loop/verify?license=storage-boundary-license', route => route.fulfill({
    contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null })
  }));
  await page.goto('/');
  await page.getByText('Restore a license').click();
  await page.getByLabel('License token').fill('storage-boundary-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#license-status')).toHaveText('License verified. Unlimited clips are active.');

  const stored = await page.evaluate(() => Object.fromEntries(
    Object.entries(localStorage).filter(([key]) => key.startsWith('sb_license:podcast-recall-loop'))
  ));
  expect(Object.keys(stored).sort()).toEqual([
    'sb_license:podcast-recall-loop',
    'sb_license:podcast-recall-loop:verdict'
  ]);
  expect(stored['sb_license:podcast-recall-loop']).toBe('storage-boundary-license');
  const verdict = JSON.parse(stored['sb_license:podcast-recall-loop:verdict']!);
  expect(Object.keys(verdict).sort()).toEqual(['checkedAt', 'valid']);
  expect(verdict.valid).toBe(true);
  expect(verdict.checkedAt).toBeGreaterThanOrEqual(beforeVerification);
  expect(verdict.checkedAt).toBeLessThanOrEqual(Date.now());
  await page.goto('/privacy');
  await expect(page.getByText('This app stores your license token and its daily verification result in this browser.', { exact: true })).toBeVisible();
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
