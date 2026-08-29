# Podcast Recall Loop — polish round 2 handoff

## Outcome

All findings in adversarial reviews 1 and 2 are resolved. Version 1.0.3 is deployed at <https://podcast-recall-loop.sociobot.in> with the original glacial ceramic identity and PWA/local-first architecture intact. No known acceptance gap remains.

## What changed

- Added independent `feed-explicit-request` and `atom-lookup` claims with recorded RSS/Atom fixtures and observable browser tests.
- Rewrote the feed privacy promise consistently: the app contacts a feed address only after **Find episodes** is pressed.
- Added manual History API scroll state. Back and Forward now restore the prior position while route changes still focus the page heading.
- Made **Try it with sample data** open the explicit `?demo=1` sandbox. Any navigation out of demo deletes its database; real notes and license keys remain untouched.
- Updated the catalog description, README, demo guide, copy audit, version, claims registry, and release evidence.

Implementation commit: `7432a55c286ccebd7d65541bcd426ece04650fdc`
Production deployment: `51c0d194-7ccd-4519-8e05-22d7a7c4936e`

## Verification

A fresh clone of implementation commit `7432a55c286ccebd7d65541bcd426ece04650fdc` was installed with `npm ci`.

```text
all 26 commands in .factory/claims.json     PASS
npm test                                    80 passed
npm run test:unit                           9 passed
npm run build                               PASS; dist/ produced
npm audit --audit-level=high                0 vulnerabilities
```

The production build is 28.30 KB JavaScript and 14.18 KB CSS raw (9.90 KB and 4.20 KB gzip). The deployed JavaScript SHA-256 matches local: `b9f0c6db7ab1371ada509f3d9f79ad097480c5c450a17573bf6cfbf4a48ddc55`.

Live mobile Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.09 s, CLS 0, total blocking time 14 ms. Live Axe checks found zero serious/critical findings on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the 404. Normal routes logged no console errors.

Production checks confirmed:

- `/?demo=1` opens five sample clips with three due, the persistent demo banner, Reset demo, and Start for real.
- Real IndexedDB and license storage stay byte-for-byte unchanged through demo entry, editing, reset, and exit; no external demo request occurs.
- A feed address receives zero requests before **Find episodes** and exactly one after it.
- The Atom fixture fills podcast, episode, and link fields.
- Back navigation restores `scrollY` from 1200 to 1200 and leaves the returned page heading focused.
- Offline reload retains the sample queue and recall action.
- `/missing-page` returns HTTP 404; all public routes, manifest, robots, and sitemap return 200.
- Sociobot checkout redirects to the hosted product showing Podcast Recall Loop Unlimited, $9.00, and one-time purchase.

Evidence is under [`.factory/evidence/polish-2`](evidence/polish-2/). The complete finding map is [`.factory/polish-2.md`](polish-2.md).

## Run and verify

```sh
npm ci
npm test
npm run test:unit
npm run build
npm run preview
```

Open `http://localhost:4173/?demo=1` for the isolated sample. Deploy the contents of `dist/` as the static artifact.

## Known gaps and next steps

None for the reviewed scope. The app intentionally does not sync notes or generate questions: notes stay local, and writing the question is part of the recall method.
