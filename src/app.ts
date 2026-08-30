import './styles.css';
import { completeDailyQueueItem, dailyQueue, formatTimestamp, loadState, parseTimestamp, resetDemo, saveState, scheduleClip, toCsv, toMarkdown, validateImportedState, type DailyQueueView } from './data';
import { acceptLicenseFromUrl, buyUrl, cachedUnlocked, restoreLicense, verifyLicense } from './license';
import type { AppState, Clip, Episode } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const routeStatus = document.querySelector<HTMLDivElement>('#route-status')!;
let state: AppState = { clips: [] };
let demo = false;
let revealedId = '';
let online = navigator.onLine;
let licenseInactive = false;
let todayQueue: DailyQueueView = { clips: [], completed: 0, changed: false };

type NavigationState = { scrollY?: number };

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function rememberScrollPosition(): void {
  const current = history.state && typeof history.state === 'object' ? history.state as NavigationState : {};
  history.replaceState({ ...current, scrollY: window.scrollY }, '');
}

function isDemoUrl(href: string): boolean {
  const url = new URL(href, location.href);
  return (url.pathname.replace(/\/$/, '') || '/') === '/demo' || url.searchParams.get('demo') === '1';
}

async function navigate(href: string): Promise<void> {
  if (demo && !isDemoUrl(href)) await resetDemo();
  rememberScrollPosition();
  history.pushState({ scrollY: 0 } satisfies NavigationState, '', href);
  await render();
  const fragment = location.hash ? document.querySelector<HTMLElement>(location.hash) : null;
  if (fragment) fragment.scrollIntoView();
  else window.scrollTo(0, 0);
}

const escapeHtml = (value: string): string => value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
const safeUrl = (value: string): string => {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? escapeHtml(url.href) : ''; } catch { return ''; }
};

function routeTitle(path: string): string {
  if (path === '/demo') return 'Demo — Podcast Recall Loop';
  if (path === '/app') return 'Recall queue — Podcast Recall Loop';
  if (path === '/privacy') return 'Privacy — Podcast Recall Loop';
  if (path === '/terms') return 'Terms — Podcast Recall Loop';
  if (path === '/') return 'Podcast Recall Loop — Remember podcast ideas';
  return 'Page not found — Podcast Recall Loop';
}

type RouteMeta = { title: string; description: string };

function routeMeta(path: string): RouteMeta {
  if (path === '/demo') return { title: 'Demo — Podcast Recall Loop', description: 'Try five sample podcast clips in a private demo.' };
  if (path === '/app') return { title: 'Recall queue — Podcast Recall Loop', description: 'Save podcast moments and review up to three questions today.' };
  if (path === '/privacy') return { title: 'Privacy — Podcast Recall Loop', description: 'See what Podcast Recall Loop stores in this browser.' };
  if (path === '/terms') return { title: 'Terms — Podcast Recall Loop', description: 'Read the terms for Podcast Recall Loop.' };
  if (path === '/') return { title: 'Podcast Recall Loop — Remember podcast ideas', description: 'Save a podcast timestamp, write your own question, and recall three ideas each day.' };
  return { title: 'Page not found — Podcast Recall Loop', description: 'This Podcast Recall Loop page could not be found.' };
}

function setRouteMetadata(path: string): void {
  const meta = routeMeta(path);
  const canonical = `https://podcast-recall-loop.sociobot.in${path}`;
  document.title = meta.title;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = canonical;
  const entries: Array<[string, string]> = [
    ['meta[property="og:title"]', meta.title],
    ['meta[property="og:description"]', meta.description],
    ['meta[property="og:url"]', canonical],
    ['meta[name="twitter:title"]', meta.title],
    ['meta[name="twitter:description"]', meta.description]
  ];
  for (const [selector, value] of entries) document.querySelector<HTMLMetaElement>(selector)!.content = value;
}

