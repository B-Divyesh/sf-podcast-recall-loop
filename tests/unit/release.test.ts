import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { sampleClips } from '../../src/sample';
import { renderRouteShell, renderServiceWorker } from '../../scripts/finalize-build.mjs';

describe('release regressions', () => {
  test('sample clips never expose fictional dead links', () => {
    expect(sampleClips.every(clip => clip.episodeUrl === '')).toBe(true);
  });

  test('static assets use immutable caching while update files revalidate', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
    const assets = config.routes.find((route: { route: string }) => route.route === '/assets/*');
    const worker = config.routes.find((route: { route: string }) => route.route === '/sw.js');
    const manifest = config.routes.find((route: { route: string }) => route.route === '/manifest.webmanifest');
    expect(assets.headers['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(worker.headers['Cache-Control']).toContain('no-cache');
    expect(manifest.headers['Cache-Control']).toContain('must-revalidate');
  });

  test('the service worker is stamped from fingerprinted build assets', () => {
    const worker = readFileSync('public/sw.js', 'utf8');
    const vite = readFileSync('vite.config.ts', 'utf8');
    expect(worker).not.toContain('/assets/app-v1.js');
    expect(worker).not.toContain('/assets/app-v1.css');
    expect(worker).toContain('__BUILD_ID__');
    expect(worker).toContain('__PRECACHE_MANIFEST__');
    expect(vite).toContain("entryFileNames: 'assets/[name]-[hash].js'");
  });

  test('@claim:build-coupled-updates an app-only build change creates a new worker and cache', () => {
    const template = readFileSync('public/sw.js', 'utf8');
    const oldWorker = renderServiceWorker(template, '<script src="/assets/index-old.js"></script>');
    const newWorker = renderServiceWorker(template, '<script src="/assets/index-new.js"></script>');
    expect(newWorker).not.toBe(oldWorker);
    expect(oldWorker).toContain('/assets/index-old.js');
    expect(newWorker).toContain('/assets/index-new.js');
    expect(newWorker).not.toContain('__BUILD_ID__');
    expect(newWorker).not.toContain('__PRECACHE_MANIFEST__');
  });

  test('known routes have crawlable metadata shells while unknown routes keep HTTP 404', () => {
    const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
    const html = readFileSync('index.html', 'utf8');
    const demo = renderRouteShell(html, '/demo');
    expect(demo).toContain('<title>Demo — Podcast Recall Loop</title>');
    expect(demo).toContain('https://podcast-recall-loop.sociobot.in/demo');
    expect(demo).toContain('Try five sample podcast clips in a private demo.');
  });

  test('the update path claims clients and activates only after user action', () => {
    const worker = readFileSync('public/sw.js', 'utf8');
    const app = readFileSync('src/app.ts', 'utf8');
    expect(worker).toContain("event.data === 'SKIP_WAITING'");
    expect(worker).toContain('self.clients.claim()');
    expect(app).toContain("data-action=\"apply-update\"");
    expect(app).toContain('registration?.waiting');
    expect(app).toContain("postMessage('SKIP_WAITING')");
  });

  test('the offline fallback obeys the self-only style policy', () => {
    const html = readFileSync('public/offline.html', 'utf8');
    const css = readFileSync('public/offline.css', 'utf8');
    expect(html).toContain('<link rel="stylesheet" href="/offline.css" />');
    expect(html).not.toContain('<style>');
    expect(css).toContain('prefers-color-scheme: dark');
    expect(css).toContain('min-height: 44px');
  });

  test('documents the supported Node versions precisely', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.engines.node).toBe('^20.19.0 || >=22.12.0');
    expect(readFileSync('README.md', 'utf8')).toContain('Requires Node.js 20.19+ or 22.12+.');
  });

  test('every registered claim has exactly one test tag and no test tag is unregistered', () => {
    const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string }>;
    const sources = [
      readFileSync('tests/claims.spec.ts', 'utf8'),
      readFileSync('tests/quality.spec.ts', 'utf8'),
      readFileSync('tests/unit/release.test.ts', 'utf8')
    ].join('\n');
    const tagPattern = new RegExp('@' + 'claim:([a-z0-9-]+)', 'g');
    const tagCounts = [...sources.matchAll(tagPattern)].reduce<Record<string, number>>((counts, match) => {
      const id = match[1]!;
      counts[id] = (counts[id] || 0) + 1;
      return counts;
    }, {});
    const registered = claims.map(claim => claim.id).sort();

    expect(Object.keys(tagCounts).sort()).toEqual(registered);
    expect(Object.fromEntries(registered.map(id => [id, tagCounts[id]]))).toEqual(
      Object.fromEntries(registered.map(id => [id, 1]))
    );
  });
});
