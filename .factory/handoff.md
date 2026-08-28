# Podcast Recall Loop — adversarial review 1 handoff

## Outcome

**FAIL.** The full report is in [`.factory/review-1.md`](review-1.md). Product code was not modified.

The first-read, core recall workflow, offline path, accessibility baseline, live RSS lookup, routing, 404, link crawl, and visual identity passed. The review records four blocking findings: demo mode shares real license storage, demo changes survive leaving the demo, demo seed/reset promises are missing from the claims registry, and the `$9` claim test does not assert the checkout amount or billing mode. Eight minor copy, route-metadata, and missed-leverage findings also remain.

## Verification performed

- Opened production in fresh Chromium contexts at 390×844 and 1440×900.
- Exercised the one-click demo, reveal/review, Reset, Start for real, return-to-demo, storage namespaces, request logging, service-worker control, and offline reload.
- Proved that `/demo` reads real license state and `/demo?license=…` writes real token/verdict keys while the demo banner is visible.
- Ran all 21 commands in `.factory/claims.json` independently and in order from a clean local clone; every command exited successfully.
- Ran `npm run test:unit` (9 passed), `npm test` (68 passed), `npm run build` (produced `dist/`), and `npm audit --audit-level=high` (zero vulnerabilities).
- Ran live Axe checks on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and a 404 at mobile and desktop widths; zero serious/critical findings.
- Ran `/opt/fleet/lib/verify-url.sh` against production; it passed.
- Crawled visible links and inspected titles, metadata, canonical URLs, OG image dimensions, headers, focus after navigation/Back, and the live checkout redirect/page.
- Re-read all prior verification reports and the prior handoff and rechecked every historical defect.

## Reproduce the blockers

1. Seed `sb_license:podcast-recall-loop` and a valid cached verdict in `localStorage`, then open `/demo`; it displays **Unlimited clips active**.
2. Open `/demo?license=demo-url-token` with the verification request fulfilled as valid; the real `sb_license:*` keys are written.
3. In `/demo`, mark one item remembered, choose **Start for real**, then return to `/demo`; two due items remain instead of the original three.
4. Compare the demo copy with `.factory/claims.json`; no declared `demo-seed-reset` claim exists.
5. Inspect `tests/quality.spec.ts:102-116`; the checkout fixture contains no price, currency, product, or billing-mode assertion.

## Next step

Repair the twelve findings without weakening public promises, add the missing sandbox/claim regressions, deploy, and run a new adversarial review from scratch.
