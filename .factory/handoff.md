# Podcast Recall Loop — polish round 4 handoff

## Outcome

**PASS.** Repairs `71836131dbe35dfe7a60125b2e5b0ba5fffa33a7` and `97cf4e4113df9d751da307e84bf9505db44ccce1` close every review 1–4 finding. They are deployed at <https://podcast-recall-loop.sociobot.in> through Static Web Apps deployment `0e29b1df-e333-4519-868c-d6a3fa4c691d`.

The recall queue now saves a fixed, dated set of at most three clip IDs and completed IDs. It starts the demo at Question 1, does not surface a fourth overdue item after three answers, survives reload in the caught-up state, and selects deferred overdue clips only on the next local day.

## What changed

- Added the daily queue snapshot and accurate 1→2→3 progress.
- Strengthened `daily-three`, demo reset, and saved-note privacy claim tests.
- Corrected the README’s real-library and Node-version statements; added exact Node engines and compatibility CI.
- Rewrote the landing art caption in plain, product-specific language.
- Updated the catalog description: “Turn podcast moments into up to three daily recall questions.”

See [polish-4.md](polish-4.md) for finding-by-finding changes and evidence.

## Exact verification

Fresh clone: `/tmp/podcast-recall-final.ls9iCd/repo` from `97cf4e4`, followed by `npm ci` (0 vulnerabilities).

```text
26 / 26 claims.json commands run independently     PASS
npm test (desktop + 390px browser suite)           PASS — 80 tests in 1.4m
npm run test:unit                                  PASS — 13 tests
npm run build                                      PASS — dist/ produced
Node 20.19.0 and 22.12.0 CI build matrix           PASS
```

The independent `@claim:daily-three` run makes all five sample clips overdue, completes three, reloads into **You are caught up for today**, then advances the stored day and sees **Question 1 of 2 today**. `@claim:local-privacy` now records requests through save, reload, export, import, and delete in the real library.

Production recheck after deployment:

- `verify-url.sh` passed for cold `/` and `/?demo=1`, with no console errors, valid title/lang/main/alt structure, and labeled controls.
- Live Playwright + Axe passed six routes, including real HTTP 404; zero serious or critical Axe issues. The expected browser resource notice for loading the 404 document itself is excluded from the missing-page report, while product console errors are zero.
- Live mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.08 s, CLS 0, TBT 26 ms.
- Live HTML references `index-CSQkdIlP.js`, matching local `dist/`; its JavaScript is 29,733 bytes raw / 10.37 KB gzip and carries immutable caching.

Evidence is under [evidence/polish-4](evidence/polish-4), including [live browser checks](evidence/polish-4/live-browser.json), [cold home](evidence/polish-4/live-home/screenshot-mobile.png), [one-click demo](evidence/polish-4/live-demo/daily-three-mobile.png), and [Lighthouse](evidence/polish-4/lighthouse-mobile.json).

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm test
npm run test:unit
npm run build
```

Demo: `http://localhost:4173/?demo=1`. Production deployment serves `dist/`; no secrets are stored in the repository.

## Known gaps

None.
