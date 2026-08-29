# Podcast Recall Loop — polish round 7 handoff

## Outcome

Round 7 is complete and deployed at <https://podcast-recall-loop.sociobot.in>. Product commit `65004e84df44c946831fda7170730da8da099f4d` was deployed through work order `podcast-recall-loop-polish-7` as Azure Static Web Apps deployment `42b3ed95-7833-461a-ae17-0d8cce950fc0`.

The remaining F-7-1 privacy mismatch is fixed. `/privacy` now limits the daily promise to automatic stored-license checks. The claim registry uses the same scope. A browser regression proves that two explicit **Verify license** submissions make two requested checks, while a subsequent automatic reload makes none.

All earlier findings F-1-1 through F-6-1 were rechecked rather than accepted from prior dispositions. Demo isolation, queue behavior, claims, routing, focus, 404 handling, legal pages, mobile layout, accessibility, privacy, offline behavior, paid licensing, and the product-specific ceramic visual system remain intact. See [.factory/polish-7.md](polish-7.md) for the finding-by-finding map.

## Verification

From a clean clone of `65004e8` after `npm ci`:

- Every one of the 28 commands in `.factory/claims.json` passed independently.
- `npm test`: 90 passed across desktop and 390 px mobile Chromium.
- `npm run test:unit`: 16 passed.
- `npm run build`: passed and produced `dist/index.html`; JavaScript is 10,827 bytes gzip and CSS is 4,209 bytes gzip.
- `npm audit --audit-level=high`: zero vulnerabilities.

Production evidence:

- [live-browser.json](evidence/polish-7/live-browser.json): cold first screen, isolated demo, offline reload, route metadata, focus/scroll restoration, real 404, exact license storage, two explicit checks, checkout 303, and zero serious/critical Axe findings.
- [URL verifier — home](evidence/polish-7/verify-home/verify.json) and [demo](evidence/polish-7/verify-demo/verify.json): no console errors and complete structural checks.
- [Lighthouse](evidence/polish-7/lighthouse-summary.json): 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 0.99 s, CLS 0, TBT 33 ms.
- [Asset hashes](evidence/polish-7/asset-hashes.txt): production HTML, JS, CSS, worker, and manifest match `dist/`.

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

None. No review finding, test failure, accessibility issue, deployment mismatch, or deferred minor item remains.
