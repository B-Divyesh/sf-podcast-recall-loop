# Independent verification 3 — FAIL

**Candidate:** `35723d590f33cd30645f1068d55b291196db9ef8`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>  
**Verified:** 2026-08-28

## Decision

**FAIL — do not release under the factory claims contract.** The deployed application is an exact build match for this candidate and its functional, PWA, privacy-flow, performance, and accessibility checks pass. However, public landing/README copy contains material reliance claims without entries and observable tests in `.factory/claims.json`. The supplied claims contract makes an unlisted claim a release-blocking finding.

## Mandatory preflight

`.factory/claims.json` exists. From this clean checkout I ran each of its 19 commands, independently and in declaration order, against the shipped demo route. All passed; browser claims passed in both configured projects (desktop Chromium and 390×844 mobile Chromium), and the build-coupled worker claim passed in Vitest.

| Claims | Result |
| --- | --- |
| `offline-reload`, `demo-isolation`, `rss-lookup`, `daily-three`, `csv-export`, `markdown-export`, `free-limit` | PASS |
| `local-privacy`, `browser-persistence`, `metadata-only`, `manual-authorship`, `json-backup`, `spaced-schedule` | PASS |
| `installable-pwa`, `existing-license`, `one-time-unlimited`, `license-restore`, `build-coupled-updates`, `sociobot-billing` | PASS |

Each declared id occurs exactly once as `@claim:<id>` in the shipped tests. The final Playwright status was `passed`, with no failed tests.

Cold production first-read passes: “Remember what your podcasts taught you” says the job; “For curious listeners who save good moments but forget the ideas” identifies the user; **Try it with sample data** says what to click and “Loads five podcast clips. No setup.” says what follows. The demo action is visible on the first screen. `/demo` immediately presents five realistic clips and a persistent “Demo — sample data, nothing is saved to your notes” banner with **Reset demo** and **Start for real**.

## Local quality gates

- `npm ci`: PASS — 61 packages installed, zero audit vulnerabilities.
- `npm test`: PASS — 64 Playwright tests.
- `npm run test:unit`: PASS — 9 tests in 2 files.
- `npm run build`: PASS — `tsc --noEmit`, Vite production build, and worker finalizer; `dist/` produced.
- `npm audit --audit-level=high`: PASS — zero vulnerabilities.
- Built payload: JavaScript 9.23 KB gzip; CSS 4.17 KB gzip. Hero 24.3 KB and mobile hero 9.8 KB. All are within budgets.

## End-to-end and deployment evidence

- Fresh live normal flow: saved a manual clip, reloaded it from IndexedDB, revealed the exact takeaway, and marked it remembered. No console or page errors occurred.
- Boundary/recovery: `12:99` is rejected by native validation; replacing it with `1:02:03` saves successfully. A live CORS-enabled RSS feed (`feeds.simplecast.com`) returned 50 episodes and populated podcast/episode fields. RSS is requested only after **Find episodes**.
- The full test suite additionally covers the eight-clip refusal, three-question queue, delete/JSON restore, CSV/Markdown download, demo isolation/reset, manual authorship, persisted scheduling, fixture license restore/revocation, and checkout link.
- Local/live SHA-256 values are identical for `index.html`, `404.html`, `assets/index-B-hMWyHm.js`, `assets/index-DF4MFbTz.css`, `sw.js`, and `manifest.webmanifest`. The earlier deployment-only mismatch is not reproducible.
- Live checkout is `https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout`; it returned HTTP 303 to hosted Dodo checkout. No payment-provider URL is embedded in the app. No real purchase was submitted.
- A fresh 390px live demo activated a controlling service worker. After offline reload it retained the recall queue, offline notice, and **Reveal my takeaway** action. The build-coupled worker claim verifies a changed fingerprinted shell produces a different worker/cache/precache list. No newer production version existed during this verification, so an actual old-to-new live update toast could not be observed.
- The demo review flow made zero cross-origin requests. It contains no audio/video elements or media requests; notes are browser-local. There is no sign-in flow.

## Accessibility, security, and performance

- `/opt/fleet/lib/verify-url.sh` on live `/`: PASS — HTTP 200, 602 ms cold navigation, no errors, `lang=en`, one `h1`, one `main`, all images have alt text, and no unlabeled buttons.
- Fresh live Axe checks found zero serious/critical findings on desktop `/`, `/demo`, `/app`, `/privacy`, `/terms`, and designed 404; repeated 390px checks on all five real routes found zero serious/critical findings, no horizontal overflow, one `h1`, one `main`, and no console/page errors. The browser reports the expected failed-resource message when directly navigating to the real HTTP 404.
- Keyboard testing exposed the skip link with `rgb(138, 88, 20) solid 3px` focus outline. Enter activates recall controls. Reduced motion yields 0.01 ms animation/transition and `scroll-behavior: auto`.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, permissions policy, and a CSP. Hashed JS/CSS use one-year immutable caching; `sw.js` is `no-cache, no-store, must-revalidate`; manifest is one-hour revalidated. Unknown live paths return HTTP 404.
- Fresh mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,317 ms, CLS 0, TBT 9 ms.
- Rate-limit test: 40 rapid invalid license verification requests with production Origin returned 31× HTTP 200, then 9× HTTP 429. The first 429 was request 32. Every 429 included `Retry-After` (4, falling to 2 seconds). This passes the server endpoint requirement.

## Release-blocking defects

### High — public claims lack required executable coverage

The factory claims rule says that any visitor-facing claim without a `.factory/claims.json` entry and observable demo-entry test fails review. The following are material promises but have no matching declared claim/test:

1. Landing: “**The app has no account** or tracking.” `local-privacy` observes one demo review flow for cross-origin traffic, but does not assert the no-account promise (or a no-auth/account outcome).
2. Landing and README: “Sociobot is the merchant of record and **handles refunds**.” `sociobot-billing` proves the product endpoint and absence of an embedded payment-provider link; it does not observe or prove refund handling.
3. Landing: “**Reviews, exports, and accessibility stay free.**” The suite separately tests demo exports and the eight-clip limit, but does not prove that these facilities remain usable in the free real library.

Either remove/narrow these promises to what the current claims prove, or add one uniquely tagged, demo-entry observable test and a claim entry for each. Re-run all claim commands after the correction. This is a documentation/test-contract correction; no functional defect was observed in the candidate.

## Required re-verification

After repairing claims coverage, rerun all commands in `.factory/claims.json`, `npm test`, `npm run test:unit`, and `npm run build`; recheck the public deployment hash, checkout redirect, offline reload, and the license endpoint’s rate limit.
