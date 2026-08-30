# Independent verification 13 — FAIL

**Candidate:** `205c5a213db6e80b48136039cf6f7eb16ba42cd3`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>  
**Verified:** 30 August 2026 UTC from the clean work-order checkout  
**Scope:** independent product QA; no product code was changed

## Release decision

**FAIL — do not release.** The free, local-first recall product works, the
deployment is byte-identical to the candidate, all 28 declared claim commands
pass after the locked install, and the earlier `demo-isolation` flake is fixed.
The paid path nevertheless has two independently reproduced high-severity
blockers:

1. The advertised Sociobot checkout and license-verification service returns
   HTTP 503, so a buyer cannot purchase or validate a license. The required
   rate-limit behavior cannot be demonstrated: 35/35 verification requests
   returned 503 with no `Retry-After` instead of changing to 429.
2. The candidate fails open when license verification is unavailable. A fresh,
   arbitrary token is announced as verified and enables unlimited clips even
   though no valid verdict was received.

## Release-blocking defects

### F-13-1 — High — advertised checkout and license API are unavailable

Clicking **Buy unlimited — $9 once** on the live home page navigated to
`https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout` and
showed **503 Service Unavailable**, not hosted checkout. The repository's own
independent live audit failed for the same reason: `Sociobot checkout returned
503, expected 303`.

Fresh direct evidence:

- Five consecutive checkout requests at 02:53 UTC returned HTTP 503.
- The verify endpoint also returned HTTP 503.
- A final checkout and verify retry at 03:00 UTC still returned HTTP 503.
- The 503 responses were HTML Azure App Service error pages, not the documented
  billing API response, and did not include CORS or `Retry-After` headers.
- The required one-client allowance probe sent 35 invalid verification
  requests. All 35 returned 503 with no `Retry-After`; no 429 was observed.
  **Observed allowance: none could be established. This check fails.**

This is a live dependency/deployment failure, but checkout is a prominently
advertised product function and part of the acceptance contract.

### F-13-2 — High — a network failure accepts any token as a valid license

In a fresh browser context:

1. Open `/#restore-license`.
2. Paste `verification-13-invalid` or any fresh string.
3. Press **Verify license** while the verify endpoint is unavailable.
4. The browser logs a CORS failure and `net::ERR_FAILED`.
5. The app nevertheless announces **License verified. Unlimited clips are
   active.**
6. Local storage contains only the arbitrary token and no verified verdict.
7. Opening `/app` displays **Unlimited clips active.** and removes the
   eight-clip limit.

The result also reproduces deterministically when Playwright aborts the verify
request: `fresh-unverified-token` is stored without a verdict and unlocks the
app. In `src/license.ts`, `verifyLicense()` falls back to `cachedUnlocked()`;
`cachedUnlocked()` returns true when a token exists but the verdict is absent
or unparsable. A newly pasted token must remain locked unless the server
returns a valid response. Offline optimism is appropriate only for a
previously cached valid verdict.

The current positive-path `license-restore` test mocks a successful response
and therefore does not cover this failure/recovery path.

## Mandatory claims gate

`.factory/claims.json` exists with 28 entries. As literally requested, every
listed command was first invoked before any other repository work. Because a
clean clone has no `node_modules`, those pre-install invocations could not load
`@playwright/test` or `vitest`; no product assertion ran. `npm ci` then
installed the locked dependencies with zero vulnerabilities, after which all
28 exact commands were rerun separately and passed.

| Claims | Result after locked install |
| --- | --- |
| Offline, demo isolation/reset, RSS/Atom, explicit feed request, daily-three | PASS |
| CSV, Markdown, JSON backup, invalid-backup recovery, persistence | PASS |
| Free limit/reviews/exports, privacy, no account, metadata only, authorship | PASS |
| Scheduling, review results, calendar, installability, build-coupled updates | PASS |
| Existing license, one-time purchase fixture, restore fixture, license storage, Sociobot endpoint fixture | PASS |

Each declared `@claim:<id>` occurs exactly once in the test source. Browser
claim commands passed in both desktop Chromium and the configured 390 px
mobile project; the worker-build claim passed in Vitest. These mocked/fixture
claims do not override the failed real checkout and fail-open recovery evidence.

The repaired `@claim:demo-isolation` behavior passed its individual manifest
command, the complete suite, and an additional `--repeat-each=3 --workers=2`
run: **6/6 desktop/mobile repetitions passed**. The release blocker from
verification 12 is resolved.

## First-read and demo gate

**PASS.** A cold, storage-free live visit answers all three questions without
scrolling:

- What: **Turn podcast moments into recall questions.**
- Who: **For podcast listeners who save useful moments, then forget what they
  learned.**
- First action: **Try it with sample data**, followed by **Opens five sample
  clips from fictional shows. No setup.**

The one-click action opens the isolated demo with five clips, three due
questions, and the persistent **Demo — sample data, nothing is saved to your
notes** banner with **Reset demo** and **Start for real**. The independent live
audit completed questions 1→2→3, reached the caught-up state, survived reload,
reset to the original seed, and retained the queue after an offline reload.

## Local quality gates

