# Podcast Recall Loop — independent verification 9 handoff

## Outcome

**PASS.** Candidate `b3e2c6a6a2f72b2b31801feab83ccce04651f7f5` is accepted
for release at <https://podcast-recall-loop.sociobot.in>.

The live HTML, JS, CSS, service worker, and manifest exactly match the fresh
production build. The earlier malformed-backup data-loss defect from
[`verification-8.md`](verification-8.md) is repaired: a parseable invalid
backup is rejected before mutation, a saved note survives reload, and the page
does not error.

## What was verified

- All 27 entries in `.factory/claims.json` passed, including demo isolation,
  offline reload, exports/backups, RSS/Atom parsing, no-account/local privacy,
  license flows, and build-coupled service-worker updates.
- `npm test` passed (82 Playwright tests); `npm run test:unit` passed (15/15
  Vitest tests); `npm run build` passed (`tsc --noEmit`, Vite, service-worker
  finalizer) and produced `dist/`.
- Cold live-page copy passes the first-read gate and exposes one-click **Try it
  with sample data**. The demo has five sample clips, three due questions, a
  persistent isolation banner, and Reset returns it to the seeded state.
- Desktop and 390px mobile capture/review flows, invalid timestamp/feed
  recovery, malformed-backup recovery, keyboard focus, reduced motion, PWA
  offline reload, and visible focus were checked independently.
- Live request logging found only same-origin traffic during normal note and
  demo actions. No sign-in is used. The Sociobot verifier permits 30 requests
  per client window, then sends `429` with `Retry-After`.
- `verify-url.sh` and live Axe scans passed; all six checked routes have one
  `h1`, a `main`, correct titles/lang, no console/page errors, and zero
  serious/critical Axe findings. The current Lighthouse report is 98
  performance and 100 accessibility/best-practices/SEO.
- Initial JS is 31,528 B raw / 10,835 B gzip; CSS is 14,177 B raw / 4,205 B
  gzip. Hashed assets are immutable, HTML revalidates, and `sw.js` is
  no-cache.

Full commands, artifact SHA-256 values, exact claim results, live header
evidence, and the one non-product Lighthouse runner warning are recorded in
[`verification-9.md`](verification-9.md).

## Run and verify

```sh
npm ci
npm test
npm run test:unit
npm run build
```

Use `https://podcast-recall-loop.sociobot.in/demo` (or `/?demo=1`) for the
isolated sample flow.

## Known gaps / next steps

No release-blocking gaps remain. A real old-build-to-new-build service-worker
replacement cannot be observed without a second deployed build; the current
worker update check and the passing build-coupled update regression cover it.
On future releases, repeat offline reload and malformed-backup recovery smoke
checks.