function shell(content: string): string {
  return `${demo ? `<aside class="demo-banner" aria-label="Demo mode"><span><strong>Demo</strong> — sample data, nothing is saved to your notes.</span><span class="demo-actions"><button class="text-button" data-action="reset-demo">Reset demo</button><button class="text-button" data-action="leave-demo">Start for real</button></span></aside>` : ''}
    <header class="site-header">
      <a class="wordmark" href="/" data-link aria-label="Podcast Recall Loop home"><span class="loop-mark" aria-hidden="true"></span><span>Podcast Recall Loop</span></a>
      <nav aria-label="Main navigation"><a href="/app" data-link>Recall</a><a href="/demo" data-link>Demo</a><a href="/privacy" data-link>Privacy</a></nav>
    </header>
    ${!online ? '<div class="offline-note" role="status">Offline. Your saved clips and review queue still work.</div>' : ''}
    <main id="main" tabindex="-1">${content}</main>
    <footer class="site-footer"><p>Three podcast ideas, recalled daily.</p><nav aria-label="Footer"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in/" ${demo ? '' : 'target="_blank" rel="noreferrer"'}>Built by Param Factory ${demo ? '' : '<span class="sr-only">(opens in a new tab)</span>'}</a></nav><p>Version 1.0.10</p></footer>
    <div id="toast" class="toast" role="status" aria-live="polite"></div>`;
}

function landing(): string {
  return shell(`
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">Podcast recall for long listens</p>
        <h1 id="hero-title" tabindex="-1">Turn podcast moments into recall questions</h1>
        <p class="lede">For podcast listeners who save useful moments, then forget what they learned.</p>
        <div class="hero-actions"><a class="button primary" href="/?demo=1" data-link>Try it with sample data</a><span>Opens five sample clips from fictional shows. No setup.</span></div>
        <a class="quiet-link" href="/app" data-link>Add a podcast feed →</a>
        <ul class="plain-facts" aria-label="Product facts"><li>Notes stay in this browser.</li><li>Reviews work offline after your first visit.</li><li>The free library holds eight clips.</li></ul>
      </div>
      <figure class="hero-art"><picture><source media="(max-width: 600px)" srcset="/assets/recall-ceramics-small.webp"><img src="/assets/recall-ceramics.webp" width="1100" height="733" alt="Three porcelain pieces arranged in a quiet recall loop." decoding="async" fetchpriority="high"></picture><figcaption>Save a podcast moment. Write a question. Recall it later.</figcaption></figure>
    </section>
    <section class="preview-section" aria-labelledby="preview-title">
      <div><p class="eyebrow">Today’s recall</p><h2 id="preview-title">Write your own recall question</h2><p>You write the question while the idea is fresh. The recall queue brings it back later.</p></div>
      <article class="prompt-card preview-card"><p class="timestamp">12:34 · Why retrieval beats rereading</p><h3>Why does retrieving an idea strengthen memory?</h3><div class="answer-rule" aria-hidden="true"></div><p class="muted">Reveal your takeaway when you have answered.</p></article>
    </section>
    <section class="steps" aria-labelledby="steps-title"><h2 id="steps-title">How it works</h2><ol><li><span>01</span><h3>Choose a moment</h3><p>Add a podcast feed and pick the episode. Add the timestamp yourself.</p></li><li><span>02</span><h3>Write one question</h3><p>Record the takeaway in your own words. No transcript is needed.</p></li><li><span>03</span><h3>Recall three ideas</h3><p>Answer from memory. Your next review is based on your answer.</p></li></ol></section>
    <section class="boundaries" aria-labelledby="boundaries-title"><div><p class="eyebrow">What the app stores</p><h2 id="boundaries-title">Your audio stays where it is</h2></div><div><p>The app reads podcast titles from the feed address you request. It stores written notes, not audio.</p><p>You write every question and takeaway. You do not need an account.</p></div></section>
    <section class="price" aria-labelledby="price-title"><div><p class="eyebrow">Unlimited clip license</p><h2 id="price-title">Unlimited clips for $9 once</h2><p>The one-time license removes only the clip limit. Reviews and exports stay free.</p></div><div class="price-actions"><a class="button primary" href="${buyUrl()}">Buy unlimited — $9 once</a><details id="restore-license" class="restore-panel"><summary>Restore a license</summary><form id="license-form" class="license-form"><label for="license-token">License token</label><div class="inline-form"><input id="license-token" name="token" autocomplete="off" required aria-describedby="license-help license-status"><button type="submit" aria-label="Verify license">Verify license</button></div><p id="license-help" class="field-help">Paste the token from your purchase email.</p><p id="license-status" class="form-status" aria-live="polite"></p></form></details><p class="fine">Sociobot handles checkout. <a href="/privacy" data-link>Privacy</a> · <a href="/terms" data-link>Terms</a></p></div></section>`);
}

