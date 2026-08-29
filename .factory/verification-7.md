# Independent verification 7 — PASS

**Candidate:** `d12f490f3cf0942fe5182bc1075a21786374bae9`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>  
**Verified:** 29 August 2026

## Release decision

**PASS.** The public deployment is byte-for-byte the production build from the
candidate and the product meets the researched brief: it is a local-first PWA
for learners to capture a podcast timestamp, write their own takeaway and
question, and review up to three due questions. No release-blocking defects
were found.

## Required claim gate

`.factory/claims.json` exists and declares 26 claims. After `npm ci`, every
listed command was run separately against the shipped demo entry point. All
passed, including the unit-level service-worker build-coupling claim:

`offline-reload`, `demo-isolation`, `demo-seed-reset`, `rss-lookup`,
`feed-explicit-request`, `atom-lookup`, `daily-three`, `csv-export`,
`markdown-export`, `free-limit`, `free-reviews-exports`, `local-privacy`,
`no-account`, `browser-persistence`, `metadata-only`, `manual-authorship`,
`json-backup`, `spaced-schedule`, `review-results`, `calendar-reminder`,
`installable-pwa`, `existing-license`, `one-time-unlimited`,
`license-restore`, `build-coupled-updates`, and `sociobot-billing`.

## First read and end-to-end evidence

Cold-opening the live page says, in plain words, **“Remember what your
podcasts taught you”** for **“curious listeners who save good moments but
forget the ideas.”** The first primary action is the visible, one-click **“Try
it with sample data”**; adjacent copy says it opens five fictional sample
clips with no setup. This passes the plain-words and demo-sandbox gate.

On the live `/demo` route, the five seeded clips and three due questions were
present with the persistent Demo / Reset demo / Start for real banner. A
keyboard and pointer review revealed a takeaway and **I remembered** reduced
the queue from three to two. A manually entered valid `1:02:03` clip saved and
appeared in the library. Reset demo restored five clips and three due prompts.
The native timestamp constraint rejected `61:99` with “Please match the
requested format.”

The exact checkout link is the Sociobot product endpoint. It returned HTTP
303 to the hosted Sociobot/Dodo page, which displayed **Podcast Recall Loop
Unlimited**, **$9.00**, and a one-time license description. No embedded
payment-provider link appears in the product UI.

## Local quality gates

```text
npm ci                         PASS — 61 packages added; 0 vulnerabilities
npm test                        PASS — 80 Playwright tests passed
npm run test:unit               PASS — 10 Vitest tests passed
npm run build                   PASS — typecheck and dist/ production build
```

The fresh build emitted `dist/`. Its initial JavaScript is 28,779 bytes raw /
10,010 bytes gzip and CSS is 14,177 bytes raw / 4,209 bytes gzip, within the
static PWA budgets.

## Deployment, privacy, PWA, and security

- Live/local SHA-256 matched for `index.html`
  (`3b920bcdea84c0eec1ec61b8befd0c4db5a791f3bcda38c9f6e48f1fa69a6095`),
  `assets/index-CF7KUzOM.js`
  (`8638f7943e65ec218544e7a64aacc2773061d572bf5457652fb77a816779dab4`),
  and `sw.js`
  (`95837ce8e75e801a5dc38ccac6be5b009178cee4e3552f7401ba7dcd88e09f41`).
- A fresh browser request log through live demo opening, reveal, and review
  contained only the product origin (document, JS, CSS). No note content,
  tracking, media, or authentication request left the origin. Feed access is
  separately claim-tested to happen only after Find episodes.
- After service-worker activation, the live demo was controlled by the worker.
  Setting the browser offline and reloading returned HTTP 200 and retained the
  live demo heading and recall UI. The `build-coupled-updates` claim passed,
  proving a changed fingerprint changes worker/cache bytes without a manual
  cache version edit.
- Live `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/404.html`, manifest,
  worker, and hashed asset requests returned 200. Hashed assets are immutable
  for one year; the worker is `no-cache, no-store, must-revalidate`; HTML is
  short revalidated cache. Headers include HSTS, `nosniff`, strict-origin
  referrer policy, restrictive permissions policy, and CSP with
  `frame-ancestors 'none'`.
- The product has no sign-in. Its only product-unlock server endpoint was
  independently rate-tested with an invalid token: requests 1–30 returned
  200; requests 31–40 returned **429** with `Retry-After: 4`. Observed
  allowance: **30 requests per client window**.

## Accessibility and responsive checks

- Live axe scans found zero serious or critical violations on desktop `/demo`
  and 390×844 mobile `/demo`; normal pages logged no console or page errors.
- At 390 px, document scroll width equalled client width (390 px). Visual
  inspection confirmed the recall card and capture form stack cleanly.
- Keyboard Tab starts at the skip link and proceeds through all visible
  controls; sampled focus outlines were visible 3 px rings. Enter on the skip
  link focuses `main`; revealing a takeaway moves focus to the revealed
  content.
- With reduced motion emulated, the active-card animation and transition were
  `0.00001s` and document scroll behavior was `auto`.

An attempted fresh Lighthouse CLI run could not complete because the container
Chromium tab crashed before analysis. This is an environment limitation, not a
product browser error; the independent live axe, responsive, request, header,
and bundle checks above completed successfully.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |
