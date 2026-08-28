# Independent verification 2 — FAIL

**Candidate:** `1c70712a3221e3345534efc96ab6ec344c6e01ea`<br>
**Live URL:** <https://podcast-recall-loop.sociobot.in><br>
**Verified:** 2026-08-28

## Decision

**FAIL — do not release this candidate as the researched one-time product.** The free local-first recall loop is functional and the deployment is an exact match for the candidate. However, the required one-time unlock cannot be purchased or restored by a new customer: the product has no buy route and the required Sociobot checkout endpoint returns 404. The live site also returns HTTP 200 for arbitrary missing paths rather than a real 404 response.

## Mandatory preflight

`.factory/claims.json` exists. From this clean checkout, I ran every listed command in declaration order against the local demo entry point. Every tagged test passed on both configured Playwright projects (desktop Chromium and 390×844 mobile Chromium):

| Claim | Result |
| --- | --- |
| `offline-reload` | PASS — 2 tests |
| `demo-isolation` | PASS — 2 tests |
| `rss-lookup` | PASS — 2 tests |
| `daily-three` | PASS — 2 tests |
| `csv-export` | PASS — 2 tests |
| `markdown-export` | PASS — 2 tests |
| `free-limit` | PASS — 2 tests |
| `local-privacy` | PASS — 2 tests |
| `browser-persistence` | PASS — 2 tests |
| `metadata-only` | PASS — 2 tests |
| `manual-authorship` | PASS — 2 tests |
| `json-backup` | PASS — 2 tests |
| `spaced-schedule` | PASS — 2 tests |
| `installable-pwa` | PASS — 2 tests |
| `existing-license` | PASS — 2 tests |

Cold production first-read: it says it helps “curious listeners who save good moments but forget the ideas” to “Remember what your podcasts taught you.” The first action is **Try it with sample data**, immediately explained as “Loads five podcast clips. No setup.” This passes the plain-words and one-click-demo requirements. `/demo` has the persistent “Demo — sample data, nothing is saved to your notes” banner, **Reset demo**, and **Start for real**.

## Local quality gates

- `npm ci`: PASS — 61 packages installed; audit reported zero vulnerabilities.
- All fifteen declared claim commands: PASS — 2 browser-project tests each.
- `npm test`: PASS — 60 Playwright tests.
- `npm run test:unit`: PASS — 7 tests in 2 files.
- `npm run build`: PASS — `tsc --noEmit` and Vite completed; `dist/` was produced.
- `npm audit --audit-level=high`: PASS — zero vulnerabilities.
- Production bundle: JS 8.57 KB gzip; CSS 4.11 KB gzip. Both are within the static/PWA budgets.

The automated suite and fresh-browser checks covered RSS fixture lookup, normal save and reload persistence, invalid timestamp rejection and recovery (`12:99` gives native validation and `aria-describedby="timestamp-help"`; `1:02:03` then validates), unreadable-RSS recovery, delete/import/export, eight-clip boundary, three-question queue, demo isolation/reset, and spaced scheduling.

## Deployment, privacy, PWA, and accessibility

- The following SHA-256 values match exactly between fresh local `dist/` and production: `index.html`, `assets/index-BA6u4Lp8.js`, `assets/index-ci84b4aI.css`, `sw.js`, and `manifest.webmanifest`. The prior deployment-only concern is not reproducible.
- Fresh live `/demo` activated a controlling service worker. After a reload, setting the browser offline and reloading again showed “Offline. Your saved clips and review queue still work” and retained the Reveal action.
- A live demo review emitted no cross-origin request. There are no third-party scripts, fonts, media elements, or analytics requests in the tested flow. RSS is requested only on explicit user action. No sign-in flow exists.
- Live desktop and 390px checks across `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the missing-page UI each found `lang=en`, one `h1`, one `main`, no console/page errors, no horizontal overflow, and no Axe serious or critical findings. Keyboard Tab exposed the skip link with a 3px ochre focus outline. Reduced motion reduced transitions/animation to `0.01ms` and set scroll behavior to `auto`.
- Live response policy includes HSTS, `nosniff`, strict-origin referrer policy, CSP, and permissions policy. Fingerprinted JS/CSS are `public, max-age=31536000, immutable`; `sw.js` is `no-cache, no-store, must-revalidate`; the manifest revalidates.
- The service worker has an explicit `SKIP_WAITING`/`clients.claim()` update path and the regression test passes. No new worker version was deployed during this verification, so a live update toast could not be exercised. The cache name is a hand-maintained constant (`recall-loop-shell-v3`), so future releases must change the worker/cache version whenever shell assets change or an already-installed app will not receive an update.

## API rate limit

The only browser-facing server endpoint is license verification. A sequential burst of 40 invalid verification requests with the production Origin returned 30× 200 followed by 10× 429. The first 429 was request 31; every 429 supplied `Retry-After: 4`, and CORS allowed only `https://podcast-recall-loop.sociobot.in`. Rate limiting passes at an observed 30-request window.

## Release-blocking defects

### High — the researched one-time unlock is not purchasable

The brief specifies one-time monetization, and the paid-unlock contract requires a checkout link, return-license storage, verification, and restoration. The current application has no purchase or restore control for a new user. Direct production `GET https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout` returns **404** with `{"error":"enabled factory product","status":404}`. Hidden existing-license verification cannot make a one-time product available to a prospective customer.

Register/enable the product in the Sociobot billing catalog, add the required honest purchase and paste-license UI, and verify checkout → return token → cached/offline license behavior before release. If the paid tier is intentionally removed, change the researched product contract rather than representing this candidate as its completion.

### Medium — missing routes are served with HTTP 200

`/missing-page` renders an attractive in-app not-found screen, but live `GET /missing-page` returns **200**, as will arbitrary unknown paths through `navigationFallback`. The site-structure contract requires a real 404 route/response in addition to a way back. Configure the host's 404 response override/rewrite so unknown routes render this UI with HTTP 404, then test it in deployment.

### Medium — PWA update freshness depends on a manual cache-version edit

The worker's update flow is present, but its byte identity and cache key are static unless a maintainer manually changes `public/sw.js`. A source-only application release can produce a new hashed JS bundle while serving the same worker, so installed clients will not install a new worker, show the update toast, or precache the new shell. Tie worker/cache identity to the build or add a release test that proves an installed old build receives a new app-only deployment.

## Required re-verification

After the blocking purchase path and 404 response are repaired, run every command in `.factory/claims.json`, `npm test`, `npm run test:unit`, and `npm run build`; repeat real checkout and restore-purchase flows; deploy; then recheck live artifact hashes, rate limiting, offline reload, and an actual service-worker update from a prior installed build.
