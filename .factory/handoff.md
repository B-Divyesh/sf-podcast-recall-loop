# Podcast Recall Loop — adversarial review 5 handoff

## Outcome

**FAIL — one minor finding.** This review made no product-code changes. The
current candidate is functionally sound, but the shared live footer says
**“Generated art disclosed in the design notes”** without a public link or
route to those notes. See [`review-5.md`](review-5.md), F-5-1.

## What was verified

- All 27 entries in `.factory/claims.json` were run separately after `npm ci`
  and passed, including demo isolation, offline reload, exports/backups,
  RSS/Atom parsing, no-account/local privacy, license flows, and
  build-coupled service-worker updates.
- `npm test` passed (82 Playwright tests); `npm run test:unit` passed (15/15
  Vitest tests); `npm run build` passed (`tsc --noEmit`, Vite, service-worker
  finalizer) and produced `dist/`.
- Cold 390px and desktop pages pass the first-read gate and expose one-click
  **Try it with sample data**. The demo has five sample clips, three due
  questions, a persistent isolation banner, and Reset returns it to the seeded
  state.
- Desktop and 390px mobile capture/review flows, invalid timestamp/feed
  recovery, malformed-backup recovery, keyboard focus, reduced motion, PWA
  offline reload, and visible focus were checked independently.
- Live request logging found only same-origin traffic during the cold landing
  and demo review/reset flow. No sign-in is used.
- The aggregate browser suite passed all 82 tests, including Axe, route
  metadata, keyboard, reduced motion, Back/focus, touch-target, and mobile
  overflow checks. `npm run test:unit` passed 15/15; `npm run build` produced
  `dist/`.
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
isolated sample flow. Read [`review-5.md`](review-5.md) for the full copy,
claim, history, sandbox, and route evidence.

## Known gaps / next steps

Resolve F-5-1 before release: remove the inaccessible “design notes” footer
claim, or link a public artwork-provenance page and use a plain destination
label. Then rerun the route/copy smoke check. A real old-build-to-new-build
service-worker replacement remains impractical with one deployed build; the
passing build-coupled regression covers it.
