# Podcast Recall Loop — polish round 1 handoff

## Outcome

**PASS.** Repair commit `9831c19650d7a3fd9f738cc3f0f7c2f86a989a9e` repairs every blocking and minor finding in `.factory/review-1.md` and rechecks the earlier verification trail. The deployed static artifact is live at <https://podcast-recall-loop.sociobot.in>.

## What changed

- Isolated demo licensing completely from the real browser namespace, including direct `?demo=1` / `?license=` entry; leaving the demo destroys its sample workspace.
- Added seed/reset, answer-based scheduling, and daily calendar reminder claims with observable tests.
- Strengthened the $9 one-time checkout fixture to verify product, currency, billing mode, and cents.
- Published static per-route metadata shells and runtime metadata updates for demo, app, legal routes, and 404.
- Rewrote first-screen, feed, license, README, legal, and product copy in plain language.
- Preserved the glacial-ceramic visual system, generated art, local-first PWA architecture, and static deployment class.

## Exact verification

Fresh clone: `/tmp/podcast-recall-clean-TSbqdp` at repair commit `9831c19`.

- `npm ci`: 61 packages installed; `npm audit --audit-level=high`: 0 vulnerabilities.
- Every one of the 24 `test` commands declared in `.factory/claims.json` was run independently and passed. Browser claims passed in desktop and 390×844 Chromium; `@claim:build-coupled-updates` passed in Vitest.
- `npm test`: 74 passed (1.4m).
- `npm run test:unit`: 9 passed in 2 files.
- `npm run build`: passed; `dist/` contains root `index.html`, route shells, and 404.
- Live deploy: `/opt/fleet/lib/deploy-static.sh podcast-recall-loop dist` completed as deployment `657513c1-eff8-424b-ac81-25542901e4e2`.
- Cold production: `verify-url.sh` passed; route-specific mobile Axe checks on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/missing-page` reported no serious/critical issues, no unexpected console errors, exactly one `h1` and `main`, and no horizontal overflow.
- Live offline: service worker controlled `/demo`; after offline reload the notice and reveal action remained available.
- Live policy: `/missing-page` is HTTP 404; checkout is HTTP 303; hashed JS is immutable-cacheable; local and live SHA-256 values match for home HTML, demo HTML, JS, and service worker.
- Lighthouse mobile: 96 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.13 s, CLS 0.

Evidence and the full finding map are in [`.factory/polish-1.md`](polish-1.md) and [`.factory/evidence/polish-1`](evidence/polish-1).

## Run and deploy

```sh
npm ci
npm test
npm run test:unit
npm run build
```

Deploy `dist/` with the factory static deployment work order. No known gaps remain.
