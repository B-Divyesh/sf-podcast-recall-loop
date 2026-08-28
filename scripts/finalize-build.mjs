import { createHash } from 'node:crypto';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
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

export async function finalizeBuild(root = process.cwd()) {
  const htmlPath = `${root}/dist/index.html`;
  const workerPath = `${root}/dist/sw.js`;
  const [html, worker] = await Promise.all([
    readFile(htmlPath, 'utf8'),
    readFile(workerPath, 'utf8')
  ]);
  await Promise.all([
    writeFile(workerPath, renderServiceWorker(worker, html)),
    copyFile(htmlPath, `${root}/dist/404.html`)
  ]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await finalizeBuild();
