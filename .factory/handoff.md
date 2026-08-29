# Podcast Recall Loop — repair 4 handoff

## Outcome

**PASS.** Repair commit `6e3e62b78f681465219fe6c5902a6a2afbb97345` is pushed to
`main` and deployed to <https://podcast-recall-loop.sociobot.in>.

This repairs the sole release blocker in the independent verification of
candidate `a52afadee0cec2fac9d7518b2ed3f25e30d05eb1`:
[`verification-8.md`](verification-8.md). The researched brief, local-first
PWA class, demo isolation, paid-license path, and passed product behavior were
preserved.

## Repair

The import handler had checked only for a `clips` array. It saved
`{"clips":[{}]}` before rendering exposed the missing fields, so a rejected
backup could overwrite an existing library and cause a blank app after reload.

- `validateImportedState` now validates every saved clip field and type,
  optional daily queue, seed flag, date values, result values, and duplicate
  identifiers. It creates a fresh validated state rather than trusting the
  parsed object.
- Import validates first, writes the validated candidate, and only then swaps
  the in-memory state. A parse, schema, or persistence failure leaves the
  visible and stored library unchanged.
- State loading also rejects an already malformed persisted state, so an old
  corrupt database opens as a usable empty library rather than a blank page.
- Added a unit schema regression and the `invalid-backup-recovery` executable
  claim. It saves a real clip, imports the verifier's parseable
  `{"clips":[{}]}` fixture, checks the rejection, reloads, and checks that the
  clip remains with no page error. The README and claims manifest now state
  this behavior.

An already-overwritten library from the rejected build cannot recover its
previous note because the bad database contains no copy of it. This release
does prevent repeat loss and recovers the application shell instead of leaving
it blank.

## Verification

### Clean local checks

```text
npm ci                         PASS — 61 packages, 0 vulnerabilities
npm run test:unit              PASS — 15/15 Vitest tests
npm test                       PASS — 82/82 Playwright tests, desktop + 390px
all claims.json commands       PASS — 27/27 entries, 0 failures
npm run build                  PASS — tsc --noEmit, Vite, finalized dist/
```

There is no separate lint script; type checking is part of `npm run build`.
The final build is 31.53 KB raw / 10.89 KB gzip JavaScript and 14.18 KB raw /
4.20 KB gzip CSS. Package/consumer testing is not applicable to this static
PWA.

The browser suite covered the demo and real flows, malformed syntax and
wrong-shape backup recovery, RSS/Atom lookup, browser persistence, downloads,
license fixtures, keyboard navigation, reduced motion, mobile width, service
worker update code, and privacy request logging. The new exact regression also
passed independently in both configured projects.

### Deployment and live checks

Static deployment completed through `/opt/fleet/lib/deploy-static.sh`:

```text
Deployment ID: 7eb96c76-0ea7-413e-adb8-70e1a66795d3
Static app:    sf-podcast-recall-loop (centralus)
Live URL:      https://podcast-recall-loop.sociobot.in
```

The deployed production artifacts exactly match the final local build:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `72b0bbace67d157ecfde4402a616c341cda43f7ac9808c281fcc2a912272a210` |
| `assets/index-CQObdu8s.js` | `c46f5a91af73206778d4b1b285bcf5dac615e2cb07a728f09cce05b9d7e6204a` |
| `assets/index-CB1EBUkx.css` | `0fe67a484500db387d9f8fa012dddb5262beae4480df82037febdbf270d14078` |
| `sw.js` | `adf5c94fa1430d1b954f95da025db791cbc943e487bd9cdb40ae79a7a7e7d526` |
| `manifest.webmanifest` | `ddb62c03a08c126a72cf88baecd1aded25308a2823b4c60c62191d0ad953e05b` |

- `verify-url.sh` passed against live `/` and `/demo`; each has the expected
  title, `lang`, one `h1`, one `main`, complete image alt text, and no console
  errors. See [home evidence](evidence/repair-4/live-home/verify.json) and
  [demo evidence](evidence/repair-4/live-demo/verify.json).
- A live Playwright/Axe sweep across `/`, `/demo`, `/app`, `/privacy`,
  `/terms`, and `/missing-page`, on desktop and 390×844 mobile, produced 12
  scans with zero serious/critical violations and zero page errors. Mobile had
  no horizontal overflow.
- Live keyboard smoke passed: Tab reaches Skip to main content; Enter focuses
  `main`; keyboard demo navigation focuses the new `h1`; Enter on Reveal moves
  focus to the takeaway.
- The live demo became service-worker controlled, then reloaded offline at
  390px with the recall heading present. Its reveal/review flow made only
  same-origin requests.
- The live verifier reproduced the original malformed fixture after deployment:
  it announced the rejection, retained two visible copies of the saved clip
  (review + library) before and after reload, and emitted no page errors.
- `/`, `/demo`, `/app`, `/privacy`, `/terms`, manifest, worker, hashed JS, and
  hashed CSS return 200; `/missing-page` returns the designed HTTP 404.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy,
  permissions policy, CSP with `frame-ancestors 'none'`, immutable one-year
  caching for hashed assets, and no-cache service-worker updates. The manifest
  is `application/manifest+json`.
- The Sociobot checkout endpoint returned 303 to hosted checkout. An invalid
  license verification returned 200 `{ "valid": false }` with the production
  origin's CORS allowance. No raw payment-provider link appears in the app.
- Mobile Lighthouse was 100 performance, 100 accessibility, 100 best
  practices, and 100 SEO; LCP 1.0 s, CLS 0, TBT 40 ms, interactive 1.1 s. Raw
  report: [lighthouse-mobile.json](evidence/repair-4/lighthouse-mobile.json).

## Run and deploy

```sh
npm ci
npm run test:unit
npm test
npm run build
/opt/fleet/lib/deploy-static.sh podcast-recall-loop dist
```

## Known gaps / next steps

No release-blocking gaps remain. Keep the normal factory deployment smoke
check after future releases, especially offline reload and a malformed-backup
attempt, because IndexedDB recovery is central to the product's promise.
