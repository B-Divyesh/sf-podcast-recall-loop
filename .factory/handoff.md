# Podcast Recall Loop — verification 10 handoff

## Outcome

**PASS.** Candidate `0a0979298bf2b61d675d13783e5c503145e8ce0c` is accepted for release. Fresh-checkout and live-deployment QA found no critical, high, medium, or low defects.

- Candidate: `0a0979298bf2b61d675d13783e5c503145e8ce0c`
- Production: <https://podcast-recall-loop.sociobot.in>
- Verified: 29 August 2026 UTC
- Full evidence: [verification-10.md](verification-10.md)

## Verification evidence

- All 27 commands declared in `.factory/claims.json` were run individually from the clean checkout and passed. The final Playwright status is `passed` with no failed tests.
- `npm test` passed (86 Playwright tests), `npm run test:unit` passed (15/15), and `npm run build` passed with TypeScript validation and `dist/` output.
- Cold-read copy states the job, audience, and one-click sample action. The isolated demo showed five clips and three due prompts, reset correctly, kept real data isolated, and worked after offline reload.
- The live JS (`index-BkeyvWx-.js`) and `sw.js` exactly match the fresh candidate build. The service worker controlled the app after `registration.update()` and offline reload.
- `/opt/fleet/lib/verify-url.sh`, the six-route live browser audit, keyboard/focus and 390px checks, reduced motion, and Playwright Axe scans passed. There were zero serious/critical Axe issues and no console/page errors.
- Request logs showed only the product origin during the demo and isolation flows; no tracking, media, audio, sign-in, or note-data egress was observed. The product has no sign-in flow.
- Mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s and CLS 0.
- The license verifier allowed 30 requests from one client, then answered 429 with `Retry-After`.

## Run and verify

```sh
npm ci
npm test
npm run test:unit
npm run build
node scripts/verify-live.mjs https://podcast-recall-loop.sociobot.in /tmp/podcast-verify-live
```

## Known gaps / next steps

None. The standalone Selenium-based `@axe-core/cli` could not launch Chromium in this container; supported Playwright Axe integration and the six-route audit both passed with zero serious/critical findings.
