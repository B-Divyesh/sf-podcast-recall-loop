# Podcast Recall Loop v1.0.1 repair handoff

## Release status

The release-blocking findings in `.factory/verification.md` are repaired. Product code was committed and pushed in `0795734` and `bee9af3`. The final `bee9af3` build was deployed to <https://podcast-recall-loop.sociobot.in> with Azure Static Web Apps deployment `e319d0a8-51ba-4803-bd1b-ccb708da7b1c` on 28 August 2026.

## Repairs

- Isolated Vitest to `tests/unit/**/*.test.ts` and Playwright to `*.spec.ts`. `npm run test:unit` now runs seven real unit and release-policy tests.
- Removed the unavailable checkout and all $9 sales copy. The Sociobot catalog does not contain `podcast-recall-loop`, and repository policy forbids changing billing infrastructure here. Existing returned licenses still verify and remove the eight-clip limit.
- Expanded `.factory/claims.json` from eight to fifteen claims. Every claim has exactly one tagged Playwright test and passes on desktop and 390×844 mobile Chromium.
- Removed all fictional `example.com/episodes/*` links from sample data.
- Changed the footer from the TLS-invalid `www.sociobot.in` host to `https://sociobot.in/` and added a live-response regression.
- Changed JS and CSS output to content-hashed filenames. `/assets/*` now has `public, max-age=31536000, immutable`; `sw.js` is no-store and the manifest revalidates.
- Updated the service worker to discover hashed assets from built HTML while retaining its versioned cache and user-controlled update prompt.
- Removed a route-focus race and added 44px touch targets for navigation, footer, demo, and first-step links.
- Updated README, copy audit, version copy, and claim documentation without changing the researched product job or visual system.

## Verification evidence

Run from `/work/repo`:

```sh
npm ci
npm test
npm run test:unit
npm run build
npm audit --audit-level=high
```

Final results:

- Clean install: 61 packages installed; zero vulnerabilities.
- Playwright: 60 passed across desktop Chromium and 390×844 mobile Chromium.
- Vitest: 7 passed across two isolated unit suites.
- Type check and production build: passed; `dist/index.html` exists.
- Production payload: 8.57 KB gzip JS and 4.11 KB gzip CSS.
- All fifteen commands in `.factory/claims.json`: 2 passed each, one per browser project.
- Accessibility: no serious or critical Axe findings on `/`, `/demo`, `/app`, `/privacy`, `/terms`, or `/missing-page` in light and dark themes. Keyboard navigation, focus transfer, reduced motion, 44px targets, and 390px overflow checks pass.
- Privacy: the complete demo review flow made only same-origin requests. No analytics, media, font, or other third-party request occurred.
- Offline/update: the live service worker controls `/demo`; a 390px offline reload retained the queue and Reveal action. Unit coverage asserts `SKIP_WAITING`, `clients.claim()`, and the in-app Apply update path.
- Live URL verifier: title, `lang=en`, one `h1`, main landmark, image alt text, named buttons, and zero console errors passed. Evidence is in `.factory/evidence/repair-live/`.
- Live identity: SHA-256 hashes for `index.html`, the hashed JS/CSS, and `sw.js` exactly match local `dist/`.
- Live routes: `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/missing-page`, manifest, robots, and sitemap return 200. The canonical factory link returns 200 with valid TLS.
- Response policy: live HSTS, `nosniff`, strict-origin referrer policy, CSP, and permissions policy are present. Hashed JS/CSS return one-year immutable caching; the service worker returns no-store; the manifest revalidates.
- Lighthouse mobile report: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 0.9 s, CLS 0, TBT 0 ms. Lighthouse wrote a complete report, then its browser tab crashed during shutdown; the scores are supporting evidence, not the sole check.

Local screenshots and reports are in `.factory/evidence/repair-local/`; post-deploy screenshots and reports are in `.factory/evidence/repair-live/`.

## Known gap

The researched one-time unlimited tier is not on sale because the factory billing catalog has no enabled product for this slug, and the documented registration helper was not present in this worker. The broken purchase path is no longer shown to users. The free eight-clip product is complete, and existing valid license return tokens remain supported. A future factory billing registration can reintroduce checkout with a real purchase-flow test.
