# Podcast Recall Loop — adversarial review 4 handoff

## Outcome

Review 4 is **FAIL** at candidate `c595b908e26a1f1c0ebbe8ea1030cf92d58147b9` and the matching production deployment.

Two blocking defects remain:

- The queue does not enforce the promised three-question daily limit. With five overdue clips, completing three presents a fourth.
- A fresh one-click demo labels its first prompt **“Question 3 of up to 3 today.”**

Four minor findings cover incomplete saved-note privacy coverage, an inaccurate “empty library” sentence, a generic slogan, and an inaccurate Node version requirement. Full evidence and fixes are in [`.factory/review-4.md`](review-4.md).

## Work performed

- Opened production cold in fresh Chromium contexts at 390×844 and 1440×900.
- Entered the one-click demo, reviewed and reset sample data, tested a legal-page exit and **Start for real**, compared seeded real storage, and reloaded offline.
- Reproduced the daily-limit failure by making all five shipped demo clips overdue and completing three distinct prompts.
- Read `.factory/brief.json`, `.factory/design.md`, every prior review and polish report, and the previous handoff.
- Audited every landing and README copy unit with word counts and checked public claims against `.factory/claims.json`.
- Ran all 26 declared claim commands independently and in order from a clean clone.
- Ran the aggregate Playwright suite, unit suite, and production build from the clean clone.
- Checked all public routes, route metadata, 404 status, discovered links, Back/scroll/focus behavior, live request logs, accessibility, headers, bundle size, and live-to-build asset hashes.

No product code was changed.

## Verification results

```text
all 26 claims.json commands independently   PASS (declared fixtures)
npm test                                    PASS — 80 tests
npm run test:unit                           PASS — 10 tests
npm run build                               PASS — dist/ produced
fresh five-overdue daily-limit check        FAIL — fourth prompt appears
live first demo progress                    FAIL — starts at question 3
```

The `daily-three` command is a false positive because its fixture has exactly three due clips. The expanded five-overdue check is the evidence for F-4-1.

Production JavaScript and CSS hashes match the clean build. JavaScript is 28.78 KB raw / 10.04 KB gzip. Route checks found no console errors; final live Axe checks found no serious or critical violations.

## Review evidence

- [Review report](review-4.md)
- [Cold mobile landing](evidence/review-4-home-mobile.png)
- [Cold desktop landing](evidence/review-4-home-desktop.png)
- [Fresh mobile demo](evidence/review-4-demo-mobile.png)

## Next steps

1. Persist a dated daily queue of at most three clip IDs and its completion count.
2. Make fresh demo progress read 1, 2, 3, then caught up.
3. Seed `@claim:daily-three` with five or more overdue clips and assert no fourth same-day prompt, including after reload.
4. Close F-4-3 through F-4-6 exactly as specified in the review.
5. Rerun all claim commands and the complete cold/live checklist before seeking PASS.