function reviewMarkup(): string {
  const due = todayQueue.clips;
  if (!due.length) return `<section class="empty-state"><div class="ceramic-dot" aria-hidden="true"></div><h2>You are caught up for today</h2><p>Your next questions will appear here when they are due.</p><a class="button secondary" href="#capture">Add another clip</a></section>`;
  const clip = due[0]!;
  const index = todayQueue.completed + 1;
  const total = todayQueue.queue?.clipIds.length || due.length;
  return `<section class="review-zone" aria-labelledby="review-title"><div class="review-heading"><div><p class="eyebrow">Question ${index} of ${total} today</p><h2 id="review-title">Recall before you reveal</h2></div><p>${due.length} due now</p></div>
    <article class="prompt-card active-card" data-clip-id="${escapeHtml(clip.id)}"><p class="timestamp">${formatTimestamp(clip.timestampSec)} · ${escapeHtml(clip.podcast)}</p><h3>${escapeHtml(clip.prompt)}</h3>
    ${revealedId === clip.id ? `<div class="revealed" tabindex="-1"><p class="answer-label">Your takeaway</p><p>${escapeHtml(clip.takeaway)}</p></div><div class="review-actions"><button class="button secondary" data-action="review-sooner" data-id="${escapeHtml(clip.id)}">Review sooner</button><button class="button primary" data-action="review-remembered" data-id="${escapeHtml(clip.id)}">I remembered</button></div>` : `<button class="button primary reveal" data-action="reveal" data-id="${escapeHtml(clip.id)}">Reveal my takeaway</button>`}
    <footer><span>${escapeHtml(clip.episode)}</span>${safeUrl(clip.episodeUrl) ? `<a href="${safeUrl(clip.episodeUrl)}" ${demo ? '' : 'target="_blank" rel="noreferrer"'}>Open episode ${demo ? '' : '<span class="sr-only">(opens in a new tab)</span>'}</a>` : ''}</footer></article></section>`;
}

function libraryMarkup(): string {
  if (!state.clips.length) return `<div class="library-empty"><p>No clips yet. Saved questions will appear here.</p></div>`;
  return `<ul class="clip-list">${state.clips.map(clip => `<li><div><p class="clip-title">${escapeHtml(clip.prompt)}</p><p>${escapeHtml(clip.podcast)} · ${formatTimestamp(clip.timestampSec)} · ${clip.reviewCount} reviews</p></div><button class="icon-button" data-action="delete" data-id="${escapeHtml(clip.id)}" aria-label="Delete question: ${escapeHtml(clip.prompt)}">Delete</button></li>`).join('')}</ul>`;
}

