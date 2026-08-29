# Independent verification 5 — PASS

**Candidate:** `4b42b4a3d248319b654b07ab376293033e317cb7`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>  
**Verified:** 2026-08-29

## Decision

**PASS — accepted for release.** The earlier deployment-only concern is not reproducible. A fresh production build matches the live HTML, JavaScript, CSS, and service worker byte-for-byte.

## Mandatory claim gate and cold read

`.factory/claims.json` exists and has 24 valid claim entries. From this clean checkout, after `npm ci`, I ran every declared command separately, in listed order. All passed:

- `offline-reload`, `demo-isolation`, `demo-seed-reset`, `rss-lookup`, `daily-three`, `csv-export`, `markdown-export`, `free-limit`
- `free-reviews-exports`, `local-privacy`, `no-account`, `browser-persistence`, `metadata-only`, `manual-authorship`, `json-backup`, `spaced-schedule`, `review-results`, `calendar-reminder`
- `installable-pwa`, `existing-license`, `one-time-unlimited`, `license-restore`, `build-coupled-updates`, `sociobot-billing`

Cold live first read passed. The first screen says **“Remember what your podcasts taught you”**, identifies **“curious listeners who save good moments but forget the ideas”**, and offers the visible one-click **“Try it with sample data”** action with **“Loads five podcast clips. No setup.”** The demo opened with five realistic sample clips plus the Demo / Reset demo / Start for real controls.

## Local quality gates

- `npm ci`: PASS; 61 packages installed, zero reported audit vulnerabilities.
- `npm test`: PASS; 74 Playwright tests.
- `npm run test:unit`: PASS; 9 tests in 2 files.
- `npm run build`: PASS; TypeScript check, Vite production build, service-worker finalizer, and `dist/` all completed.
- Built initial assets: 27,671 bytes JS (9,690 gzip) and 14,177 bytes CSS (4,200 gzip), within the static-product 200 KB / 50 KB budgets.

## Independent product exercise

- Empty app state gives a clear next step. Empty feed entry reports the corrective message.
- An RSS fixture populated two episodes and filled podcast, episode, and episode-link fields. An invalid `12:99` timestamp reported the stated recovery message; `1:02:03` then saved successfully.
- A saved recall question persisted through reload. CSV, Markdown, and JSON exports contained it; malformed JSON backup produced the recovery toast; reveal + **I remembered** scheduled it later; the downloaded calendar file contains `RRULE:FREQ=DAILY`.
- Keyboard-only operation passed for Try sample data, Reset demo, Reveal, and I remembered. First Tab reaches the skip link, Enter lands on `main`, and focused controls visibly render `rgb(138, 88, 20) solid 3px`.
- With `prefers-reduced-motion: reduce`, the active-card animation and transition were `0.00001s` and document scrolling was `auto`.
- Axe found no serious or critical findings on local desktop `/`, `/demo`, `/app`, `/privacy` or live 390px `/` and `/demo`. No console or page errors occurred in the exercised flows.

## PWA, privacy, deployment, and policy

- Live `/demo` registered and was controlled by `/sw.js`. Offline reload retained the five clips, demo controls, recall heading, and offline notice.
- A memory-only replacement-worker harness independently caused a waiting worker, displayed **“An update is ready. Apply update”**, and reloaded successfully after applying it. The required build-coupled update claim also passed.
- Playwright recorded no external request during the full live demo recall/reset flow. Cold production load made only same-origin document, JS, CSS, and image requests. There are no analytics, account, audio, or third-party font requests.
- Live response headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, camera/microphone/geolocation permissions policy, and a CSP. Hashed JS is `max-age=31536000, immutable`; `sw.js` is no-cache/no-store; manifest revalidates hourly; an unknown route returns HTTP 404.
- Live SHA-256 matches freshly built candidate files: `index.html` `51ea8e78cdf701bc9d29d833111f85b418d50111a50a0e78e2a57b5f07f6f561`; `index-BO1tichk.js` `835ec9c777c1abf50ca7268d01394811d2ce692db545437dbfd0786a6b183c33`; `index-CB1EBUkx.css` `0fe67a484500db387d9f8fa012dddb5262beae4480df82037febdbf270d14078`; `sw.js` `cfd085ba915cc564645fe25d06fdc4f6c241c8a6d4797343a4d645779dd6d7c6`.
- Product routes, robots, sitemap, manifest, and favicon returned 200. The Sociobot checkout endpoint returned 303; no purchase was attempted.
- Rate limit evidence: one client made 30 invalid license-verification requests successfully; request 31 returned `429` with `Retry-After: 3` (and `X-RateLimit-After: 3`). Observed allowance: 30 requests per window.

## Performance

Fresh live mobile Lighthouse: **99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO**; FCP 0.9 s, LCP 1.3 s, CLS 0, TBT 140 ms. Total transfer was 77,620 bytes across seven requests, with zero third-party transfers.

## Defects by severity

None. The intentional browser limitation remains documented: an RSS host that does not allow browser CORS cannot be looked up directly, and the product provides its fully functional manual podcast/episode path.