| Check | Result |
| --- | --- |
| Candidate identity | exact HEAD `205c5a213db6e80b48136039cf6f7eb16ba42cd3`; clean tree before QA |
| `npm ci` | PASS — 61 packages added; 0 vulnerabilities |
| Every claims command after install | PASS — 28/28 |
| `npm test` | PASS — 92/92 in 3.2 minutes |
| `npm run test:unit` | PASS — 17/17 |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm run build` | PASS — `tsc --noEmit`, Vite, worker finalizer; `dist/` produced |
| Lint | No separate lint script exists; the production build runs TypeScript checking |

Production payloads are within budget: JavaScript is 31.60 KB raw / 10.90 KB
gzip, CSS is 14.18 KB raw / 4.20 KB gzip, and the mobile hero is 9,764 bytes.

## End-to-end product evidence

- A real-library clip with a learner-written podcast, episode, question,
  takeaway, and `1:02:03` timestamp saved and survived reload.
- Timestamp `61:99` was rejected with **Please match the requested format** and
  did not save. Empty feed input announced **Enter the podcast feed address,
  then try again.**
- Importing the parseable wrong-shaped backup `{"clips":[{}]}` announced a
  useful error; the prior saved note remained after reload.
- A real CORS-enabled Simplecast RSS feed loaded successfully, reported 50
  recent episodes, and filled podcast and episode fields. No request was sent
  to it before **Find episodes**; afterward it was the only cross-origin
  request in that flow.
- Passing observable claims additionally cover the eight-clip boundary,
  Markdown/CSV/JSON downloads and restore, calendar download, three-question
  scheduling, both review results, and manual authorship.
- The brief explicitly excludes transcription and generated quizzes. No AI
  feature is missing from this deliberately learner-authored loop.

## Privacy, accessibility, mobile, and routes

Cold home, demo review/reset, demo isolation, and the real note flow made only
same-origin requests. The explicit feed request was the sole expected external
request in the feed test. No analytics, tracking, authentication, audio, or
media request was observed. The app has no sign-in flow, so the Entra tenant
condition is not applicable.

Fresh Axe scans found **0 serious/critical findings** on `/`, `/demo`, `/app`,
`/privacy`, `/terms`, and `/missing-page` in desktop light and 390 px dark
modes. Every route had one `<h1>`, one `<main>`, the correct title, and no
horizontal overflow. The designed missing route returned HTTP 404.

Keyboard-only testing reached the skip link first, moved focus to `main`,
opened the demo using Enter, and reached/activated **Reveal my takeaway**.
Normal controls showed the designed 3 px focus outline. Reduced-motion mode
used `scroll-behavior: auto` and 0.01 ms animation/transition durations. The
app reflowed at 320 px without horizontal overflow. Visible interactive
targets were at least 44 px; the visually hidden file input is operated by its
44 px **Import backup** label.

`verify-url.sh` passed on live `/` and `/demo`: HTTP 200, correct title/lang,
one H1/main, no missing image alternatives or unlabeled buttons, and no
console errors. License verification is the exception: the live 503 causes two
browser console errors and then triggers F-13-2.

## PWA, deployment identity, headers, and performance

The live manifest is standalone with 192/512 icons and an install start URL.
The active `/sw.js` controlled `/demo`; the cache was
`recall-loop-shell-790a61fd8ba3`. `registration.update()` found no newer
waiting worker. After switching the browser offline, `/demo` reloaded with its
offline notice and Reveal action. An actual old-live-build to new-live-build
replacement cannot be observed with one deployment; the build-coupled claim
proves changed app fingerprints create different worker/cache bytes.

Fresh `dist/` files exactly byte-match production:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `790a61fd8ba3b332893c540b2fd5f55934e5f03d3e8c97f6081412a200c57f6f` |
| `assets/index-CIc12eSO.js` | `eec11d14a82d19b7cdbe9ba605302c243cf61556365a8ca9206fd5b80c85de96` |
| `assets/index-CB1EBUkx.css` | `0fe67a484500db387d9f8fa012dddb5262beae4480df82037febdbf270d14078` |
| `sw.js` | `5bec44ef03b063278f31e8e0d4174a5063565de65c790a7e451aa0248fdc71c1` |
| `manifest.webmanifest` | `ddb62c03a08c126a72cf88baecd1aded25308a2823b4c60c62191d0ad953e05b` |

Live product responses include HSTS, `nosniff`, strict-origin referrer policy,
restrictive camera/microphone/geolocation permissions, and CSP with
`frame-ancestors 'none'`. HTML revalidates after 30 seconds; fingerprinted
JS/CSS/images are one-year immutable; `sw.js` is `no-cache, no-store,
must-revalidate`; the manifest revalidates hourly.

Fresh throttled mobile Lighthouse: **Performance 99, Accessibility 100, Best
Practices 100, SEO 100**; FCP 1.2 s, LCP 1.2 s, CLS 0, TBT 100 ms, and 28 KiB
transfer.

## Required disposition

Keep the candidate blocked until both conditions are met:

1. Restore the production Sociobot checkout/verify service and demonstrate a
   303 checkout plus the documented per-client 429 response with a positive
   `Retry-After` value.
2. Change license recovery to keep a newly pasted/unverified token locked when
   verification fails. Add a negative test for network errors, non-JSON/5xx
   responses, and invalid tokens, then rerun every claim and the full suite.
