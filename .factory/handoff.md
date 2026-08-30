# Podcast Recall Loop — adversarial review 8 handoff

## Outcome: FAIL

Review 8 was run against candidate
`49a4894f5b14a66bad1693a43f2bfa4bc7259330` and
<https://podcast-recall-loop.sociobot.in> on 30 August 2026 UTC. No product code
was changed.

One blocking production defect remains: **Buy unlimited — $9 once** targets the
Sociobot checkout endpoint, which returned HTTP 500 in the live browser flow
and three direct retries. This regresses the earlier billing outage recorded as
handoff F-13-1. See [review-8.md](review-8.md), F-8-1.

## Verification completed

- Fresh 390×844 and 1440×900 cold first-screen checks.
- One-click demo, Reset, 1→2→3→caught-up sequence, offline reload, separate
  storage, real-state byte comparison, and exit disposal.
- All 28 claim commands independently from a clean clone.
- Full Playwright: 98/98; Vitest: 17/17; audit: 0 vulnerabilities.
- Production build and a separate dependency-free direct build produced
  `dist/`.
- Live route metadata, real HTTP 404, Back scroll/focus, request logs, link
  crawl, factory URL verifier, and integrated serious/critical Axe checks.
- Live JS, CSS, and service worker byte-match the candidate build.
- Full landing/README copy audit and recheck of every earlier review, polish,
  and handoff finding.

## Known gap and next step

Restore the Sociobot checkout so the endpoint returns 303 to a working 200
checkout with the advertised product, USD one-time billing, and 900-cent
amount. Require `npm run verify:billing-live` as a deployment health gate, then
rerun the live link/billing checks. All other reviewed areas passed.
