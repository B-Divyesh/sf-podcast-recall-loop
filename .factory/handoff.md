# Independent verification 12 — FAIL (2026-08-30 UTC)

Candidate `1d7885d37d654879c1f64002a7fa79a259fcec6e` was independently checked locally and at <https://podcast-recall-loop.sociobot.in>; no product code was modified. The deployment hashes match the fresh candidate `dist/` build, the product and live quality checks are otherwise clean, and the final full suite passed 92/92.

**Release verdict: FAIL.** The first clean full `npm test` run produced a mobile failure of the registered `@claim:demo-isolation` test. An exact rerun passed and three repeated desktop/mobile runs passed 6/6, so this is a flaky test-run failure rather than a reproduced isolation breach. The work order defines *any* failing claim test as release-blocking, so it cannot be accepted until that test is reliable or the rule is waived.

See [.factory/verification-12.md](verification-12.md) for the complete first-read result, claim matrix, test evidence, privacy/network/header/rate-limit checks, accessibility, offline/PWA, performance, and required disposition.

# Podcast Recall Loop — polish round 7 retry handoff

## Outcome

Round 7 retry is complete and deployed at <https://podcast-recall-loop.sociobot.in>. Product commits `19652303c5f99c4d7e1efa92aed460edac575051` and `c61fc1fc39c730aefb940e3efe8bb41f3bf5e74e` were deployed through work order `podcast-recall-loop-polish-7-retry1` as Azure Static Web Apps deployment `b93005b9-d722-48f5-9b8f-1f8673ee6265`.

The requested build failure was reproduced before edits: `npm run build` in the dependency-free checkout exited 127 with `tsc: not found`. The build now conditionally installs the lockfile-pinned development tools when they are absent. A clean copy with no `node_modules` passed the same command and produced `dist/index.html`.

The first screen now says exactly what to do: **Turn podcast moments into recall questions**. The one-click `?demo=1` path, persistent demo banner, byte-exact reset, storage/license isolation, route metadata, focus restoration, true 404, legal links, mobile layout, and F-7-1 privacy wording all pass locally and live. The glacial ceramic visual system and static offline PWA deployment class are unchanged.

## Verification

From clean clone commit `19652303c5f99c4d7e1efa92aed460edac575051`:

- `npm run build` with no installed dependencies: passed; the locked bootstrap ran and created `dist/index.html`.
- Every command in `.factory/claims.json`: 28/28 passed independently.
- `npm test`: 92/92 passed across desktop and 390 px mobile Chromium.
- `npm run test:unit`: 17/17 passed.
- Final `npm run build`: passed; JavaScript 31,601 bytes raw / 10.90 KB gzip, CSS 14,177 bytes raw / 4.20 KB gzip.
- `npm audit --audit-level=high`: zero vulnerabilities.

Production verification on 30 August 2026:

- [Structured browser check](evidence/polish-7-retry1/live/live-browser.json): first screen, demo/reset/isolation, offline reload, license privacy, route metadata, focus/scroll, legal links, 404, checkout, and Axe.
- [Home](evidence/polish-7-retry1/live-home/verify.json) and [demo](evidence/polish-7-retry1/live-demo/verify.json) URL verifiers: no console errors or structural failures.
- [Lighthouse](evidence/polish-7-retry1/lighthouse-summary.json): 100/100/100/100; LCP 1.1 s, CLS 0, TBT 0 ms.
- [Deployment hashes](evidence/polish-7-retry1/asset-hashes.txt): HTML, JS, CSS, service worker, and manifest all match local `dist/`.
- [Finding map](polish-7.md): every F-1-1 through F-7-1 item maps to its change, test, screenshot, and live check.

## Run locally

```sh
npm ci
npm test
npm run test:unit
npm run build
npm run preview
```

Open `http://localhost:4173/?demo=1` for the isolated sample workspace.

## Known gaps and next steps

None. No review finding, failed claim, accessibility issue, privacy leak, route defect, build failure, deployment mismatch, or deferred minor item remains.
