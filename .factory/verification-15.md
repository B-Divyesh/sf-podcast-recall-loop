# Independent verification 15 — PASS

**Verdict: PASS**

- Candidate implementation: `7158503d6f505e6c8a4f4f73dd69450578868e5b`
- Documentation/evidence revision: `6d03c3a7446f48bb87ffd19b0c68b23006d9b58e`
- Live URL: <https://podcast-recall-loop.sociobot.in>
- Verified: 5 September 2026 UTC
- Findings: **0** (blocking/high/medium/low/informational)
- Untested public claims: **0**

## First read and product result

Fresh 390 × 844 phone and 1440 × 900 desktop contexts opened at scroll position
zero. Before scrolling, the page stated:

- **Job:** “Turn podcast moments into recall questions.”
- **Audience:** “For podcast listeners who save useful moments, then forget what
  they learned.”
- **First action:** **Try it with sample data**. The adjacent text says it opens
  five fictional-show clips with no setup.

The first screen contained the three stated facts within the phone viewport,
with no horizontal overflow. Visual inspection confirmed the product-specific
porcelain/ice visual system, readable hierarchy, real mobile stacking, and a
clear desktop capture/review workspace.

One click entered the isolated sample workspace. It visibly kept the persistent
“Demo — sample data, nothing is saved to your notes” label, five realistic
authored clips, three due questions, **Reset demo**, and **Start for real**. I
completed all three reviews, reached the caught-up state, reloaded, reset the
sample, and reloaded offline after service-worker activation. I also seeded a
real note and license state, changed the demo, and confirmed the real state was
unchanged through the Restore-a-license and Start-for-real exits.

## Claim commands

After `npm ci` (61 packages; `npm audit --audit-level=high` reported 0
vulnerabilities), every exact command declared in `.factory/claims.json` was
run separately. All 28 claims passed:

| Claim IDs | Result |
| --- | --- |
| `offline-reload`, `demo-isolation`, `demo-seed-reset`, `rss-lookup`, `feed-explicit-request`, `atom-lookup`, `daily-three` | PASS — 2 browser projects each |
| `csv-export`, `markdown-export`, `free-limit`, `free-reviews-exports`, `local-privacy`, `no-account`, `browser-persistence` | PASS — 2 browser projects each |
| `metadata-only`, `manual-authorship`, `json-backup`, `invalid-backup-recovery`, `spaced-schedule`, `review-results`, `calendar-reminder` | PASS — 2 browser projects each |
| `installable-pwa`, `existing-license`, `one-time-unlimited`, `license-restore`, `license-storage`, `sociobot-billing` | PASS — 2 browser projects each |
| `build-coupled-updates` | PASS — 1 targeted Vitest test |

The first batched pass recorded one 30-second desktop timeout in
`@claim:review-results`, after its first review action, while independent live
browser checks were also running. The exact command then passed in three fresh,
separate runs (two projects each), and the final full suite passed 98/98. This
was not reproducible as a product failure and is not a finding.

Cross-checking the landing page, privacy/terms copy, README, and metadata found
no public product claim absent from `.factory/claims.json`.

## Quality gates and live checks

| Check | Result |
| --- | --- |
| `npm test` | PASS — 98/98 Playwright tests |
| `npm run test:unit` | PASS — 17/17 Vitest tests |
| `npm run build` | PASS — TypeScript check, Vite build, service-worker finalizer; `dist/` produced |
| Initial assets | PASS — JS 11,012 bytes gzip; CSS 4,209 bytes gzip |
| `/opt/fleet/lib/verify-url.sh` | PASS — 678 ms cold load, no console errors, title/lang/main/image-alt checks pass |
| Axe | PASS — 0 serious or critical violations on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/missing-page` |
| Mobile Lighthouse | PASS — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, CLS 0, TBT 0 ms, 27 KiB transfer |

The live route review returned 200 for `/`, `/demo`, `/app`, `/privacy`, and
`/terms`. Each had its route-specific title, one `h1`, one `main`, canonical,
and Open Graph URL. `/missing-page` deliberately returned HTTP 404 with the
styled not-found page; it is expected behavior, not a defect. Back restored
the prior 1200 px scroll position and focused the returned page heading.

Keyboard, focus, labels, touch targets, dark contrast, reduced-motion behavior,
and service-worker offline reload are covered by the final Playwright suite and
live smoke checks. Request logging during the normal note flow, cold sample
flow, and demo isolation flow found no tracking or note-data requests to a
different origin. Invalid backup recovery, invalid/revoked/unavailable license
recovery, timestamp validation, free-limit boundary, and real data persistence
are covered by the passing unit/browser tests and live fail-closed license
check.

## Payment, deployment, and prior findings

Fresh desktop and phone browser visits to the purchase endpoint reached the
hosted checkout with Podcast Recall Loop, USD, `$9.00`, and one-time billing.
`npm run verify:billing-live` independently verified HTTP 303 from the
Sociobot endpoint, hosted HTTP 200, product/currency/price/900-cent/one-time
content, then 30 invalid-license HTTP 200 responses followed by HTTP 429 with
`Retry-After: 4`.

The production `index.html`, fingerprinted JavaScript and CSS, service worker,
manifest, and social image byte-match this local build. This confirms the live
runtime corresponds to the implementation candidate; `6d03c3a` is
documentation-only after the implementation commits.

Every earlier finding was rechecked and remains resolved:

| Earlier IDs | Current disposition |
| --- | --- |
| `F-1-1`–`F-1-12` | Fixed — isolated/disposable demo, declared claims, route metadata, plain visitor wording, answer-based reviews, license restore, and calendar reminder all pass. |
| `F-2-1`–`F-2-3` | Fixed — feed contacts are explicit, Atom fields populate, and Back restores scroll/focus. |
| `F-3-1`, `F-4-1`–`F-4-6` | Fixed — every demo exit disposes sample data; capped daily queue, reset, privacy logging, accurate README/copy, and Node support pass. |
| `F-5-1`, `F-6-1`, `F-7-1` | Fixed — footer is accessible, license storage is bounded/documented, and the daily limit correctly applies only to automatic checks. |
| `F-12-1`, `F-13-2` | Fixed — demo isolation completes in the full two-worker suite; invalid licenses remain locked at eight free spaces. |
| `F-13-1`, `F-8-1` | Fixed in production — the formerly failing checkout now returns the complete hosted checkout result. |

## Reproduce

```sh
npm ci
npm test
npm run test:unit
npm audit --audit-level=high
npm run build
npm run verify:billing-live
node scripts/verify-live.mjs https://podcast-recall-loop.sociobot.in /tmp/live-check
```
