# Independent verification 8 — FAIL

**Candidate:** `a52afadee0cec2fac9d7518b2ed3f25e30d05eb1`

**Live URL:** <https://podcast-recall-loop.sociobot.in>

**Verified:** 29 August 2026

**Work order:** `podcast-recall-loop-verify-8`

## Release decision

**FAIL. Do not release this candidate.** The live deployment is byte-for-byte
the candidate and the normal product path is strong, but a parseable backup
with an invalid clip object overwrites a valid local library before validation.
The app says the backup was rejected, then becomes blank on reload and throws
`Cannot read properties of undefined (reading 'replace')`. The previously saved
note is no longer present and IndexedDB contains only `{ "clips": [ {} ] }`.
This is a release-blocking local-data-loss and recovery defect.

## Mandatory gates

### Claims

`.factory/claims.json` exists with 26 entries. After `npm ci`, every listed
command was run separately against the production demo entry point. All 26
entries passed, with both configured browser projects used by every Playwright
claim:

`offline-reload`, `demo-isolation`, `demo-seed-reset`, `rss-lookup`,
`feed-explicit-request`, `atom-lookup`, `daily-three`, `csv-export`,
`markdown-export`, `free-limit`, `free-reviews-exports`, `local-privacy`,
`no-account`, `browser-persistence`, `metadata-only`, `manual-authorship`,
`json-backup`, `spaced-schedule`, `review-results`, `calendar-reminder`,
`installable-pwa`, `existing-license`, `one-time-unlimited`, `license-restore`,
`build-coupled-updates`, and `sociobot-billing`.

Result: `CLAIM_TEST_SUMMARY total=26 failures=0`. The passing `json-backup`
claim covers a backup produced by the app, but does not exercise invalid object
shape. That test gap is why the release-blocking defect remains despite the
green claim gate.

### Cold first read

The first screen passes. It says **“Remember what your podcasts taught you”**
for **“curious listeners who save good moments but forget the ideas.”** The
dominant action is **“Try it with sample data”**, followed immediately by
**“Opens five sample clips from fictional shows. No setup.”** The three visible
facts cover browser-local notes, offline reviews, and the eight-clip free tier.
All are visible at 390×844; the facts end at 701 px.

One click opened `/?demo=1` with five clips, three due questions, and the
persistent **Demo — sample data, nothing is saved to your notes** banner.

## Release-blocking defect

### High — a malformed backup destroys a valid library and blanks the app

Reproduced against the live deployment in a fresh browser context:

1. Open `/app` and save a valid question, **“Will my good note survive a bad backup?”**
2. Import a syntactically valid JSON file containing `{"clips":[{}]}`.
3. The app announces **“That backup could not be read. Choose a Recall Loop JSON file.”** The valid note still appears, implying the import was rejected.
4. Reload `/app`.
5. The entire application shell is blank. The valid note is gone, IndexedDB now contains `{"clips":[{}]}`, and the page throws `Cannot read properties of undefined (reading 'replace')`.

The import handler checks only `Array.isArray(imported.clips)`, assigns and
saves that value, and validates indirectly while rendering. Its catch displays
an error after persistence has already replaced the good state. Recovery from
the blank page requires clearing site data; the prior note is not recoverable
unless the user separately exported it.

Expected: validate every required clip field and data type before mutating
memory or IndexedDB. A rejected import must preserve the current library and
the app must remain usable after reload.

Evidence:

- [Before reload: valid note plus rejection message](evidence/verification-8/malformed-import-before-reload.png)
- [After reload: blank application](evidence/verification-8/malformed-import-after-reload.png)

No critical, medium, or low defects were recorded. One real NPR RSS feed was
blocked by that publisher's CORS policy and showed the documented manual-entry
fallback; two other public feeds (Megaphone and Simplecast) successfully filled
50 episodes, so this was not classified as a product defect.

## End-to-end behavior

The following live paths passed before the destructive-input check:

- Demo storage contained only `podcast-recall-loop-demo`; five clips and three due questions appeared.
- Reveal moved focus to the takeaway. **I remembered** advanced to question 2 of 3, and two due questions survived reload.
- An empty feed produced the announced recovery message.
- Timestamp `61:99` was rejected by native validation; changing it to `1:02:03` saved the clip.
- CSV export contained the header plus six data rows after that save.
- **Reset demo** restored five clips, three due questions, and question 1 of 3.
- **Start for real** deleted demo storage and opened an empty `/app` library.
- Invalid JSON syntax was rejected without losing the saved real note. The structurally invalid JSON case above did not recover.
- No request left the product origin during the complete demo and saved-note flow.

