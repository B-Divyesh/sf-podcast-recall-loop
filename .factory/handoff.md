# Podcast Recall Loop — polish round 3 handoff

## Outcome

All findings from adversarial reviews 1–3 are resolved in version 1.0.4. The static PWA is deployed at <https://podcast-recall-loop.sociobot.in>. Its local-first architecture and glacial ceramic visual identity remain intact.

The round-3 implementation is commit `d48017813962dd6f3e48a9a52a153498faeaff26`. Azure Static Web Apps deployment `926d38f5-28cb-40a1-b7c0-607c74f157f1` completed on 29 August 2026.

## What changed

- Closed F-3-1 at the navigation boundary. The actual **Restore a license** anchor, checkout, **Start for real**, internal routes, and external links now discard changed demo state before leaving.
- Expanded `@claim:demo-isolation` to exercise the visible restore anchor, direct checkout exit, and banner exit after changing the sample. Each return starts with five clips and three due questions.
- Kept real notes and license keys byte-for-byte unchanged during the demo, including `/?demo=1&license=...`.
- Made the restore fragment open its disclosure and focus the license-token field.
- Rewrote the first-screen action result as **“Opens five sample clips from fictional shows. No setup.”**
- Updated the claim registry, demo guide, README, copy audit, catalog description, and version.
- Removed inline CSS from the offline fallback, added a CSP-safe product-specific stylesheet, and precached it.
- Preserved the asymmetric porcelain surfaces, glacial palette, original still-life, serif recall prompts, and reduced-motion treatment described in `.factory/design.md`.

The cumulative finding map is [`.factory/polish-3.md`](polish-3.md).

## Verification

A clean clone of implementation commit `d48017813962dd6f3e48a9a52a153498faeaff26` was installed with `npm ci`.

```text
all 26 commands in .factory/claims.json     PASS independently
npm test                                    80 passed
npm run test:unit                           10 passed
npm run build                               PASS; dist/index.html produced
npm audit --audit-level=high                0 vulnerabilities
```

The production build contains 28.78 KB JavaScript and 14.18 KB CSS raw (10.04 KB and 4.20 KB gzip). This is below the 200 KB JS and 50 KB CSS budgets. Product images are 9.8–25.0 KB each.

Live mobile Lighthouse results: 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.0 s; CLS was 0; total blocking time was 0 ms. A navigation audit does not report INP.

Cold production checks confirmed:

- The 390×844 first screen shows the job, audience, sample action, its result, and all three facts without scrolling or horizontal overflow.
- `/?demo=1` opens five sample clips with three due questions and the persistent demo/reset/start banner.
- After changing the sample, **Restore a license**, checkout, and **Start for real** each discard it; every return has five clips and three due.
- The restore destination is `/#restore-license`; its form opens and its input receives focus.
- Real IndexedDB and license storage remain unchanged throughout demo use; no external request occurs before a deliberate exit.
- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200. `/missing-page` returns 404 with the designed recovery page.
- Every route has its own title, description, canonical, Open Graph title/URL, one `h1`, and one `main`.
- Back navigation restores `scrollY` from 1200 to 1200 and keeps route-heading focus.
- Live Axe checks found zero serious/critical findings on every public route and the 404. Normal routes logged no console errors.
- A controlled offline reload retains the sample queue, offline notice, and recall action.
- The checkout endpoint returns 303 to the hosted checkout, which shows Podcast Recall Loop Unlimited, $9, and one-time purchase.
- Live JS and CSS hashes match the local `dist/` files exactly.

Evidence is under [`.factory/evidence/polish-3`](evidence/polish-3/). Key files are the [clean claim log](evidence/polish-3/clean-claims.json), [clean aggregate suite](evidence/polish-3/clean-suite.json), [live browser checks](evidence/polish-3/live/browser-checks.json), [Lighthouse summary](evidence/polish-3/live/lighthouse-summary.json), and [live URL verifier](evidence/polish-3/live/verify.json).

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

None for the reviewed scope. The product intentionally does not sync notes or generate questions: notes stay local, and writing the question is part of the recall method.
