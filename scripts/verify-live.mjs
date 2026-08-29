import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl = (process.argv[2] || 'https://podcast-recall-loop.sociobot.in').replace(/\/$/, '');
const evidenceDir = process.argv[3] || '.factory/evidence/polish-6';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function stateSnapshot(page) {
  return page.evaluate(async () => {
    const storage = Object.fromEntries(Object.entries(localStorage));
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('podcast-recall-loop');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const value = await new Promise((resolve, reject) => {
      const request = database.transaction('workspace').objectStore('workspace').get('state');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    database.close();
    return JSON.stringify({ storage, value });
  });
}

async function answer(page, result = 'I remembered') {
  await page.getByRole('button', { name: 'Reveal my takeaway' }).click();
  await page.getByRole('button', { name: result }).click();
}

await mkdir(evidenceDir, { recursive: true });
const browser = await chromium.launch();
const report = { baseUrl, checkedAt: new Date().toISOString(), routes: {}, findings: {}, errors: [] };

try {
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobile = await mobileContext.newPage();
  const mobileErrors = [];
  const externalRequests = [];
  mobile.on('pageerror', error => mobileErrors.push(String(error)));
  mobile.on('console', message => { if (message.type() === 'error') mobileErrors.push(message.text()); });
  mobile.on('request', request => {
    if (new URL(request.url()).origin !== new URL(baseUrl).origin) externalRequests.push(request.url());
  });
  const homeResponse = await mobile.goto(`${baseUrl}/?cold=${Date.now()}`, { waitUntil: 'networkidle' });
  assert(homeResponse?.status() === 200, 'Cold home did not return 200.');
  assert(await mobile.getByRole('heading', { level: 1 }).textContent() === 'Remember what your podcasts taught you', 'Home headline changed.');
  await mobile.getByText('For curious listeners who save good moments but forget the ideas.').waitFor();
  const demoAction = mobile.getByRole('link', { name: 'Try it with sample data' });
  assert(await demoAction.getAttribute('href') === '/?demo=1', 'First-screen demo link is not ?demo=1.');
  for (const fact of ['Notes stay in this browser.', 'Reviews work offline after your first visit.', 'The free library holds eight clips.']) {
    await mobile.getByText(fact, { exact: true }).waitFor();
  }
  const factsBox = await mobile.locator('.plain-facts').boundingBox();
  assert(Boolean(factsBox) && factsBox.y + factsBox.height <= 844, 'First-screen facts fall below the 390x844 viewport.');
  assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'Home overflows at 390px.');
  await mobile.locator('footer.site-footer').getByText('Version 1.0.7', { exact: true }).waitFor();
  assert(!(await mobile.locator('footer.site-footer').innerText()).includes('design notes'), 'Footer still refers to design notes.');
  await mobile.screenshot({ path: `${evidenceDir}/live-home-mobile.png`, fullPage: true });

  await demoAction.click();
  await mobile.waitForURL(`${baseUrl}/?demo=1`);
  await mobile.getByLabel('Demo mode').getByText('Demo — sample data, nothing is saved to your notes.').waitFor();
  await mobile.getByRole('button', { name: 'Reset demo' }).waitFor();
  await mobile.getByRole('button', { name: 'Start for real' }).waitFor();
  await mobile.getByText('5 saved clips.').waitFor();
  await mobile.getByLabel('3 questions due').waitFor();
  await mobile.getByText('Question 1 of 3 today').waitFor();
  assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'Demo overflows at 390px.');
  await mobile.screenshot({ path: `${evidenceDir}/live-demo-mobile.png`, fullPage: true });
  for (let index = 0; index < 3; index += 1) {
    await answer(mobile);
    if (index < 2) await mobile.getByText(`Question ${index + 2} of 3 today`).waitFor();
  }
  await mobile.getByRole('heading', { name: 'You are caught up for today' }).waitFor();
  await mobile.reload({ waitUntil: 'networkidle' });
  await mobile.getByRole('heading', { name: 'You are caught up for today' }).waitFor();
  await mobile.getByRole('button', { name: 'Reset demo' }).click();
  await mobile.getByText('Question 1 of 3 today').waitFor();
  await mobile.evaluate(() => navigator.serviceWorker.ready);
  await mobile.reload({ waitUntil: 'networkidle' });
  await mobileContext.setOffline(true);
  await mobile.reload({ waitUntil: 'domcontentloaded' });
  await mobile.getByText('Offline. Your saved clips and review queue still work.').waitFor();
  await mobile.getByRole('button', { name: 'Reveal my takeaway' }).waitFor();
  await mobileContext.setOffline(false);
  assert(externalRequests.length === 0, `Cold home/demo flow made external requests: ${externalRequests.join(', ')}`);
  assert(mobileErrors.length === 0, `Cold home/demo flow logged errors: ${mobileErrors.join(', ')}`);
  report.findings.firstScreen = { headline: true, action: true, factsAboveFold: true, noOverflow: true };
  report.findings.demo = { oneClick: true, banner: true, reset: true, dailySequence: '1→2→3→caught up', offlineReload: true, externalRequests };
  await mobileContext.close();

  const isolationContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const isolation = await isolationContext.newPage();
  await isolation.goto(`${baseUrl}/app`, { waitUntil: 'networkidle' });
  await isolation.getByLabel('Podcast name').fill('Private Study Notes');
  await isolation.getByLabel('Episode title').fill('A real saved episode');
  await isolation.getByLabel('Timestamp').fill('12:34');
  await isolation.getByLabel('Your recall question').fill('Does this real question stay separate?');
  await isolation.getByLabel('Your takeaway').fill('The real library must remain unchanged.');
  await isolation.getByRole('button', { name: 'Save recall question' }).click();
  await isolation.getByText('Does this real question stay separate?', { exact: true }).first().waitFor();
  await isolation.evaluate(() => {
    localStorage.setItem('sb_license:podcast-recall-loop', 'real-license');
    localStorage.setItem('sb_license:podcast-recall-loop:verdict', JSON.stringify({ valid: true, checkedAt: 1 }));
  });
  const beforeDemo = await stateSnapshot(isolation);
  const isolationExternal = [];
  isolation.on('request', request => {
    if (new URL(request.url()).origin !== new URL(baseUrl).origin) isolationExternal.push(request.url());
  });
  await isolation.goto(`${baseUrl}/?demo=1&license=ignored-demo-token`, { waitUntil: 'networkidle' });
  assert(await isolation.getByText('Unlimited clips active.').count() === 0, 'Demo read the real unlimited state.');
  await isolation.getByText('5 saved clips.').waitFor();
  assert(await stateSnapshot(isolation) === beforeDemo, 'Demo changed real notes or license storage.');
  await answer(isolation);
  await isolation.getByRole('link', { name: 'Restore a license' }).click();
  await isolation.waitForURL(`${baseUrl}/#restore-license`);
  await isolation.getByLabel('License token').waitFor();
  assert(await isolation.getByLabel('License token').evaluate(element => element === document.activeElement), 'Restore route did not focus the license field.');
  await isolation.goto(`${baseUrl}/demo`, { waitUntil: 'networkidle' });
  await isolation.getByLabel('3 questions due').waitFor();
  await answer(isolation);
  await isolation.getByRole('button', { name: 'Start for real' }).click();
  await isolation.getByText('Does this real question stay separate?', { exact: true }).first().waitFor();
  assert(await stateSnapshot(isolation) === beforeDemo, 'Leaving demo changed the real library or license.');
  await isolation.goto(`${baseUrl}/demo`, { waitUntil: 'networkidle' });
  await isolation.getByLabel('3 questions due').waitFor();
  assert(isolationExternal.length === 0, `Demo isolation flow made external requests: ${isolationExternal.join(', ')}`);
  report.findings.demoIsolation = { realStateUnchanged: true, tokenIgnored: true, restoreExitReset: true, startExitReset: true, externalRequests: isolationExternal };
  await isolationContext.close();

  const licenseContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const licensePage = await licenseContext.newPage();
  await licensePage.route('https://api.sociobot.in/api/v1/products/podcast-recall-loop/verify?license=live-storage-boundary', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null })
  }));
  await licensePage.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await licensePage.getByText('Restore a license').click();
  await licensePage.getByLabel('License token').fill('live-storage-boundary');
  const beforeVerification = Date.now();
  await licensePage.getByRole('button', { name: 'Verify license' }).click();
  await licensePage.getByText('License verified. Unlimited clips are active.').waitFor();
  const licenseStorage = await licensePage.evaluate(() => Object.fromEntries(
    Object.entries(localStorage).filter(([key]) => key.startsWith('sb_license:podcast-recall-loop'))
  ));
  assert(JSON.stringify(Object.keys(licenseStorage).sort()) === JSON.stringify([
    'sb_license:podcast-recall-loop',
    'sb_license:podcast-recall-loop:verdict'
  ]), 'Licensing wrote an unexpected localStorage key.');
  assert(licenseStorage['sb_license:podcast-recall-loop'] === 'live-storage-boundary', 'The stored license token changed.');
  const verdict = JSON.parse(licenseStorage['sb_license:podcast-recall-loop:verdict']);
  assert(JSON.stringify(Object.keys(verdict).sort()) === JSON.stringify(['checkedAt', 'valid']), 'The stored verdict has unexpected fields.');
  assert(verdict.valid === true && verdict.checkedAt >= beforeVerification && verdict.checkedAt <= Date.now(), 'The stored verdict is invalid.');
  await licensePage.goto(`${baseUrl}/privacy`, { waitUntil: 'networkidle' });
  await licensePage.getByText('This app stores your license token and its daily verification result in this browser.', { exact: true }).waitFor();
  await licensePage.screenshot({ path: `${evidenceDir}/live-privacy-desktop.png`, fullPage: true });
  report.findings.licenseStorage = { keys: Object.keys(licenseStorage).sort(), verdictFields: Object.keys(verdict).sort(), privacyCopy: true };
  await licenseContext.close();

  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktop = await desktopContext.newPage();
  const routeExpectations = {
    '/': ['Podcast Recall Loop — Remember podcast ideas', 200],
    '/demo': ['Demo — Podcast Recall Loop', 200],
    '/app': ['Recall queue — Podcast Recall Loop', 200],
    '/privacy': ['Privacy — Podcast Recall Loop', 200],
    '/terms': ['Terms — Podcast Recall Loop', 200],
    '/missing-page': ['Page not found — Podcast Recall Loop', 404]
  };
  for (const [route, [title, status]] of Object.entries(routeExpectations)) {
    const routeErrors = [];
    const onConsole = message => { if (message.type() === 'error') routeErrors.push(message.text()); };
    const onPageError = error => routeErrors.push(String(error));
    desktop.on('console', onConsole);
    desktop.on('pageerror', onPageError);
    const response = await desktop.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    assert(response?.status() === status, `${route} returned ${response?.status()}, expected ${status}.`);
    assert(await desktop.title() === title, `${route} has the wrong title.`);
    assert(await desktop.locator('h1').count() === 1, `${route} does not have one h1.`);
    assert(await desktop.locator('main').count() === 1, `${route} does not have one main.`);
    assert(await desktop.locator('link[rel="canonical"]').getAttribute('href') === `${baseUrl}${route}`, `${route} has the wrong canonical.`);
    assert(await desktop.locator('meta[property="og:title"]').getAttribute('content') === title, `${route} has the wrong Open Graph title.`);
    assert(await desktop.locator('meta[property="og:url"]').getAttribute('content') === `${baseUrl}${route}`, `${route} has the wrong Open Graph URL.`);
    const footer = desktop.locator('footer.site-footer');
    await footer.getByRole('link', { name: 'Privacy' }).waitFor();
    await footer.getByRole('link', { name: 'Terms' }).waitFor();
    await footer.getByText('Version 1.0.7', { exact: true }).waitFor();
    assert(!(await footer.innerText()).includes('design notes'), `${route} retains the inaccessible footer reference.`);
    const axe = await new AxeBuilder({ page: desktop }).analyze();
    const serious = axe.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''));
    assert(serious.length === 0, `${route} has serious/critical Axe findings.`);
    if (route === '/app') await desktop.screenshot({ path: `${evidenceDir}/live-app-desktop.png`, fullPage: true });
    desktop.off('console', onConsole);
    desktop.off('pageerror', onPageError);
    if (route !== '/missing-page') assert(routeErrors.length === 0, `${route} logged errors: ${routeErrors.join(', ')}`);
    report.routes[route] = { status, title, h1: 1, main: 1, seriousAxe: 0, consoleErrors: route === '/missing-page' ? 'expected 404 navigation only' : 0 };
  }
  await desktop.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await desktop.screenshot({ path: `${evidenceDir}/live-home-desktop.png`, fullPage: true });
  await desktop.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 1200); });
  const priorScroll = await desktop.evaluate(() => window.scrollY);
  await desktop.evaluate(() => document.querySelector('a[href="/privacy"][data-link]')?.click());
  await desktop.waitForURL(`${baseUrl}/privacy`);
  await desktop.goBack();
  await desktop.waitForURL(`${baseUrl}/`);
  await desktop.waitForFunction(expected => window.scrollY === expected, priorScroll);
  assert(await desktop.locator('h1').evaluate(element => element === document.activeElement), 'Back did not focus the restored page heading.');
  report.findings.routing = { metadata: true, legalLinks: true, http404: true, backScroll: priorScroll, backFocus: true, axeSeriousCritical: 0 };
  await desktopContext.close();

  const checkout = await fetch('https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout', { redirect: 'manual' });
  assert(checkout.status === 303, `Sociobot checkout returned ${checkout.status}, expected 303.`);
  report.findings.checkout = { status: checkout.status, locationPresent: Boolean(checkout.headers.get('location')) };
} catch (error) {
  report.errors.push(error instanceof Error ? error.stack || error.message : String(error));
} finally {
  await browser.close();
  await writeFile(`${evidenceDir}/live-browser.json`, JSON.stringify(report, null, 2));
}

if (report.errors.length) {
  console.error(report.errors.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
