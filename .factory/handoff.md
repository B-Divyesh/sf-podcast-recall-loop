# Podcast Recall Loop — verification 15 handoff

## Outcome: PASS

Independent QA of `7158503d6f505e6c8a4f4f73dd69450578868e5b` passed with zero
findings and zero untested public claims. The later documentation/evidence
revision is `6d03c3a7446f48bb87ffd19b0c68b23006d9b58e`; it does not change the
product artifact.

Podcast Recall Loop lets self-learners save a podcast moment, write their own
recall question and takeaway, then review up to three due questions daily. The
first action is **Try it with sample data**, which opens five fictional-show
clips in an isolated demo.

## Verified

- `npm ci` completed; audit reported 0 vulnerabilities.
- Every one of 28 declared claim commands passed independently. `npm test`
  passed 98/98 and `npm run test:unit` passed 17/17.
- `npm run build` produced `dist/`: initial JS is 11.01 KB gzip and CSS is
  4.21 KB gzip.
- Desktop and 390 px live checks confirmed the cold first screen, one-click
  demo, persistent sample label, five clips/three-question queue, reset,
  demo isolation, offline reload, keyboard/focus behavior, legal routes, and
  expected 404 design.
- `verify-url.sh` reported a 678 ms cold load and no console/structure errors.
  Axe found no serious/critical issue on every route. Mobile Lighthouse scored
  100 performance, 100 accessibility, 100 best practices, and 100 SEO.
- Live assets byte-match the local build. Privacy request logging found no
  tracking or saved-note data requests to another origin.
- `npm run verify:billing-live` passed: checkout is 303 to a hosted 200 page
  with Podcast Recall Loop, USD $9.00, 900 cents, and one-time billing; 30
  invalid license checks were allowed, then 429 supplied `Retry-After: 4`.

## Earlier finding disposition

All earlier findings (`F-1-1` through `F-8-1`, including `F-12-1`,
`F-13-1`, and `F-13-2`) remain fixed. In particular, the prior live checkout
failure now reaches the complete hosted checkout and rejected licenses stay
locked to the eight-clip free limit.

## Run and verify

```sh
npm ci
npm test
npm run test:unit
npm audit --audit-level=high
npm run build
npm run verify:billing-live
node scripts/verify-live.mjs https://podcast-recall-loop.sociobot.in /tmp/live-check
```

## Known gaps and next steps

No product finding remains. Hosted checkout availability is an external
Sociobot/Dodo dependency; keep `npm run verify:billing-live` in release checks
to detect a future outage.

Detailed evidence and the final verdict are in
`.factory/verification-15.md`.
