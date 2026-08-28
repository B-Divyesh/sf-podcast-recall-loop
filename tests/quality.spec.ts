import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const route of ['/', '/demo', '/app', '/privacy', '/terms', '/missing-page']) {
  test(`${route} has one clear page structure and no serious accessibility issues`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Podcast Recall Loop/);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test('keyboard navigation reaches the demo and the primary review action', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.getByRole('link', { name: 'Try it with sample data' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/demo$/);
  await page.getByRole('button', { name: 'Reveal my takeaway' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.answer-label')).toHaveText('Your takeaway');
});

test('mobile layout does not scroll sideways', async ({ page }) => {
  await page.goto('/demo');
  const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
});

test('reset demo restores its five original clips', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: 'I remembered' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('5 saved clips.')).toBeVisible();
  await expect(page.getByText('3', { exact: true }).first()).toBeVisible();
});

test('@claim:existing-license a returned license is stored, stripped, and verified once per day', async ({ page }) => {
  let verificationRequests = 0;
  await page.route('https://api.sociobot.in/api/v1/products/podcast-recall-loop/verify?license=test-license', route => route.fulfill({
    contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null })
  }));
  page.on('request', request => {
    if (request.url().includes('/products/podcast-recall-loop/verify?license=')) verificationRequests += 1;
  });
  await page.goto('/app?license=test-license');
  await expect(page).toHaveURL('/app');
  await expect(page.getByText('Unlimited clips active.')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('sb_license:podcast-recall-loop'))).toBe('test-license');
  await page.reload();
  await expect(page.getByText('Unlimited clips active.')).toBeVisible();
  expect(verificationRequests).toBe(1);
});

test('unavailable checkout is not advertised or linked', async ({ page }) => {
  for (const route of ['/', '/app', '/privacy', '/terms']) {
    await page.goto(route);
    await expect(page.locator('a[href*="/checkout"]')).toHaveCount(0);
    await expect(page.getByText(/buy unlimited|\$9 once/i)).toHaveCount(0);
  }
});

test('demo has no dead fictional episode links', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('link', { name: /Open episode/ })).toHaveCount(0);
  await expect(page.locator('a[href*="example.com/episodes"]')).toHaveCount(0);
});

test('footer uses the valid canonical factory hostname', async ({ page, request }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: /Built by Param Factory/ });
  await expect(link).toHaveAttribute('href', 'https://sociobot.in/');
  const response = await request.get('https://sociobot.in/');
  expect(response.ok()).toBe(true);
});
