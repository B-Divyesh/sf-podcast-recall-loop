# Podcast Recall Loop — independent verification 14

## Outcome: PASS

Candidate `36aa943d754a6597a2546a8461c72dd4a38f000a` was independently verified
against <https://podcast-recall-loop.sociobot.in> on 30 August 2026 UTC. The
live deployment byte-matches the candidate build and has no open defects by
severity.

The mandatory gates pass: all 28 commands in `.factory/claims.json`, full
Playwright (98/98), Vitest (17/17), audit (0 vulnerabilities), TypeScript and
production build. The cold live screen plainly explains the task, audience,
and one-click sample demo; the isolated demo, offline reload, privacy request
boundary, accessibility scans, 390 px layout, keyboard/focus, reduced motion,
PWA worker/update state, headers/cache policy, and Lighthouse all pass.

Billing is healthy: checkout returns 303, and a single-client verification
probe allowed 30 invalid requests then returned 429 with `Retry-After: 4` on
request 31. Invalid or unavailable license checks fail closed; no account or
sign-in flow exists.

See [`verification-14.md`](verification-14.md) for complete exact evidence,
artifact hashes, and reproduction commands. No next steps are required for
release.

---

# Historical repair handoff — work order 9

The two release blockers in `verification-13.md` are resolved. Product repair
commit `74400f3e213c7f47f5b97189b5200077f70816c9` was pushed to `main` and its
`dist/` artifact was deployed to
<https://podcast-recall-loop.sociobot.in> as Azure deployment
`7e3b23db-8256-4e3c-8895-f260a2ec8ef2`.

## Finding disposition

### F-13-1 — live checkout and verification API unavailable

The Sociobot dependency recovered; this static repository does not own that
service. The final live response-policy check now proves the required behavior:

- checkout returned HTTP 303 with a redirect location;
- 30 invalid verification requests returned HTTP 200 and `valid:false`;
- request 31 returned HTTP 429 with `Retry-After: 4`.

The repeatable check is `npm run verify:billing-live`. Its captured result is
[`billing-policy.json`](evidence/repair-9-live/billing-policy.json).

### F-13-2 — an unavailable verifier unlocked a fresh token

`src/license.ts` now treats an absent, malformed, or structurally invalid
cached verdict as locked. Verification returns a typed outcome so the UI can
distinguish an invalid token from an unavailable service. A new token unlocks
only after an explicit `valid:true` response. An unavailable refresh retains
access only when that same token already has a cached valid verdict.

Before the fix, the new focused Chromium run reproduced the report: the network
case announced **License verified**, and a missing verdict displayed
**Unlimited clips active**. Two tests failed and the cached-valid control passed.

The regression suite now covers:

- an aborted verification request;
- an HTML HTTP 503 response;
- a structured `valid:false` response;
- missing and malformed cached verdicts;
- continued offline access for a previously cached valid verdict;
- the existing successful restore and revoked-license paths.

The live audit also submitted a fresh invalid token to the real API, stored the
false verdict, opened `/app`, and confirmed eight free spaces with no unlimited
state or console errors.

## Clean local verification

Run on 30 August 2026 UTC from the final source:

- `npm ci`: 61 packages installed; 0 vulnerabilities.
- Every command in `.factory/claims.json`: **28/28 passed independently**.
- `npm test`: **98/98 passed** across desktop Chromium and the 390×844 mobile project.
- `npm run test:unit`: **17/17 passed**.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run build`: TypeScript passed and `dist/` was produced.
- Production payload: 32.12 KB raw / 11.07 KB gzip JavaScript; 14.18 KB raw / 4.20 KB gzip CSS; 9.76 KB mobile hero.
- There is no separate lint script; `npm run build` runs `tsc --noEmit`.
- This is a static PWA, so no library/CLI consumer package or sign-in flow applies.

The full Playwright run covers keyboard operation, focus, 44 px targets, dark
contrast, reduced motion, desktop and 390 px reflow, IndexedDB persistence,
privacy request boundaries, the real capture/review/export/import flow, PWA
installation, offline reload, update coupling, and all claims. Its integrated
Axe checks found zero serious or critical issues.

Local production-preview evidence:

- [`verify.json`](evidence/repair-9-local/verify.json) and
  [`demo/verify.json`](evidence/repair-9-local/demo/verify.json): HTTP 200,
  correct title/lang, one H1/main, zero missing alts, zero unlabeled buttons,
  and zero console errors.
- [`lighthouse-mobile.json`](evidence/repair-9-local/lighthouse-mobile.json):
  performance 99, accessibility 100, best practices 100, SEO 100; LCP 1.4 s,
  TBT 100 ms, CLS 0, and 28,070 transferred bytes.
- Desktop and 390 px captures are stored beside those reports.

## Production verification

- [`live-browser.json`](evidence/repair-9-live/live-browser.json) verifies `/`,
  `/demo`, `/app`, `/privacy`, `/terms`, and the real HTTP 404. Every route has
  the expected title, one H1/main, and zero serious/critical Axe findings.
- The same audit verifies the cold 390 px first screen, keyboard focus and Back
  scroll restoration, the demo 1→2→3 sequence, reset, offline reload, isolated
  storage, no unexpected demo requests, positive license storage boundaries,
  real invalid-license fail-closed behavior, and checkout HTTP 303.
- Production `verify-url.sh` checks passed on home and demo with zero console or
  structural accessibility errors. Evidence is in
  [`home/verify.json`](evidence/repair-9-live/home/verify.json) and
  [`demo/verify.json`](evidence/repair-9-live/demo/verify.json).
- [`lighthouse-mobile.json`](evidence/repair-9-live/lighthouse-mobile.json):
  performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.1 s,
  TBT 10 ms, CLS 0.
- [`headers.txt`](evidence/repair-9-live/headers.txt) proves HSTS, `nosniff`,
  strict-origin referrer policy, restrictive permissions, and the CSP with
  `frame-ancestors 'none'`. [`sw-headers.txt`](evidence/repair-9-live/sw-headers.txt)
  proves the service worker is not cached. [`asset-headers.txt`](evidence/repair-9-live/asset-headers.txt)
  proves the fingerprinted JavaScript uses a one-year immutable cache policy;
  [`404-headers.txt`](evidence/repair-9-live/404-headers.txt) records the real 404.
- [`asset-hashes.txt`](evidence/repair-9-live/asset-hashes.txt) proves live and
  local `index.html`, the fingerprinted JavaScript, and `sw.js` are byte-identical.

## Run and verify

```sh
npm ci
npm test
npm run test:unit
npm audit --audit-level=high
npm run build
npm run verify:billing-live
node scripts/verify-live.mjs https://podcast-recall-loop.sociobot.in .factory/evidence/repair-9-live
```

## Known gaps

No release blocker remains. Checkout and license verification remain an
operational Sociobot dependency; the app now keeps new tokens locked during any
future outage while preserving a previously verified offline unlock.
