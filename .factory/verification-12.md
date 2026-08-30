# Independent verification 12 — Podcast Recall Loop

## Verdict: FAIL

- Candidate commit: `1d7885d37d654879c1f64002a7fa79a259fcec6e`
- Live URL: <https://podcast-recall-loop.sociobot.in>
- Verification date: 2026-08-30 UTC
- Scope: clean `npm ci`, every declared claim command, full browser/unit/build checks, and independent production verification. Product code was not changed.

The product itself is functional and the deployment matches the candidate. The release nevertheless fails the supplied acceptance rule because an `@claim:demo-isolation` browser test failed once in the first clean full-suite run. A claim test that can fail under the normal parallel suite is release-blocking under this work order, even though it did not reproduce in later runs.

## Release-blocking finding

### F-12-1 — flaky `@claim:demo-isolation` mobile claim test (release blocker)

The first clean `npm test` run finished with `test-results/.last-run.json` status `failed`, naming `claims--claim-demo-isolation-…-mobile`. Its failure snapshot showed the test stalled at the mocked **Buy unlimited — $9 once** navigation during the demo-isolation flow. The same test passed when rerun alone on mobile, `--repeat-each=3 --workers=2` passed all 6 desktop/mobile repetitions, and a fresh complete `npm test` rerun passed 92/92. This makes it a non-reproducing test-run failure, not a demonstrated loss of demo isolation; it is still a failing claim test observed from the clean candidate and therefore blocks release by the explicit contract.

## First-read and demo gate

**Passed.** A cold, storage-free load says **“Turn podcast moments into recall questions”**, identifies **“podcast listeners who save useful moments, then forget what they learned,”** and gives a one-click **“Try it with sample data”** action with the result stated beside it: **“Opens five sample clips from fictional shows. No setup.”** The first screen also shows the three plain facts: browser-local notes, offline reviews after the first visit, and the free eight-clip limit.

The demo URL `/?demo=1` opened the isolated five-clip/three-due-question workspace with the persistent “Demo — sample data, nothing is saved to your notes” banner, Reset demo, and Start for real.

## Claims gate

`.factory/claims.json` exists with 28 registered claims. From the clean checkout after `npm ci`, I invoked every exact `test` command in that file through the product demo entry point. The final independent suite and subsequent repeated claim run passed every listed observable behaviour, but F-12-1 means the strict claims gate is **FAIL**, not pass.

| Claim result | Evidence |
| --- | --- |
| `demo-isolation` | **FAIL (flaky)** on first full mobile run; exact mobile rerun passed; 6/6 repeated desktop/mobile runs passed. |
| Other 27 registered claims | Passed in the individual command run and in the final 92/92 full suite: offline reload; demo seed/reset; RSS/Atom and explicit feed requests; daily-three; CSV/Markdown/JSON backup flows; free limit; privacy/no-account/persistence/metadata/manual authorship; invalid backup recovery; scheduling; calendar; installability; license/billing/storage; and build-coupled updates. |

## Local quality gates

| Check | Result |
| --- | --- |
| `npm ci` | Passed; 0 audited vulnerabilities |
| `npm test` | First run: failed only F-12-1; fresh rerun: **92/92 passed** |
| `npx playwright test --grep @claim:demo-isolation --repeat-each=3 --workers=2` | **6/6 passed** |
| `npm run test:unit` | **17/17 passed** |
| `npm run build` | Passed; TypeScript check and `dist/` produced |
| Lint | No lint script is defined |
| Initial JS / CSS gzip | 10.90 KB / 4.20 KB (within 200 KB / 50 KB budgets) |

## Production verification

- Fresh live load had no console/page errors. The supplied `verify-url.sh` passed: HTTP 200, title, `lang=en`, one `h1`, one `main`, and zero images without `alt` or unlabeled buttons.
- Live axe scans of `/`, `/demo`, `/app`, `/privacy`, and `/terms` found zero serious or critical violations. Each route has the correct route title, exactly one `h1`, and one `main`.
- Desktop and 390px mobile demo checks had no horizontal overflow. Keyboard starts at the skip link; the stylesheet supplies an ochre 3px `:focus-visible` outline. Reduced-motion mode made scrolling `auto` and transitions 0.01ms.
- An activated live service worker controlled the demo; offline reload remained on the recall queue and exposed the recall action. The manifest is standalone and service-worker update behaviour is also asserted by the build-coupled claim.
- Live request logs for cold home/demo contained only `podcast-recall-loop.sociobot.in`. The passing local privacy claim additionally observed save/reload/export/import/delete of a real note and allowed only same-origin requests. The feed is requested only after Find episodes; no audio/video elements or media requests were observed.
- Fresh local `dist/` SHA-256 hashes exactly match production for `assets/index-CIc12eSO.js`, `assets/index-CB1EBUkx.css`, `sw.js`, and `manifest.webmanifest`; the live deployment is this candidate build.
- Live headers include CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a restrictive permissions policy. Hashed JS/CSS/images are `max-age=31536000, immutable`; `sw.js` is `no-cache, no-store, must-revalidate`; manifest is hourly revalidated.
- Lighthouse against live production: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP 1.1s, CLS 0, TBT 120ms.
- The external Sociobot license verification endpoint enforced **30 invalid requests** from one client before request 31 returned **429** with `Retry-After: 4`. The PWA has no product-operated server endpoint or sign-in flow.

## Required disposition

Do not accept this candidate until F-12-1 is addressed or explicitly waived: make the demo-isolation claim reliably complete in the normal 2-worker suite, then run every claims command and the complete suite again from a clean checkout.
