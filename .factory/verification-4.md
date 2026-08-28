# Independent verification 4 — PASS

**Candidate:** `29a95e593eb9bc5adaefe0fd14f2bc717bb26ed0`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>  
**Verified:** 2026-08-28

## Decision

**PASS — release candidate accepted.** The live deployment is an exact asset match for the candidate build. The earlier reported deployment-only problem is not reproducible.

## Mandatory preflight and cold read

`.factory/claims.json` exists and contains 21 entries. After `npm ci` in this clean checkout, I ran every declared command independently, in declaration order, using the product's demo entry point. All passed in both configured Chromium projects where applicable:

| Claims | Result |
| --- | --- |
| `offline-reload`, `demo-isolation`, `rss-lookup`, `daily-three`, `csv-export`, `markdown-export`, `free-limit` | PASS |
| `free-reviews-exports`, `local-privacy`, `no-account`, `browser-persistence`, `metadata-only`, `manual-authorship` | PASS |
| `json-backup`, `spaced-schedule`, `installable-pwa`, `existing-license`, `one-time-unlimited`, `license-restore` | PASS |
| `build-coupled-updates`, `sociobot-billing` | PASS |

Cold production first-read: **“Remember what your podcasts taught you”** says it helps listeners retain podcast ideas; **“For curious listeners who save good moments but forget the ideas”** says who it is for; **“Try it with sample data”** is visible on the first screen and says it loads five clips with no setup. This meets the plain-words and one-click demo gate. `/demo` immediately showed five sample clips and the persistent **“Demo — sample data, nothing is saved to your notes”** banner with **Reset demo** and **Start for real**.

## Clean local quality gates

- `npm ci`: PASS — 61 packages; zero audit vulnerabilities.
- `npm run test:unit`: PASS — 9 tests in 2 files.
- `npm test`: PASS — 68 Playwright tests.
- `npm run build`: PASS — typecheck, Vite production build, and service-worker finalizer; `dist/` produced.
- `npm audit --audit-level=high`: PASS — zero vulnerabilities.
- Initial bundle: 25,765 bytes JS / 14,077 bytes CSS raw; 9,180 bytes JS / 4,185 bytes CSS gzip, within the 200 KB / 50 KB budgets.

## End-to-end, PWA, privacy, and deployment checks

- Fresh live RSS flow: `https://feeds.simplecast.com/54nAGcIl` populated 50 episodes and filled the podcast/episode fields. The only external request was the feed URL after the explicit **Find episodes** action.
- Recovery: empty RSS entry says “Enter the podcast RSS address, then try again.” A `12:99` timestamp is rejected by native validation; replacing it with `1:02:03` saved the clip. Invalid JSON backup reports “That backup could not be read. Choose a Recall Loop JSON file.”
- Demo review made no external request, contains no media elements, and has no sign-in controls. Saved data is isolated from the real IndexedDB library; the declared claims cover persistence, exports/import, free limit, scheduling, and manual authorship.
- Live `/demo` acquired a controlling service worker. After setting the browser offline and reloading, it retained the recall queue, showed the offline notice, and exposed **Reveal my takeaway**. The build-coupled worker claim passed; source and production worker implement versioned precache, `SKIP_WAITING`, `clients.claim()`, and an in-app update action.
- Live SHA-256 values match the candidate `dist/` files: `index-D1Lbzi8r.js` `62a2aee45da52196179cb2443a6a5bcb63eb61d909a54e0c9e10f5c27aeb0143`, `index-DF4MFbTz.css` `9f7b65ec5a50c8d4d6974b85d1e7fc91a807c75ffc0d1951095800be063e0b0c`, and `sw.js` `c5e4d55d72485181bba7f7113deaf4b7ce0fda957f5cf03c58dfc340e691662f`.
- Checkout starts only at the required Sociobot endpoint and returned HTTP 303 to hosted Dodo checkout. No purchase was submitted and no payment-provider URL is embedded in the product.
- Rate limiting: a fresh simultaneous burst of 40 invalid verification requests returned **30×200 and 10×429**. Every 429 supplied **`Retry-After: 4`** seconds; the effective burst threshold is 30 requests per window.

## Accessibility, responsive behavior, policy, and performance

- Fresh Axe scans on desktop `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the designed 404 found **zero serious or critical findings**. All real routes had one `h1`, one `main`, a title, and `lang=en`; no console or page errors. The deliberate direct HTTP 404 logs the expected failed-resource console message only.
- At 390×844 on `/`, `/demo`, `/app`, `/privacy`, and `/terms`, `scrollWidth === clientWidth === 390`; zero serious/critical Axe findings and no console errors. Evidence: `evidence/verification-4/live-cold-desktop.png` and `live-demo-mobile.png`.
- Keyboard-only: first Tab reaches the skip link with `rgb(138, 88, 20) solid 3px` focus outline; Enter opens the demo and reveals a takeaway. Reduced motion reports `scroll-behavior: auto` and 0.01 ms animation/transition duration.
- Live policy: HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, camera/microphone/geolocation permissions policy, and CSP are present. Hashed JS/CSS use one-year immutable caching; `sw.js` is `no-cache, no-store, must-revalidate`; manifest revalidates hourly; unknown route returns HTTP 404.
- Fresh mobile Lighthouse: **Performance 98, Accessibility 100, Best Practices 100, SEO 100**; LCP 2,048 ms, CLS 0, TBT 0. Raw report: `evidence/verification-4/lighthouse-mobile.json`.

## Defects by severity

None found. The known product limitation remains intentional: some podcast hosts do not permit browser CORS RSS requests; the fully functional manual podcast/episode entry path is available.
