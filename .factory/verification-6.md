# Independent verification 6 — PASS

**Candidate:** `baa86c32fd5ea793cf86e5cd4ed5c78b360306b1`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>  
**Verified:** 2026-08-29 UTC from a fresh `npm ci` checkout. This is an independent QA report; product source was not changed.

## Release decision

**PASS.** The deployed static artifact is the candidate build, all required claim tests pass, and the real podcast-capture/recall workflow works on desktop and 390 px mobile. No release-blocking defects were found.

## Mandatory claim gate

`.factory/claims.json` exists and contains 26 declared claims. Every listed command was run individually against the product demo entry point after `npm ci`; each passed. Playwright claim commands reported two passing tests each unless noted below.

| Claim ID | Result |
| --- | --- |
| `offline-reload` | PASS |
| `demo-isolation` | PASS |
| `demo-seed-reset` | PASS |
| `rss-lookup` | PASS |
| `feed-explicit-request` | PASS |
| `atom-lookup` | PASS |
| `daily-three` | PASS |
| `csv-export` | PASS |
| `markdown-export` | PASS |
| `free-limit` | PASS |
| `free-reviews-exports` | PASS |
| `local-privacy` | PASS |
| `no-account` | PASS |
| `browser-persistence` | PASS |
| `metadata-only` | PASS |
| `manual-authorship` | PASS |
| `json-backup` | PASS |
| `spaced-schedule` | PASS |
| `review-results` | PASS |
| `calendar-reminder` | PASS |
| `installable-pwa` | PASS |
| `existing-license` | PASS |
| `one-time-unlimited` | PASS |
| `license-restore` | PASS |
| `build-coupled-updates` | PASS — `npm run test:unit -- -t @claim:build-coupled-updates`, 1 test passed |
| `sociobot-billing` | PASS |

## First-read test

Cold opening the live landing page gave this answer without scrolling: it helps **curious podcast listeners who save good moments but forget the ideas** to **remember what their podcasts taught them**. The primary, one-click action is **“Try it with sample data”**, with the immediate result stated beside it: **“Loads five podcast clips. No setup.”** It opens the isolated `?demo=1` workspace. The first screen also states local-browser storage, offline review after the first visit, and the eight-clip free limit in plain words. This passes the plain-words and demo-sandbox gate.

## Local quality gates

```text
npm ci                                      PASS (62 packages; 0 vulnerabilities)
npm test                                    PASS — 80 passed (2.4m)
npm run test:unit                           PASS — 9 passed
npm run build                               PASS — dist/ produced
```

The exact production build emitted `28.30 kB` JavaScript (`9.90 kB` gzip) and `14.18 kB` CSS (`4.20 kB` gzip), comfortably below the static/PWA budgets. The LCP image is `24,292` bytes WebP.

## Live deployment, privacy, and PWA evidence

- Candidate match: live JS, CSS, manifest, hero asset, and `sw.js` matched the corresponding `dist/` bytes. Live/local JS SHA-256 was `b9f0c6db7ab1371ada509f3d9f79ad097480c5c450a17573bf6cfbf4a48ddc55`; the worker digest was `d707a94c57a83e24b3a054eb50afd05929351d3b8f6033c0e589fba1a5b1ade2`.
- A fresh live demo request log while opening, revealing, and reviewing a sample question contained only `https://podcast-recall-loop.sociobot.in` requests. No note content, media, analytics, sign-in, or tracking request left the origin. Feed lookup is separately claim-tested to occur only after the explicit action.
- PWA: the live manifest is standalone with 192/512 maskable icons. After activation, `navigator.serviceWorker.controller` was true; the active worker was `/sw.js`, scope was `/`, and cache name was `recall-loop-shell-fcfc886d0a91`. `registration.update()` found no currently waiting update. The build-coupled-updates claim passed, proving different fingerprinted app assets produce a new worker/cache identity.
- Offline: after the first `/demo` visit and a controlled reload, setting the browser offline and reloading still showed the offline notice and **Reveal my takeaway** control.
- The available hosted product-unlock verify endpoint was rate tested with a deliberately invalid token: requests 1–30 returned 200; request 31 returned **429** with `Retry-After: 3` and `X-RateLimit-After: 3`. Observed allowance: **30 requests per client window**.
- Security and caching: live pages send HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive permissions policy, and CSP including `frame-ancestors 'none'`. Hashed JS/CSS and image assets are `public, max-age=31536000, immutable`; `/sw.js` is `no-cache, no-store, must-revalidate`; the manifest is revalidated hourly.

## Workflow, accessibility, and responsive checks

- Normal real-library capture saved a learner-written podcast, episode, timestamp, question, and takeaway; it was present after reload. Native form validation rejects malformed timestamp `1:99` (“Please match the requested format.”) and malformed feed URLs (“Please enter a URL.”).
- The live demo begins with five clips and three due prompts. Keyboard Enter opened the sample demo and revealed the takeaway. The first Tab target was the skip link, with a visible `3px` ochre focus outline and a 195×45 px target.
- Live Axe scans on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/missing-page` found zero serious/critical violations. All normal public routes logged no console or page errors. Directly requesting the intentional 404 produced the browser’s expected failed-resource console line while returning the designed 404 page and HTTP 404.
- At a 390×844 mobile viewport, document scroll width equaled client width (390 px); no horizontal overflow occurred. Visual inspection of desktop and mobile demo screens confirmed readable stacked form controls and 44 px-or-larger interactive targets.
- With reduced motion emulated, the active card animation and transition durations were `0.00001s` and document scrolling was `auto`.
- All route shells have one `<main>`, one `<h1>`, `lang="en"`, route-specific titles, and no normal-route console errors. Internal routes and legal pages return 200; `/missing-page` correctly returns 404. The Sociobot checkout endpoint returns a 303 to hosted checkout; no payment-provider link is embedded in the product UI.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

## Notes

An attempted independent mobile Lighthouse run could not connect to the preinstalled headless Chromium from this container, so no new Lighthouse score is asserted here. The independent browser audits, bundle measurements, responsive checks, headers, and live Axe results above were completed successfully.
