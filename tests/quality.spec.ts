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

test('every route updates canonical, Open Graph, and Twitter metadata', async ({ page }) => {
  const expectations: Record<string, { title: string; canonical: string }> = {
    '/demo': { title: 'Demo — Podcast Recall Loop', canonical: 'https://podcast-recall-loop.sociobot.in/demo' },
    '/privacy': { title: 'Privacy — Podcast Recall Loop', canonical: 'https://podcast-recall-loop.sociobot.in/privacy' },
    '/missing-page': { title: 'Page not found — Podcast Recall Loop', canonical: 'https://podcast-recall-loop.sociobot.in/missing-page' }
  };
  for (const [route, expected] of Object.entries(expectations)) {
    await page.goto(route);
    await expect(page).toHaveTitle(expected.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expected.canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', expected.title);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expected.canonical);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', expected.title);
  }
});

test('keyboard navigation reaches the demo and the primary review action', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.getByRole('link', { name: 'Try it with sample data' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByLabel('Demo mode')).toContainText('Demo — sample data, nothing is saved to your notes.');
  await page.getByRole('button', { name: 'Reveal my takeaway' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.answer-label')).toHaveText('Your takeaway');
});

test('Back restores the previous scroll position and focuses its page heading', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 1200);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
  const previousY = await page.evaluate(() => window.scrollY);
  expect(previousY).toBeGreaterThan(0);
  await page.evaluate(() => (document.querySelector<HTMLAnchorElement>('a[href="/privacy"][data-link]'))!.click());
  await expect(page).toHaveURL('/privacy');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(previousY);
});

test('mobile layout does not scroll sideways', async ({ page }) => {
  await page.goto('/demo');
  const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.client);
});

test('visible links and buttons meet the 44px touch-target baseline', async ({ page }) => {
  for (const route of ['/', '/demo']) {
    await page.goto(route);
    const undersized = await page.locator('a[href], button').evaluateAll(elements => elements.flatMap(element => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const isRendered = box.width > 0 && box.height > 0 && style.visibility !== 'hidden';
      return isRendered && (box.width < 44 || box.height < 44)
        ? [{ label: element.textContent?.trim(), width: box.width, height: box.height }]
        : [];
    }));
    expect(undersized).toEqual([]);
  }
});

test('dark theme has no serious accessibility issues', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const route of ['/', '/demo']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  }
});

test('reduced motion removes scrolling and visible movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo');
  const styles = await page.locator('.active-card').evaluate(element => ({
    animationDuration: getComputedStyle(element).animationDuration,
    transitionDuration: getComputedStyle(element).transitionDuration,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior
  }));
  expect(Number.parseFloat(styles.animationDuration)).toBeLessThanOrEqual(0.00001);
  expect(Number.parseFloat(styles.transitionDuration)).toBeLessThanOrEqual(0.00001);
  expect(styles.scrollBehavior).toBe('auto');
});

test('@claim:demo-seed-reset demo starts with five sample clips and reset restores all three due questions', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('5 saved clips.')).toBeVisible();
  await expect(page.getByLabel('3 questions due')).toBeVisible();
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: 'I remembered' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('5 saved clips.')).toBeVisible();
  await expect(page.getByLabel('3 questions due')).toBeVisible();
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
  for (let index = 1; index <= 9; index += 1) await saveClip(page, `Unlimited clip ${index}?`);
  await expect(page.getByText('9 saved clips.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Unlimited clips active.')).toBeVisible();
  expect(verificationRequests).toBe(1);
});

test('@claim:one-time-unlimited @claim:sociobot-billing the $9 one-time purchase opens the recorded Sociobot checkout', async ({ page }) => {
  let checkoutStarted = false;
  await page.route('https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout', route => {
    checkoutStarted = true;
    return route.fulfill({ contentType: 'text/html', body: '<title>Secure checkout</title><main><h1>Podcast Recall Loop Unlimited</h1><dl><dt>Product</dt><dd data-product="podcast-recall-loop">podcast-recall-loop</dd><dt>Currency</dt><dd data-currency="USD">USD</dd><dt>Billing</dt><dd data-billing="one_time">one_time</dd><dt>Amount</dt><dd data-amount-cents="900">$9.00</dd></dl></main>' });
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Unlimited clips for $9 once' })).toBeVisible();
  const buy = page.getByRole('link', { name: 'Buy unlimited — $9 once' });
  await expect(buy).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout');
  await expect(page.locator('a[href*="dodopayments.com"]')).toHaveCount(0);
  await buy.click();
  await expect(page).toHaveTitle('Secure checkout');
  await expect(page.locator('[data-product]')).toHaveAttribute('data-product', 'podcast-recall-loop');
  await expect(page.locator('[data-currency]')).toHaveAttribute('data-currency', 'USD');
  await expect(page.locator('[data-billing]')).toHaveAttribute('data-billing', 'one_time');
  await expect(page.locator('[data-amount-cents]')).toHaveAttribute('data-amount-cents', '900');
  expect(checkoutStarted).toBe(true);
});

test('@claim:license-restore a pasted license is verified with an announced recovery message', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/podcast-recall-loop/verify?license=restored-license', route => route.fulfill({
    contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null })
  }));
  await page.goto('/');
  await page.getByText('Restore a license').click();
  await page.getByLabel('License token').fill('restored-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.locator('#license-status')).toHaveText('License verified. Unlimited clips are active.');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:podcast-recall-loop'))).toBe('restored-license');
});

test('a revoked returned license quietly restores the free limit', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/podcast-recall-loop/verify?license=revoked-license', route => route.fulfill({
    contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'revoked', expires_at: null })
  }));
  await page.goto('/app?license=revoked-license');
  await expect(page).toHaveURL('/app');
  await expect(page.getByText('Your saved license is no longer active.')).toBeVisible();
  await expect(page.getByText('8 of 8 free clip spaces remain.')).toBeVisible();
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

async function saveClip(page: import('@playwright/test').Page, question: string): Promise<void> {
  await page.getByLabel('Podcast name').fill('The Useful Hour');
  await page.getByLabel('Episode title').fill('A durable idea');
  await page.getByLabel('Timestamp').fill('12:34');
  await page.getByLabel('Your recall question').fill(question);
  await page.getByLabel('Your takeaway').fill('A clear takeaway written by the listener.');
  await page.getByRole('button', { name: 'Save recall question' }).click();
  await expect(page.getByText(question, { exact: true }).first()).toBeVisible();
}
