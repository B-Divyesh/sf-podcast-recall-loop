# Podcast Recall Loop — adversarial review 7 handoff

## Outcome

**FAIL.** The review wrote no product-code changes. One minor, user-facing
privacy disclosure issue remains; see [review-7.md](review-7.md), F-7-1.

## Completed review work

- Opened the live site cold at 390px and desktop before scrolling. The first
  screen clearly states the job, audience, and sample-data first action.
- Re-ran the demo, offline, real-storage isolation, request-log, routing,
  metadata, 404, link-crawl, keyboard, Back/focus, mobile, and Axe checks.
- Read all earlier review/polish/handoff reports and revalidated each earlier
  finding on current source and live production.
- Ran `npm ci`, every command declared in `.factory/claims.json`, `npm test`,
  `npm run test:unit`, and `npm run build` from this checkout.
- Reproduced F-7-1 in a fresh browser context: two immediate explicit
  **Verify license** submissions send two verification requests, while `/privacy`
  currently says a license check sends the token at most once per day.

## How to verify

```sh
npm ci
npm test
npm run test:unit
npm run build
node scripts/verify-live.mjs https://podcast-recall-loop.sociobot.in /tmp/podcast-recall-review
```

For F-7-1, mock the Sociobot verification URL in a fresh Playwright context,
submit the same restored token twice, and assert two requests. The published
privacy copy should either state that only automatic rechecks are daily, or the
product should enforce a total daily cap.

## Remaining work

Correct F-7-1, add/expand the exact claim assertion, rerun the listed checks,
and conduct a new full adversarial pass. The review report and handoff are the
only intended repository changes in this commit.
