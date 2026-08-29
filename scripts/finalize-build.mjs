import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export function renderServiceWorker(template, html) {
  const assetUrls = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(match => match[1]);
  const shell = [...new Set([
    '/', '/index.html', '/offline.html', '/manifest.webmanifest', '/favicon.svg',
    '/assets/recall-ceramics.webp', '/assets/recall-ceramics-small.webp', '/icon-192.png',
    ...assetUrls
  ])];
  const buildId = createHash('sha256').update(html).digest('hex').slice(0, 12);
  if (!template.includes('__BUILD_ID__') || !template.includes('__PRECACHE_MANIFEST__')) {
    throw new Error('Service-worker build placeholders are missing.');
  }
  return template
    .replace('__BUILD_ID__', buildId)
    .replace('__PRECACHE_MANIFEST__', JSON.stringify(shell));
}

const routeMetadata = {
  '/demo': ['Demo — Podcast Recall Loop', 'Try five sample podcast clips in a private demo.'],
  '/app': ['Recall queue — Podcast Recall Loop', 'Save podcast moments and review up to three questions today.'],
  '/privacy': ['Privacy — Podcast Recall Loop', 'See what Podcast Recall Loop stores in this browser.'],
  '/terms': ['Terms — Podcast Recall Loop', 'Read the terms for Podcast Recall Loop.'],
  '/404': ['Page not found — Podcast Recall Loop', 'This Podcast Recall Loop page could not be found.']
};

export function renderRouteShell(html, path) {
  const [title, description] = routeMetadata[path];
  const urlPath = path === '/404' ? '/404' : path;
  const canonical = `https://podcast-recall-loop.sociobot.in${urlPath}`;
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(" \/>)/, `$1${description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(" \/>)/, `$1${canonical}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, `$1${description}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(" \/>)/, `$1${canonical}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(" \/>)/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(" \/>)/, `$1${description}$2`);
}

export async function finalizeBuild(root = process.cwd()) {
  const htmlPath = `${root}/dist/index.html`;
  const workerPath = `${root}/dist/sw.js`;
  const [html, worker] = await Promise.all([
    readFile(htmlPath, 'utf8'),
    readFile(workerPath, 'utf8')
  ]);
  await writeFile(workerPath, renderServiceWorker(worker, html));
  await Promise.all(Object.keys(routeMetadata).map(async path => {
    const shell = renderRouteShell(html, path);
    if (path === '/404') return writeFile(`${root}/dist/404.html`, shell);
    const directory = `${root}/dist${path}`;
    await mkdir(directory, { recursive: true });
    return writeFile(`${directory}/index.html`, shell);
  }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await finalizeBuild();
