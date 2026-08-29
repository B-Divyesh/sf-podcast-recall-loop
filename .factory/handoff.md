# Podcast Recall Loop — polish round 6 handoff

## Outcome

**PASS.** Every finding from adversarial reviews 1–6 was repaired or reverified, and no known gap remains in the requested scope.

- Deployed product commit: `3e18e76afe39204938f76fcceaf3be5729999577`
- Production: <https://podcast-recall-loop.sociobot.in>
- Static Web Apps deployment: `9c2bfe81-6353-4bc2-83f0-4e598c50e5ac`
- Deployed: 29 August 2026 UTC

## What changed

- Corrected `/privacy` to say the app stores the license token and its daily verification result.
- Added the `license-storage` claim. Its fresh-context browser test restores a recorded valid license, asserts the exact two product license keys, and checks that the verdict contains only `valid` and `checkedAt`.
- Added a release guard requiring every registered claim to have exactly one test tag and forbidding unregistered tags.
- Removed a race from the five-overdue daily-queue claim by waiting for demo seeding before changing IndexedDB; the strengthened test passed six repeated desktop/mobile runs.
- Bumped the visible release to 1.0.7 and updated the verb-first, 72-character catalog description.
- Preserved the glacial porcelain visual system, offline PWA architecture, separate demo database, local-first storage, and static deployment class.

The full finding-by-finding record is in [polish-6.md](polish-6.md).

## Verification evidence

- Fresh clone of deployed commit after `npm ci`: every command in `claims.json` passed independently, 28/28 in 272.4 seconds. See [clean-claims.json](evidence/polish-6/clean-claims.json).
- Fresh-clone aggregate: `npm test` passed 88/88; `npm run test:unit` passed 16/16; `npm run build` produced `dist/index.html`; `npm audit --audit-level=high` found zero vulnerabilities. See [clean-suite.json](evidence/polish-6/clean-suite.json).
- Work-order deploy gate repeated `npm ci`, 88 browser tests, 16 unit tests, and the production build before upload.
- Cold live verifier: all routes have the expected status, title, canonical, Open Graph URL, one h1, one main, legal links, focus behavior, and zero serious/critical Axe findings. `/missing-page` returns HTTP 404. See [live-browser.json](evidence/polish-6/live-browser.json).
- Demo live check: one-click `?demo=1`, persistent banner, five clips, 1→2→3→caught-up sequence, Reset, offline reload, real-state isolation, and guarded Restore/Start exits all passed with zero external requests.
- F-6-1 live check: `/privacy` contains the corrected sentence; restoring the fixture wrote only `sb_license:podcast-recall-loop` and `sb_license:podcast-recall-loop:verdict`, whose only verdict fields were `valid` and `checkedAt`.
- `/opt/fleet/lib/verify-url.sh` passed cold home and `?demo=1` URLs with zero console errors. Captures are in [live-home](evidence/polish-6/live-home) and [live-demo](evidence/polish-6/live-demo).
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.06 s, CLS 0, TBT 79 ms. See [lighthouse-summary.json](evidence/polish-6/lighthouse-summary.json).
- Deployed JS (10,820 bytes gzip), CSS (4,209 bytes gzip), and service worker match local `dist/` hashes. See [asset-hashes.txt](evidence/polish-6/asset-hashes.txt).

## Run and verify

```sh
npm ci
npm test
npm run test:unit
npm run build
node scripts/verify-live.mjs https://podcast-recall-loop.sociobot.in .factory/evidence/polish-6
```

## Known gaps and next steps

None for the reviewed product contract. Deployment infrastructure and billing configuration remain factory-owned, as required.
