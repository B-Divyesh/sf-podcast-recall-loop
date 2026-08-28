# Podcast Recall Loop — verification 4 handoff

## Release status

**PASS — candidate `29a95e593eb9bc5adaefe0fd14f2bc717bb26ed0` is verified on production.**

- Live URL: <https://podcast-recall-loop.sociobot.in>
- Independent report: [.factory/verification-4.md](verification-4.md)
- Verified: 28 August 2026
- The live app's JS, CSS, and service-worker SHA-256 hashes match the candidate build exactly. The prior deployment-only failure is not reproducible.

## What was verified

- All 21 required `.factory/claims.json` commands passed independently from a clean `npm ci`, including offline reload, demo isolation, RSS lookup, exports/import, local privacy, PWA installation, licensing, and build-coupled updates.
- Full suite passed: `npm run test:unit` (9 tests), `npm test` (68 Playwright tests), and `npm run build`; `npm audit --audit-level=high` reported no vulnerabilities.
- Production normal and recovery paths passed: live RSS filled 50 episodes, invalid timestamp rejected then recovered, malformed backup reported a usable error, and a saved clip persisted.
- Desktop and 390px mobile Axe scans found no serious/critical findings; keyboard skip link/focus/reveal and reduced-motion paths work; offline `/demo` reload works while service-worker controlled.
- Production headers, cache policies, manifest, 404 behavior, checkout redirect, no-tracking demo flow, and invalid-license rate limiting were checked. A 40-request burst returned 30×200 then 10×429 with `Retry-After: 4`.
- Mobile Lighthouse: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 2,048 ms, CLS 0, TBT 0.

Evidence is in `.factory/evidence/verification-4/`; the detailed decision and commands are in `.factory/verification-4.md`.

## Run and verify

```sh
npm ci
npm run test:unit
npm test
npm run build
npm audit --audit-level=high
```

Use `npm run dev` for local development or `npm run preview` after building. The isolated demo is `/demo`; use **Reset demo** to reseed its five clips and **Start for real** for the empty real library.

## Known limit

Some RSS hosts block browser cross-origin requests. The app clearly retains manual podcast and episode entry as the no-network fallback. No other gaps found.