The live purchase link is exactly
`https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout`. It
returned 303 to hosted checkout, which showed **Podcast Recall Loop Unlimited**,
**$9.00**, and a one-time license. No payment-provider URL is embedded in the
product page.

## Local gates

Clean checkout at the exact candidate:

```text
npm ci                         PASS — 61 packages; 0 vulnerabilities
26 claims.json commands        PASS — 26/26 entries, 0 failures
npm test                       PASS — 80/80 Playwright tests in 2.5m
npm run test:unit              PASS — 13/13 Vitest tests
npm run build                  PASS — typecheck, Vite build, dist/ emitted
```

There is no separate lint script. TypeScript checking is part of the exact
production build.

## Deployment identity, security, privacy, and limits

Live and local SHA-256 values matched exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `0b07cfa2cefbd1101b0c006a4986478e24e1fa1decbf66ad511694500581c79d` |
| `assets/index-CSQkdIlP.js` | `6eb70b2847366ebf60332993a33e990b9b75eb03af6aa0eeb9a5894dc0a18c10` |
| `assets/index-CB1EBUkx.css` | `0fe67a484500db387d9f8fa012dddb5262beae4480df82037febdbf270d14078` |
| `sw.js` | `30d364809fda9a6b7d6f97a1baf560972178ff2858b9be7586d671edc487c3e1` |
| `manifest.webmanifest` | `ddb62c03a08c126a72cf88baecd1aded25308a2823b4c60c62191d0ad953e05b` |

Normal demo and real-note request logs were same-origin only. There were no
tracking, authentication, media, or note-data requests. Feed requests occurred
only after **Find episodes**. The product requires no sign-in, so the Entra
tenant check is not applicable.

Live responses include HSTS, `nosniff`, strict-origin referrer policy, a
restrictive permissions policy, and a CSP with `frame-ancestors 'none'`.
Hashed assets use `public, max-age=31536000, immutable`; `sw.js` uses
`no-cache, no-store, must-revalidate`; HTML revalidates after 30 seconds. A
missing route returned a designed document with real HTTP 404.

The Sociobot license verifier allowed 30 requests from one client window.
Requests 31–40 returned HTTP 429 with `Retry-After` (3 seconds initially,
decreasing to 2 seconds). The allowance is therefore **30 requests per client
window**.

## PWA and performance

The manifest is standalone with 192px and 512px icons. A fresh live browser was
controlled by `/sw.js`; `registration.update()` completed with the current
worker activated and no waiting worker. The active cache was
`recall-loop-shell-0b07cfa2cefb`. Offline reload returned 200, showed the
offline state, allowed a review, and retained the two-question state through a
second offline reload. The build-coupled update claim also passed, and the live
worker is served with no-cache headers.

Bundle and media budgets pass:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| Initial JS | 29,733 B | 10,329 B |
| Initial CSS | 14,177 B | 4,209 B |
| Mobile hero | 9,764 B | — |
| Desktop hero | 24,292 B | — |

No font files ship. Mobile Lighthouse at 18:35 UTC scored **95 performance,
100 accessibility, 100 best practices, and 100 SEO**. FCP was 1.0 s, LCP 1.0
s, CLS 0, TBT 210 ms, and total transfer 27 KiB. Raw evidence is
[lighthouse-mobile.json](evidence/verification-8/lighthouse-mobile.json).

## Accessibility and responsive evidence

- Live Axe found zero serious or critical findings across `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the 404 route on desktop, 390px mobile, and dark mode (18 scans).
- Normal routes produced no console or page errors. The expected browser resource error appeared only for the intentionally requested HTTP 404 document.
- Every checked route had `lang="en"`, one `<h1>`, one `<main>`, a route-specific title, and no image missing alt text.
- Tab first reached the skip link; Enter moved focus to `main`. Keyboard entry into the demo focused its `<h1>`; the next Tab reached **Reveal my takeaway**. Enter focused the revealed answer, then Space activated **Review sooner**.
- Focus was a visible 3px ochre outline. No keyboard trap was found.
- At 390px, document width remained 390px with no horizontal overflow. The visible file-import target is a 44px label; its transparent native input is intentionally nested inside it.
- Reduced motion reported `0.00001s` animation/transition duration and `scroll-behavior: auto`.
- The required URL verifier passed both cold `/` and `/?demo=1` with no console errors. Evidence is in [live-home](evidence/verification-8/live-home/verify.json) and [live-demo](evidence/verification-8/live-demo/verify.json).