function appPage(): string {
  const unlocked = !demo && cachedUnlocked();
  const dueLabel = `${todayQueue.clips.length} ${todayQueue.clips.length === 1 ? 'question' : 'questions'} due`;
  return shell(`<div class="app-intro"><div><p class="eyebrow">${demo ? 'Sample recall queue' : 'Your recall queue'}</p><h1 tabindex="-1">Remember three ideas today</h1><p>${state.clips.length ? `${state.clips.length} saved clip${state.clips.length === 1 ? '' : 's'}. Answer from memory before revealing your note.` : 'Start with one moment worth remembering.'}</p>${!demo ? '<button class="calendar-reminder" data-action="export-reminder">Add a daily calendar reminder</button>' : ''}</div><div class="count-medallion" aria-label="${dueLabel}"><strong>${todayQueue.clips.length}</strong><span>due</span></div></div>
    ${reviewMarkup()}
    <section id="capture" class="capture" aria-labelledby="capture-title"><div class="section-heading"><div><p class="eyebrow">Capture a moment</p><h2 id="capture-title">Write the question only you need</h2></div><p>${unlocked ? 'Unlimited clips active.' : `${Math.max(0, 8 - state.clips.length)} of 8 free clip spaces remain.`}</p></div>
      <form id="feed-form" class="feed-form"><label for="feed-url">Podcast feed address</label><div class="inline-form"><input type="url" id="feed-url" name="feedUrl" placeholder="https://example.com/feed.xml" autocomplete="url"><button class="button secondary" type="submit">Find episodes</button></div><p class="field-help">Paste the show’s feed address. If you do not have it, enter the podcast and episode below.</p><p class="field-help">The app contacts the feed address only after you press Find episodes.</p><p id="feed-status" class="form-status" aria-live="polite"></p><div id="episode-picker"></div></form>
      <form id="clip-form" class="clip-form"><div class="form-grid"><label>Podcast name<input name="podcast" required maxlength="100" autocomplete="off"></label><label>Episode title<input name="episode" required maxlength="160" autocomplete="off"></label><label>Timestamp<input name="timestamp" required inputmode="numeric" placeholder="12:34" pattern="([0-9]+:)?[0-5]?[0-9]:[0-5][0-9]" aria-describedby="timestamp-help"><span id="timestamp-help" class="field-help">Use minutes:seconds or hours:minutes:seconds.</span></label><label>Episode link <span class="optional">optional</span><input name="episodeUrl" type="url" autocomplete="url"></label></div><label>Your recall question<textarea name="prompt" required maxlength="240" rows="3"></textarea></label><label>Your takeaway<textarea name="takeaway" required maxlength="500" rows="4"></textarea></label><p id="clip-status" class="form-status" aria-live="polite"></p><button class="button primary" type="submit">Save recall question</button></form>
    </section>
    <section class="library" aria-labelledby="library-title"><div class="section-heading"><div><p class="eyebrow">Your library</p><h2 id="library-title">Saved recall questions</h2></div><div class="export-actions"><button data-action="export-md">Export Markdown</button><button data-action="export-csv">Export CSV</button><button data-action="export-json">Export backup</button><label class="file-button">Import backup<input id="import-file" type="file" accept="application/json,.json"></label></div></div>${libraryMarkup()}</section>
    ${!unlocked ? `<aside class="limit-note">${licenseInactive ? '<p class="license-inactive" role="status"><strong>Your saved license is no longer active.</strong> The free eight-clip limit now applies.</p>' : '<p><strong>The free library holds eight clips.</strong> Export your notes, delete one, or buy the one-time unlimited license.</p>'}<a href="${buyUrl()}">Buy unlimited — $9 once</a><a href="/#restore-license" data-link>Restore a license</a></aside>` : ''}`);
}

function privacy(): string {
  return shell(`<article class="legal"><h1 tabindex="-1">Privacy without an account</h1><p class="lede">Podcast Recall Loop stores your questions in this browser.</p><h2>What stays on your device</h2><p>Your clips, questions, takeaways, and review dates stay in this browser. We do not receive them.</p><h2>When the app uses the network</h2><p>The app contacts the feed address only after you press Find episodes. After you restore a license, the app automatically checks the stored license at most once each day.</p><h2>Payment</h2><p>Sociobot checkout handles payment details. This app stores your license token and its daily verification result in this browser.</p><h2>Demo data</h2><p>The demo uses separate browser storage. Resetting it or following any link out deletes its sample changes. It never reads or writes your notes or license.</p><h2>Your control</h2><p>Export a backup from the recall page. Clear this site’s browser data to remove all local notes and licenses.</p><p>Last updated: 29 August 2026.</p></article>`);
}

function terms(): string {
  return shell(`<article class="legal"><h1 tabindex="-1">Terms for Podcast Recall Loop</h1><p class="lede">Use the app for your own lawful podcast notes.</p><h2>Your content</h2><p>You keep ownership of every question and takeaway you write. You are responsible for your notes and backups.</p><h2>Podcast data</h2><p>The app reads public podcast details from the feed address you request. It does not grant rights to podcast audio or publisher material.</p><h2>One-time license</h2><p>A valid $9 license removes the eight-clip limit. Sociobot checkout handles payment for the license.</p><h2>No warranty</h2><p>The software is provided as is under the MIT License. Keep an exported backup of important notes.</p><h2>Changes</h2><p>Material changes will be dated on this page. Continued use means you accept the current terms.</p><p>Last updated: 29 August 2026.</p></article>`);
}

