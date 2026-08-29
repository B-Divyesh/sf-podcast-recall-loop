# Podcast Recall Loop — polish round 5 handoff

## Outcome

**PASS.** All findings from adversarial reviews 1–5 are resolved. The only open round-5 defect, an inaccessible footer reference to internal design notes, was removed. Production now shows **Version 1.0.6** on every route.

- Product repair commit: `5e8c836331c0569ad4d614e027423da329a391ad`
- Production: <https://podcast-recall-loop.sociobot.in>
- Static Web Apps deployment: `809d33b5-901b-4692-9e17-81814e0d0a74`
- Deployed: 29 August 2026 UTC

## What changed

- Removed **Generated art disclosed in the design notes** from the global footer. Repository provenance remains in `.factory/design.md` and the source-asset sidecars.
- Bumped the package and visible build version to `1.0.6`.
- Added a six-route regression that requires the version and rejects the inaccessible phrase.
- Added a cold-first-screen regression for the exact job, audience, `?demo=1` action, sample outcome, and three product facts.
- Updated the verb-first catalog description to **Save podcast moments and recall up to three questions each day.** It is 63 characters.
- Added a repeatable production audit at `scripts/verify-live.mjs` for cold mobile copy, demo isolation, daily progress, offline reload, metadata, HTTP 404, history focus/scroll, Axe, legal links, and checkout status.

The full finding-to-change-to-evidence matrix is in [polish-5.md](polish-5.md).

## Verification evidence

Verification used clean clones after `npm ci`:

- Every one of the 27 commands in `.factory/claims.json` passed independently on product commit `5e8c836`. Each registered `@claim:<id>` occurs exactly once in the shipped tests.
- `npm test`: 86 Playwright tests passed across desktop Chromium and 390×844 mobile Chromium. This includes claim, integration, keyboard, route, serious/critical Axe, privacy, mobile-width, touch-target, dark-theme, reduced-motion, focus, and offline checks.
- `npm run test:unit`: 15/15 Vitest tests passed.
- `npm run build`: passed and produced `dist/index.html`, static deep-route shells, the designed 404, and a fingerprint-coupled service worker.
- `npm audit --audit-level=high`: zero vulnerabilities.
- Initial bundle: 31,480 bytes raw / 10,811 bytes gzip JavaScript; 14,177 bytes raw / 4,209 bytes gzip CSS.

Production checks after deployment:

- `/opt/fleet/lib/verify-url.sh` passed cold `/` and `/?demo=1` with no console errors. See [home verification](evidence/polish-5/live-home/verify.json) and [demo verification](evidence/polish-5/live-demo/verify.json).
- [Live browser results](evidence/polish-5/live-browser.json) cover all routes. `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200; `/missing-page` returns the designed HTTP 404. Titles, canonicals, Open Graph fields, legal links, landmarks, Back focus/scroll, and Axe checks pass.
- The one-click demo shows five clips, **Question 1 of 3 today**, the persistent banner, Reset, and Start for real. Its 1→2→3 sequence stops at **You are caught up for today**, remains caught up after reload, and resets cleanly.
- A seeded real note and license stayed byte-identical through `/?demo=1&license=...`, Restore, and Start-for-real exits. The live cold demo/offline flow made zero cross-origin requests.
- Offline reload retained the queue, demo banner, and Reveal action.
- [Lighthouse mobile](evidence/polish-5/lighthouse-mobile.json): 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.14 s, CLS 0, TBT 88.5 ms.
- Production and local asset SHA-256 values match: JavaScript `aaa4467ec99517d86fc3dff3e510e735d402c9632098ba267d8d85601397fa76`; CSS `0fe67a484500db387d9f8fa012dddb5262beae4480df82037febdbf270d14078`.
- Fingerprinted assets return one-year immutable caching; `sw.js` returns `no-cache, no-store, must-revalidate`.
- Visual inspection: [390 px home](evidence/polish-5/live-home-mobile.png), [390 px demo](evidence/polish-5/live-demo-mobile.png), [desktop app](evidence/polish-5/live-app-desktop.png), and [desktop home](evidence/polish-5/live-home-desktop.png).

## Run and verify

```sh
npm ci
npm test
npm run test:unit
npm run build
node scripts/verify-live.mjs https://podcast-recall-loop.sociobot.in .factory/evidence/polish-5
```

The isolated sample opens at <https://podcast-recall-loop.sociobot.in/?demo=1>.

## Known gaps and next steps

None. No review finding, claim failure, accessibility defect, deployment mismatch, or deferred minor item remains.
