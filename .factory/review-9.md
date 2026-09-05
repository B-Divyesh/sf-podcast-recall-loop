# Review 9 — Turn podcast moments into recall questions

**Verdict: PASS**

- Implementation reviewed: `7158503d6f505e6c8a4f4f73dd69450578868e5b`
- Documentation/report revision: `cb6bd5f0a1035e27c1a4c06170a6a6ef725646d9`
- Live URL: <https://podcast-recall-loop.sociobot.in>
- Reviewed: 5 September 2026 UTC
- Findings: **0**
- Untested public claims: **0**

## First screen

Fresh 390 × 844 phone and 1440 × 900 desktop browser contexts opened the live
home page at scroll position zero.

- **Job:** Turn podcast moments into recall questions.
- **Audience:** Podcast listeners who save useful moments, then forget what
  they learned.
- **First action:** **Try it with sample data**. It says that it opens five
  fictional-show clips with no setup.

The phone first screen contained the action and all three facts before the
fold, with no horizontal overflow. Fresh visual review confirms the stated
porcelain/ice system, readable hierarchy, real mobile stacking, and a distinct
desktop capture/review workspace. Evidence: `/work/.evidence/review-9-live/`.

## Product checks

One click entered the isolated sample workspace. The persistent label said
**Demo — sample data, nothing is saved to your notes.** It showed five authored
clips and a three-question queue. The queue progressed 1 → 2 → 3 → caught up.
Reset restored the original sample. Changing a sample then using both
**Restore a license** and **Start for real** discarded it; a seeded real note
and license state remained unchanged. After service-worker activation, a demo
reload worked offline.

The live verifier also exercised a real saved clip, an invalid license,
route/back navigation, legal pages, the designed 404, route metadata, and
serious/critical Axe scans. Invalid licenses remained locked to eight free
spaces. Normal saved-note and demo flows made no external note or tracking
requests. The deliberate `/missing-page` HTTP 404 rendered the designed
recovery page and is expected behavior.

## Claim commands

After `npm ci`, every exact command declared in `.factory/claims.json` ran
separately and passed. This covers all 28 IDs:

`offline-reload`, `demo-isolation`, `demo-seed-reset`, `rss-lookup`,
`feed-explicit-request`, `atom-lookup`, `daily-three`, `csv-export`,
`markdown-export`, `free-limit`, `free-reviews-exports`, `local-privacy`,
`no-account`, `browser-persistence`, `metadata-only`, `manual-authorship`,
`json-backup`, `invalid-backup-recovery`, `spaced-schedule`, `review-results`,
`calendar-reminder`, `installable-pwa`, `existing-license`,
`one-time-unlimited`, `license-restore`, `license-storage`,
`build-coupled-updates`, and `sociobot-billing`.

The final Playwright result record was `passed` with no failed tests. Landing,
README, privacy, terms, and metadata copy were cross-checked against the claim
registry; no public product claim was unlisted.

## Quality and live checks

| Check | Result |
| --- | --- |
| `npm test` | PASS — 98/98 browser tests |
| `npm run test:unit` | PASS — 17/17 tests |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities reported |
| `npm run build` | PASS — TypeScript, Vite, service-worker finalizer, and `dist/` |
| Built initial assets | PASS — JS 11,069 bytes gzip; CSS 4,199 bytes gzip |
| `/opt/fleet/lib/verify-url.sh` | PASS — home 747 ms and demo 570 ms; no console errors; title/lang/main/alt checks pass |
| Axe | PASS — 0 serious or critical violations on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/missing-page` |
| Mobile Lighthouse | PASS — performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, CLS 0, TBT 0 ms, 28 KiB transfer |

Live route results were 200 for `/`, `/demo`, `/app`, `/privacy`, and `/terms`.
Each had its own title, one `h1`, one `main`, canonical URL, and Open Graph
URL. Back restored 1200 px scroll position and focused the returned heading.
Keyboard/focus, reduced-motion, touch-target, privacy, offline, invalid backup,
invalid license, free-limit boundary, and recovery paths are covered by the
passing browser suite and live smoke checks.

Fresh billing verification passed: checkout returned 303 to a hosted 200 page
that displayed Podcast Recall Loop, USD, `$9.00`, 900 cents, and one-time
billing. Thirty invalid license checks returned 200 before a 429 with
`Retry-After: 4`.

The live JavaScript, CSS, and service-worker bytes match the fresh build from
the implementation commit. The later `cb6bd5f` revision changes reports only.

## Earlier findings

| Earlier findings | Current disposition |
| --- | --- |
| `F-1-1`–`F-1-12` | Fixed — isolated and disposable demo, declared claims, metadata, clear copy, answer-based review behavior, license restore, and calendar reminder pass. |
| `F-2-1`–`F-2-3` | Fixed — explicit feed requests, Atom fields, and Back scroll/focus pass. |
| `F-3-1`, `F-4-1`–`F-4-6` | Fixed — all demo exits reset, the daily queue remains capped, privacy request coverage, copy, and Node documentation pass. |
| `F-5-1`, `F-6-1`, `F-7-1` | Fixed — footer wording, bounded license storage disclosure, and automatic daily-check wording pass. |
| `F-12-1` | Fixed — the formerly flaky demo-isolation claim completed in this separate claim run and the 98-test suite. |
| `F-13-1`, `F-13-2`, `F-8-1` | Fixed — checkout is live and complete; rejected and unavailable license paths fail closed. |

## Evidence

- Fresh live browser evidence: `/work/.evidence/review-9-live/`
- URL verifier evidence: `/work/.evidence/review-9-url/` and
  `/work/.evidence/review-9-demo-url/`
- Lighthouse JSON: `/work/.evidence/review-9-lighthouse.json`

No findings remain. This review is **PASS**.
