# Podcast Recall Loop — adversarial review 6 handoff

## Outcome

**FAIL — one minor documentation/claim finding remains.** No product code was
changed in this review. See [review-6.md](review-6.md).

- Candidate: `385bfe6899a57cf055baf2aeaa63d9225c8dc945`
- Production: <https://podcast-recall-loop.sociobot.in>
- Reviewed: 29 August 2026 UTC

## What was verified

- Fresh mobile and desktop cold reads identify the job, audience, and one-click
  sample action. The demo starts with five realistic clips and three due
  questions; reset, offline reload, and real-storage isolation passed live.
- All 27 declared claim commands passed independently after `npm ci`.
- `npm test` passed 86 tests; `npm run test:unit` passed 15 tests; `npm run
  build` produced `dist/`.
- The live six-route check found one h1/main per route, correct metadata,
  designed 404, deep links/back focus, zero serious/critical Axe findings, and
  no normal-route console errors. Live app and service-worker bytes match the
  fresh build.

## Remaining gap

F-6-1: `/privacy` says **“This app stores only your license token in this
browser.”** The app also stores the cached daily license-verification result.
Rewrite the sentence to name both values and add a clean-context claim test for
that storage boundary.

## Run and verify

```sh
npm ci
npm test
npm run test:unit
npm run build
node scripts/verify-live.mjs https://podcast-recall-loop.sociobot.in /tmp/podcast-verify-live
```
