import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { sampleClips } from '../../src/sample';

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

  test('the service worker discovers fingerprinted build assets', () => {
    const worker = readFileSync('public/sw.js', 'utf8');
    const vite = readFileSync('vite.config.ts', 'utf8');
    expect(worker).not.toContain('/assets/app-v1.js');
    expect(worker).not.toContain('/assets/app-v1.css');
    expect(vite).toContain("entryFileNames: 'assets/[name]-[hash].js'");
  });

  test('the update path claims clients and activates only after user action', () => {
    const worker = readFileSync('public/sw.js', 'utf8');
    const app = readFileSync('src/app.ts', 'utf8');
    expect(worker).toContain("event.data === 'SKIP_WAITING'");
    expect(worker).toContain('self.clients.claim()');
    expect(app).toContain("data-action=\"apply-update\"");
    expect(app).toContain("postMessage('SKIP_WAITING')");
  });
});