function notFound(): string {
  return shell(`<section class="not-found"><div class="broken-loop" aria-hidden="true"></div><p class="eyebrow">404 · Page not found</p><h1 tabindex="-1">This page could not be found</h1><p>The address may be old or mistyped.</p><a class="button primary" href="/" data-link>Return home</a></section>`);
}

async function render(announce = true): Promise<void> {
  const path = location.pathname.replace(/\/$/, '') || '/';
  demo = path === '/demo' || new URL(location.href).searchParams.get('demo') === '1';
  const viewPath = demo ? '/demo' : path;
  setRouteMetadata(viewPath === '/demo' ? '/demo' : path);
  if (viewPath === '/demo' || viewPath === '/app') {
    try {
      state = await loadState(demo);
      todayQueue = dailyQueue(state);
      if (todayQueue.changed) await saveState(demo, state);
    } catch {
      state = { clips: [] };
      todayQueue = { clips: [], completed: 0, changed: false };
    }
    app.innerHTML = appPage();
  } else if (path === '/') app.innerHTML = landing();
  else if (path === '/privacy') app.innerHTML = privacy();
  else if (path === '/terms') app.innerHTML = terms();
  else app.innerHTML = notFound();
  bindForms();
  const restorePanel = document.querySelector<HTMLDetailsElement>('#restore-license');
  if (location.hash === '#restore-license' && restorePanel) {
    restorePanel.open = true;
  }
  if (announce) {
    const heading = document.querySelector<HTMLHeadingElement>('h1');
    routeStatus.textContent = heading?.textContent || '';
    if (restorePanel?.open) restorePanel.querySelector<HTMLInputElement>('#license-token')?.focus({ preventScroll: true });
    else heading?.focus({ preventScroll: true });
  }
}

