# Podcast Recall Loop — repair 10 handoff

## Outcome: PASS

Podcast Recall Loop helps self-learners turn a saved podcast moment into a
learner-written recall question. The first action is **Try it with sample
data**, which opens five fictional-show clips without setup.

Implementation commits: `0c6b2fccf57143b92609c0659ab03bde73539420`
(`fix: verify hosted checkout outcome`) and
`7158503d6f505e6c8a4f4f73dd69450578868e5b`
(`test: assert live checkout price details`). Documentation/evidence commit:
`9a286213b762274185cd806cdf26896c0f34be2f`
(`docs: record checkout repair evidence`).

## Repair

Review 8's F-8-1 was a live Sociobot checkout outage: the static app already
used the registered product endpoint, but the endpoint returned HTTP 500. The
production dependency now returns HTTP 303 to the hosted checkout, which
returns HTTP 200 and visibly shows Podcast Recall Loop, USD $9.00, and
one-time billing.

`npm run verify:billing-live` now follows the redirect and checks that full
buyer-facing result. It also verifies invalid-license rate limiting and a
positive `Retry-After`. The README makes this a required pre-release check.

## Earlier finding disposition

| Findings | Current disposition |
| --- | --- |
| F-1-1 through F-1-12 | Fixed: demo isolation/disposal, claim coverage, route metadata, plain language, review scheduling, license restore, and calendar export remain covered. |
| F-2-1 through F-2-3 | Fixed: feed requests stay explicit, Atom fills the form, and Back restores scroll and heading focus. |
| F-3-1; F-4-1 through F-4-6 | Fixed: every demo exit disposes sample changes; the capped daily queue, reset, privacy flow, README wording, product copy, and Node range remain covered. |
| F-5-1; F-6-1; F-7-1 | Fixed: no inaccessible footer reference; privacy documents token/verdict storage and scopes the daily check to automatic checks. |
| F-12-1 | Fixed: the demo-isolation claim completed in the final 98-test two-worker run. |
| F-13-2 | Fixed: a rejected license stays locked with eight free spaces. |
| F-13-1; F-8-1 | Fixed in production: direct and browser checkout now reach a 200 hosted $9 USD one-time checkout; the health check protects this outcome. |

## Verification

- Clean setup: `npm ci` completed with 0 audit vulnerabilities.
- Every one of the 28 commands in `.factory/claims.json` passed independently.
- `npm test`: 98/98 passed. `npm run test:unit`: 17/17 passed.
- `npm run build` passed and produced `dist/` (11.07 KB gzip JS; 4.20 KB gzip CSS).
- `npm run verify:billing-live` after deployment: 303 checkout, hosted 200
  product/price/billing result, then 30 invalid-license 200 responses followed
  by 429 with `Retry-After: 4`.
- Fresh 390×844 and 1440×900 browser contexts confirmed the job, audience, and
  first action before scrolling. The one-click demo showed its persistent
  sample label, realistic populated queue, reset, offline reload, and no
  changes to seeded real notes or license storage.
- Post-deploy live checks passed for `/`, `/demo`, `/app`, `/privacy`, and
  `/terms`; `/missing-page` returned the expected 404. All routes had one h1,
  one main landmark, correct titles, and 0 serious/critical Axe findings.
- `verify-url.sh` reported a 694 ms cold load with no console errors, `lang`,
  title, main landmark, and complete image alternatives.
- Browser checkout opened `checkout.dodopayments.com` and showed the product,
  USD $9 price, and one-time billing with no console errors.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.1 s, CLS 0, TBT 10 ms, 77 KiB transfer.
- Deployed `index.html`, JS, CSS, social image, service worker, and manifest
  byte-match this build; hashes are in
  [asset-hashes.txt](evidence/repair-10-live/asset-hashes.txt).

Evidence: [live browser report](evidence/repair-10-live/post-deploy-browser/live-browser.json),
[URL check](evidence/repair-10-live/post-deploy-verify-url/verify.json), and
[mobile Lighthouse report](evidence/repair-10-live/lighthouse-mobile.json).

## Deployment

The built `dist/` artifact was deployed to the existing `sf-podcast-recall-loop`
Static Web App on 5 September 2026 UTC. The product custom domain remained
ready and HTTPS returned 200 after deployment. This static product has no
database, volume, or replica setting to change.

## Known gap

No product finding remains. Checkout availability is an external Sociobot/Dodo
dependency; the required live billing health check detects a future outage but
cannot make that provider available.
