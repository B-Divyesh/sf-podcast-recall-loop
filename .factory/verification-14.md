# Independent verification 14 — PASS

**Candidate:** `36aa943d754a6597a2546a8461c72dd4a38f000a`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>  
**Verified:** 30 August 2026 UTC  
**Scope:** independent release QA from a clean checkout; no product source was changed.

## Release decision

**PASS.** The candidate meets the researched brief: it is a local-first PWA
for listeners who manually turn podcast moments into learner-authored recall
questions, review at most three due questions daily, and export their data. It
does not store or play audio, generate transcripts/quizzes, require an
account, or send ordinary saved-note data off-device.

No open release-blocking, high, medium, low, or informational defects were
found. The earlier live billing outage and fail-open license defect reported in
`verification-13.md` are resolved by this candidate and current deployment.

## Mandatory claim and first-read gates

`.factory/claims.json` is present with 28 claims. After `npm ci` from the
clean checkout, I invoked every exact command listed in that manifest,
individually, before broader product QA. All 28 passed. The later complete
Playwright run also passed, confirming all browser claim coverage together.

The cold 390 × 844 live first screen passes the plain-words and demo gates:

- **What it does:** “Turn podcast moments into recall questions.”
- **For whom:** “For podcast listeners who save useful moments, then forget
  what they learned.”
- **First click:** **Try it with sample data**; adjacent copy says it opens
  five fictional-show clips with no setup.

That one click entered the isolated demo with five authored clips, three due
questions, the persistent “Demo — sample data, nothing is saved to your notes”
banner, **Reset demo**, and **Start for real**. I completed its 1 → 2 → 3
daily queue, reached the caught-up state, reloaded it, reset it, and reloaded
it offline after service-worker activation. All succeeded.

## Local quality gates

| Check | Result |
| --- | --- |
| Clean dependency install | `npm ci` passed; 61 packages; 0 audit vulnerabilities |
| Every declared claim command | 28 / 28 passed independently |
| Full browser suite | `npm test` passed: 98 / 98 |
| Unit suite | `npm run test:unit` passed: 17 / 17 |
| Dependency audit | `npm audit --audit-level=high` passed: 0 vulnerabilities |
| Production build | `npm run build` passed: TypeScript check, Vite build, service-worker finalizer; `dist/` produced |
| Lint/type checking | No standalone lint command is defined; the production build runs `tsc --noEmit` |

The first-load application JavaScript is 32,116 bytes raw / 11.07 KB gzip and
CSS is 14,177 bytes raw / 4.20 KB gzip, both safely inside the static-PWA
budgets. The responsive hero image is 9,764 bytes.

## Product, privacy, accessibility, and PWA evidence

- A live normal-flow audit saved a learner-written clip with a podcast,
  episode, `12:34` timestamp, question, and takeaway, then confirmed the real
  library remained distinct from the demo. The declared tests cover timestamp
  boundaries, malformed backup recovery, empty/explicit RSS lookup, eight-clip
  free-limit refusal, Markdown/CSV/JSON export and restore, calendar export,
  spacing outcomes, and Atom/RSS field population.
- The live invalid-license flow stored a false verification verdict, displayed
  the corrective message, and left the app at **8 of 8 free clip spaces
  remain**; it did not unlock unlimited clips. A fresh checkout response was
  HTTP 303 with a redirect location.
- Playwright request logs for cold home/demo, demo isolation, and a live real
  save flow contained only same-origin document, script, stylesheet, and
  image requests. There were no analytics, tracking, authentication, media,
  or note-data requests to another origin. RSS requests occur only after the
  explicit **Find episodes** action, as the passing claim proves. No sign-in
  exists, so the Entra tenant requirement is not applicable.
- Fresh Axe scans had **0 serious or critical findings** on `/`, `/demo`,
  `/app`, `/privacy`, `/terms`, and the 404 page. All routes had one `h1`, one
  `main`, correct route title, and zero console/page errors. The 404 returned
  HTTP 404.
- Keyboard testing reached the skip link first, moved focus to `main`, and
  showed a designed 3 px focus outline. At 390 px there was no horizontal
  overflow. Reduced motion changed scrolling to `auto` and transitions to
  `0.00001s`.
- The active live service worker controlled `/demo`; an offline reload kept
  the queue and reveal control usable. `registration.update()` found no
  waiting or installing worker, as expected when the current worker is already
  active. The build-coupled worker claim passed, proving changed app assets
  produce a changed worker/cache.

## Live deployment, headers, rate limit, and performance

Fresh SHA-256 comparisons prove live production exactly matches this build:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `20a63a91d84a1ab9c75c45809befc4c6cf00fd6c372d190925a94c08be58ccba` |
| `assets/index-DGCM6x4e.js` | `2061a07e45739b961411511862e480462503274bbb94f9f12987ab997c2b3319` |
| `assets/index-CB1EBUkx.css` | `0fe67a484500db387d9f8fa012dddb5262beae4480df82037febdbf270d14078` |
| `sw.js` | `515c8c5eb81780f31394cc8b9ed88d4f1c628b2bbac5e4d6e19f1697c5ca7268` |
| `manifest.webmanifest` | `ddb62c03a08c126a72cf88baecd1aded25308a2823b4c60c62191d0ad953e05b` |

Response headers include HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, a restrictive permissions
policy, and a CSP with `frame-ancestors 'none'`. HTML revalidates after 30
seconds; fingerprinted assets use one-year immutable caching; `sw.js` uses
`no-cache, no-store, must-revalidate`.

`npm run verify:billing-live` observed the documented service allowance from a
single client: 30 invalid verification attempts returned HTTP 200 with an
invalid verdict, and attempt 31 returned **HTTP 429** with **`Retry-After: 4`**.
The checkout endpoint returned HTTP 303.

Fresh mobile Lighthouse on production scored **100 performance, 100
accessibility, 100 best practices, and 100 SEO**. Measured FCP/LCP were 1.1 s,
CLS 0, TBT 10 ms, and transferred size 77 KiB.

## Reproduce

```sh
npm ci
npm test
npm run test:unit
npm audit --audit-level=high
npm run build
npm run verify:billing-live
node scripts/verify-live.mjs https://podcast-recall-loop.sociobot.in .factory/evidence/verification-14-live
```