function showToast(message: string): void {
  const toast = document.querySelector<HTMLDivElement>('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('shown');
  window.setTimeout(() => toast.classList.remove('shown'), 3200);
}

function download(name: string, type: string, body: string): void {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const link = document.createElement('a');
  link.href = url; link.download = name; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function parseFeed(xml: string): { podcast: string; episodes: Episode[] } {
  const documentXml = new DOMParser().parseFromString(xml, 'application/xml');
  if (documentXml.querySelector('parsererror')) throw new Error('invalid');
  const podcast = documentXml.querySelector('channel > title, feed > title')?.textContent?.trim() || 'Untitled podcast';
  const nodes = [...documentXml.querySelectorAll('item, entry')].slice(0, 50);
  const episodes = nodes.map(node => ({
    title: node.querySelector('title')?.textContent?.trim() || 'Untitled episode',
    url: node.querySelector('link')?.getAttribute('href') || node.querySelector('link')?.textContent?.trim() || '',
    published: node.querySelector('pubDate, published, updated')?.textContent?.trim() || ''
  }));
  if (!episodes.length) throw new Error('empty');
  return { podcast, episodes };
}

function bindForms(): void {
  document.querySelector<HTMLFormElement>('#feed-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const status = form.querySelector<HTMLParagraphElement>('#feed-status')!;
    const picker = form.querySelector<HTMLDivElement>('#episode-picker')!;
    const url = String(new FormData(form).get('feedUrl') || '').trim();
    if (!url) { status.textContent = 'Enter the podcast feed address, then try again.'; return; }
    status.textContent = 'Looking for recent episodes…'; picker.replaceChildren();
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!response.ok) throw new Error(String(response.status));
      const parsed = parseFeed(await response.text());
      const select = document.createElement('select');
      select.id = 'episode-select'; select.name = 'episode-select';
      select.setAttribute('aria-label', 'Choose an episode');
      parsed.episodes.forEach((episode, index) => {
        const option = document.createElement('option'); option.value = String(index); option.textContent = episode.published ? `${episode.title} — ${new Date(episode.published).toLocaleDateString()}` : episode.title; select.append(option);
      });
      const label = document.createElement('label'); label.htmlFor = select.id; label.textContent = 'Choose an episode'; label.append(select); picker.append(label);
      const apply = (episode: Episode) => {
        const clipForm = document.querySelector<HTMLFormElement>('#clip-form')!;
        (clipForm.elements.namedItem('podcast') as HTMLInputElement).value = parsed.podcast;
        (clipForm.elements.namedItem('episode') as HTMLInputElement).value = episode.title;
        (clipForm.elements.namedItem('episodeUrl') as HTMLInputElement).value = episode.url;
      };
      apply(parsed.episodes[0]!);
      select.addEventListener('change', () => apply(parsed.episodes[Number(select.value)]!));
      status.textContent = `Found ${parsed.episodes.length} recent episodes.`;
    } catch {
      status.textContent = 'The feed could not be read. Check its address, or enter the podcast and episode below.';
    }
  });

  document.querySelector<HTMLFormElement>('#clip-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const status = form.querySelector<HTMLParagraphElement>('#clip-status')!;
    if ((demo || !cachedUnlocked()) && state.clips.length >= 8) { status.textContent = 'The free library holds eight clips. Export your notes or delete one to add another.'; return; }
    const data = new FormData(form);
    const seconds = parseTimestamp(String(data.get('timestamp') || ''));
    if (seconds === null) { status.textContent = 'The timestamp format is not valid. Use 12:34 or 1:12:34.'; return; }
    const clip: Clip = {
      id: crypto.randomUUID(), podcast: String(data.get('podcast') || '').trim(), episode: String(data.get('episode') || '').trim(), episodeUrl: String(data.get('episodeUrl') || '').trim(),
      feedUrl: String(new FormData(document.querySelector<HTMLFormElement>('#feed-form')!).get('feedUrl') || ''), timestampSec: seconds,
      prompt: String(data.get('prompt') || '').trim(), takeaway: String(data.get('takeaway') || '').trim(), createdAt: new Date().toISOString(), dueAt: new Date().toISOString(), intervalDays: 1, reviewCount: 0
    };
    if (!clip.podcast || !clip.episode || !clip.prompt || !clip.takeaway) { status.textContent = 'Complete every required field, then save again.'; return; }
    state.clips.push(clip); dailyQueue(state); await saveState(demo, state); form.reset(); revealedId = ''; await render(false); showToast('Recall question saved.');
  });

  document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const status = form.querySelector<HTMLParagraphElement>('#license-status')!;
    status.textContent = 'Checking the license…';
    const result = await restoreLicense(String(new FormData(form).get('token') || ''));
    licenseInactive = result.outcome === 'invalid';
    status.textContent = result.unlocked
      ? 'License verified. Unlimited clips are active.'
      : result.outcome === 'unavailable'
        ? 'We could not check this license. Try again in a moment. The free limit still applies.'
        : 'That license is not active. Check the token and try again.';
  });

  document.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', async event => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0]; if (!file) return;
    try {
      const imported = validateImportedState(JSON.parse(await file.text()));
      if (!imported) throw new Error('invalid');
      // Persist the already validated candidate before changing the in-memory
      // library. A rejected or failed import therefore leaves both intact.
      await saveState(demo, imported);
      state = imported;
      await render(false);
      showToast('Backup imported.');
    } catch { showToast('That backup could not be read. Choose a Recall Loop JSON file.'); }
  });
}

document.addEventListener('click', async event => {
  const target = (event.target as Element).closest<HTMLElement>('[data-link], [data-action], a[href]');
  if (!target) return;
  if (target instanceof HTMLAnchorElement && demo && !isDemoUrl(target.href) && !target.matches('[data-link]')) {
    event.preventDefault();
    await resetDemo();
    location.assign(target.href);
    return;
  }
  if (target.matches('[data-link]')) {
    event.preventDefault(); await navigate((target as HTMLAnchorElement).href); return;
  }
  const action = target.dataset.action;
  if (action === 'reveal') { revealedId = target.dataset.id || ''; await render(false); document.querySelector<HTMLElement>('.revealed')?.focus(); }
  if (action === 'review-remembered' || action === 'review-sooner') {
    const id = target.dataset.id; state.clips = state.clips.map(clip => clip.id === id ? scheduleClip(clip, action === 'review-remembered' ? 'remembered' : 'sooner') : clip); if (id) completeDailyQueueItem(state, id); revealedId = ''; await saveState(demo, state); await render(false); showToast(action === 'review-remembered' ? 'Saved. This question will return later.' : 'Saved. This question will return tomorrow.');
  }
  if (action === 'delete') {
    const clip = state.clips.find(item => item.id === target.dataset.id); if (!clip || !confirm(`Delete “${clip.prompt}”? This cannot be undone.`)) return;
    state.clips = state.clips.filter(item => item.id !== clip.id); completeDailyQueueItem(state, clip.id); await saveState(demo, state); await render(false); showToast('Question deleted.');
  }
  if (action === 'export-csv') download('podcast-recall-clips.csv', 'text/csv', toCsv(state.clips));
  if (action === 'export-md') download('podcast-recall-clips.md', 'text/markdown', toMarkdown(state.clips));
  if (action === 'export-json') download('podcast-recall-backup.json', 'application/json', JSON.stringify(state, null, 2));
  if (action === 'export-reminder') {
    const start = new Date(); start.setDate(start.getDate() + 1); start.setHours(9, 0, 0, 0);
    const stamp = start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    download('podcast-recall-reminder.ics', 'text/calendar;charset=utf-8', `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Podcast Recall Loop//EN\r\nBEGIN:VEVENT\r\nUID:podcast-recall-loop-daily\r\nDTSTAMP:${stamp}\r\nDTSTART:${stamp}\r\nRRULE:FREQ=DAILY\r\nSUMMARY:Recall three podcast ideas\r\nURL:https://podcast-recall-loop.sociobot.in/app\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`);
    showToast('Daily calendar reminder downloaded.');
  }
  if (action === 'reset-demo') { await resetDemo(); state = await loadState(true); revealedId = ''; await render(false); showToast('Demo reset to five sample clips.'); }
  if (action === 'leave-demo') { revealedId = ''; await navigate('/app'); }
  if (action === 'apply-update') {
    const registration = await navigator.serviceWorker.getRegistration();
    const waiting = registration?.waiting;
    if (!waiting) { showToast('The update is no longer waiting. Reload to check again.'); return; }
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
    waiting.postMessage('SKIP_WAITING');
  }
});

window.addEventListener('popstate', async event => {
  const savedY = typeof (event.state as NavigationState | null)?.scrollY === 'number'
    ? (event.state as NavigationState).scrollY!
    : 0;
  if (demo && !isDemoUrl(location.href)) await resetDemo();
  await render();
  requestAnimationFrame(() => window.scrollTo(0, savedY));
});
let scrollFrame = 0;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    rememberScrollPosition();
  });
}, { passive: true });
window.addEventListener('online', () => { online = true; render(false); });
window.addEventListener('offline', () => { online = false; render(false); });

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;
  const registration = await navigator.serviceWorker.register('/sw.js');
  const promptUpdate = () => {
    const toast = document.querySelector<HTMLDivElement>('#toast');
    if (toast) toast.innerHTML = 'An update is ready. <button data-action="apply-update">Apply update</button>';
    toast?.classList.add('shown');
  };
  if (registration.waiting) promptUpdate();
  registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', () => { if (registration.waiting && navigator.serviceWorker.controller) promptUpdate(); }));
}

const startsInDemo = location.pathname.replace(/\/$/, '') === '/demo' || new URL(location.href).searchParams.get('demo') === '1';
if (!startsInDemo) acceptLicenseFromUrl();
const initiallyUnlocked = !startsInDemo && cachedUnlocked();
await render(false);
if (!startsInDemo) void verifyLicense().then(result => {
  const wasInactive = licenseInactive;
  licenseInactive = result.outcome === 'invalid';
  if ((result.unlocked !== initiallyUnlocked || licenseInactive !== wasInactive) && location.pathname === '/app') render(false);
});
void registerServiceWorker();
