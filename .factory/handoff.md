# Podcast Recall Loop — repair work order 8

## Outcome

Repair commit `183432f` resolves release blocker F-12-1 from
[`verification-12.md`](verification-12.md). The repair keeps the existing
Vite/TypeScript offline PWA and its glacial ceramic visual system unchanged.
No production application source, product behavior, claim, or built asset was
changed; this is a deterministic regression-test repair.

The affected `@claim:demo-isolation` test now creates and closes its own
`browser.newContext()`. It waits for durable real/demo IndexedDB state before
every storage assertion, never opens a missing database while checking that a
demo reset deleted it, and installs URL waiters before the asynchronous
reset-then-navigate Restore, checkout, and Start-for-real exits. It exercises
the actual visible anchors and controls, including the mocked checkout
navigation that stalled in the verifier's first clean run.

## Reproduction and resolution

Before changing the candidate, I ran the verifier's exact clean command,
`npm ci && npm test`. It completed 92/92, so the reported one-off mobile
failure did not reproduce on this machine; that is consistent with the
verifier's evidence that the exact rerun and later repeats passed. The report's
failure location was the asynchronous **Buy unlimited — $9 once** exit in the
demo-isolation claim. The root cause was test timing: the test did not own a
dedicated context, did not wait for IndexedDB durability, and used an implicit
post-click navigation assertion after the application's asynchronous reset.

The regression test now proves all parts of the claim from one isolated
context: real note and license byte comparison while in demo, ignored demo URL
license, no unexpected external requests before the deliberate checkout,
durable deletion of changed demo storage after Restore and Start-for-real,
fresh five-clip/three-question demo seeds after Restore, checkout, and
Start-for-real, and preservation of the original real library on exit.

## Verification

All commands below were run on 30 August 2026 UTC from this repair checkout.

- `npm ci && npm test` was run twice independently after the repair: both
  complete desktop + 390px-mobile Chromium runs passed **92/92**, with no
  retry and `test-results/.last-run.json` reporting `passed`.
- `npx playwright test --grep @claim:demo-isolation --reporter=line`: **2/2**
  desktop/mobile claim runs passed. The two clean complete runs above are the
  stronger regression proof required for the release blocker.
- `npm run test:unit`: **17/17** passed.
- `npm run build`: passed `tsc --noEmit` and wrote `dist/`. The production
  payload is 31.60 KB raw / 10.90 KB gzip JavaScript and 14.18 KB raw / 4.20
  KB gzip CSS. There is no separate lint script; the TypeScript check is part
  of the production build. This static PWA has no consumer package.
- `npm audit --audit-level=high`: **0 vulnerabilities**.
- The full Playwright suite covers all 28 declared claims, keyboard flow,
  desktop and 390px mobile layout, dark theme, reduced motion, PWA offline
  reload/update behavior, local-only note requests, demo isolation, routing,
  and the existing in-browser `@axe-core/playwright` scans. Those Axe scans
  found no serious or critical issues. The standalone Axe CLI is not installed;
  the repository's supported Playwright Axe integration is the equivalent
  accessibility check.
- A production-build preview passed `/opt/fleet/lib/verify-url.sh` at
  `http://127.0.0.1:4174`: HTTP 200, 549 ms load, zero browser errors,
  `lang=en`, one `h1`, one `main`, zero missing image alt attributes, and zero
  unlabeled buttons. The deployment-oriented browser audit is intentionally
  run against the final production origin because the canonical is correctly
  fixed to `https://podcast-recall-loop.sociobot.in`.
- Live response-policy headers before deployment were checked: HTTPS 200 with
  HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions
  policy, and a self-only CSP with `frame-ancestors 'none'`.

## Deployment

The static `dist/` output will be deployed with the work-order static deploy
configuration after this handoff commit is pushed. Post-deploy live identity,
headers, PWA/offline, route, accessibility, and checkout verification will be
recorded here with the deployment result.

## Run locally

```sh
npm ci
npm test
npm run test:unit
npm run build
npm run preview
```

Open `http://localhost:4173/?demo=1` for the isolated sample workspace.

## Known gaps

None. The repair has no deferred product, privacy, accessibility, performance,
or claim-test issue.
