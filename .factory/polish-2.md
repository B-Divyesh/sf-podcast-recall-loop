# Polish round 2 — cumulative finding disposition

**Implementation commit:** `7432a55c286ccebd7d65541bcd426ece04650fdc`

**Production:** <https://podcast-recall-loop.sociobot.in>

**Deployment:** `51c0d194-7ccd-4519-8e05-22d7a7c4936e`, 29 August 2026

Every finding from `.factory/review-1.md` and `.factory/review-2.md` was rechecked. The linked mobile captures show the [cold first screen](evidence/polish-2/live-home/screenshot-mobile.png) and [isolated demo](evidence/polish-2/live/screenshot-mobile.png).

| Finding | Change made | Test evidence | Live evidence |
| --- | --- | --- | --- |
| F-1-1 | Demo mode is selected before license handling and ignores real license keys and URL tokens. | `@claim:demo-isolation` passed from a fresh clone in desktop and mobile Chromium. | [`live-isolation.json`](evidence/polish-2/live-isolation.json): real storage unchanged, token ignored, zero external requests. |
| F-1-2 | Every in-app exit from demo deletes its database; **Start for real** opens the untouched real library. | `@claim:demo-isolation` changes the demo, exits, and confirms a pristine five-clip return. | [`live-isolation.json`](evidence/polish-2/live-isolation.json): real note preserved; returning demo has five clips and three due. |
| F-1-3 | `demo-seed-reset` registers the five fictional clips and reset behavior. | `@claim:demo-seed-reset` passed in both projects. | [`live-browser.json`](evidence/polish-2/live-browser.json) and [demo screenshot](evidence/polish-2/live/screenshot-mobile.png): reset restores five clips and three due. |
| F-1-4 | The recorded checkout asserts slug, USD, one-time billing, and 900 cents. | `@claim:one-time-unlimited` passed in both projects. | [`live-checkout.json`](evidence/polish-2/live-checkout.json): hosted checkout shows the product, $9.00, and one-time purchase. |
| F-1-5 | Static route shells and runtime navigation set route-specific titles, descriptions, canonicals, Open Graph, and Twitter fields. | `every route updates canonical, Open Graph, and Twitter metadata`; release unit tests passed. | [`live-browser.json`](evidence/polish-2/live-browser.json): correct title/canonical and status on all six checked routes. |
| F-1-6 | The heading is **Write your own recall question**. | Full `npm test` structure/copy check passed. | [Cold home screenshot](evidence/polish-2/live-home/screenshot-mobile.png). |
| F-1-7 | Visitor copy uses **podcast feed** and explains manual entry. | `@claim:rss-lookup` passed in both projects. | [Demo screenshot](evidence/polish-2/live/screenshot-mobile.png) shows the plain-language helper. |
| F-1-8 | README introduction says notes stay “in this browser”; IndexedDB appears only in developer notes. | Copy audit and README review. | Home first screen in [`live-browser.json`](evidence/polish-2/live-browser.json) uses browser language. |
| F-1-9 | README describes installation and offline review without user-facing PWA jargon. | `@claim:installable-pwa` and `@claim:offline-reload` passed. | [`live-browser.json`](evidence/polish-2/live-browser.json): offline notice and recall action remain available. |
| F-1-10 | Copy states the next review is based on the answer; both result paths are covered. | `@claim:review-results` and `@claim:spaced-schedule` passed in both projects. | Live demo reset/review flow passed in [`live-browser.json`](evidence/polish-2/live-browser.json). |
| F-1-11 | The disclosure says **Restore a license**. | `@claim:license-restore` passed in both projects. | [Cold home screenshot](evidence/polish-2/live-home/screenshot-mobile.png). |
| F-1-12 | The recall page downloads a recurring daily calendar reminder. | `@claim:calendar-reminder` passed in both projects and asserts the daily rule plus `/app` URL. | Live `/app` returned 200 with the action; route evidence is in [`live-browser.json`](evidence/polish-2/live-browser.json). |
| F-2-1 | Added the `feed-explicit-request` claim and consistent wording on `/app`, `/privacy`, and README. | `@claim:feed-explicit-request` records zero fixture requests before activation and exactly one afterward. | [`live-browser.json`](evidence/polish-2/live-browser.json): zero before and one after on production. |
| F-2-2 | Added the `atom-lookup` claim with a recorded Atom fixture and exact field assertions. | `@claim:atom-lookup` passed in desktop and mobile Chromium. | [`live-browser.json`](evidence/polish-2/live-browser.json): production parser filled Atom Learning, An Atom episode, and its link. |
| F-2-3 | History entries now retain scroll position; Back/Forward restores it after rendering and keeps heading focus. | `Back restores the previous scroll position and focuses its page heading` passed at desktop and 390×844. | [`live-browser.json`](evidence/polish-2/live-browser.json): `1200 → 1200`, returned `h1` focused. |

## Complete acceptance evidence

- Fresh clone: all 26 declared claim commands passed independently; aggregate `npm test` passed 80 tests; `npm run test:unit` passed 9; `npm run build` produced `dist/`; audit found zero vulnerabilities.
- Accessibility and structure: Playwright Axe found zero serious/critical issues across six routes at desktop and mobile sizes. The live URL verifier reports one `h1`, `lang=en`, a main landmark, complete image alt text, labeled buttons, and no console errors. See [`verify.json`](evidence/polish-2/live-home/verify.json) and [`live-console.json`](evidence/polish-2/live-console.json).
- Performance: [`lighthouse.json`](evidence/polish-2/live-home/lighthouse.json) records 100 performance, 100 accessibility, 100 best practices, 100 SEO, 1.09 s LCP, 0 CLS, and 14 ms total blocking time.
- Deployment integrity: local and live `index-KBCkYhXB.js` share SHA-256 `b9f0c6db7ab1371ada509f3d9f79ad097480c5c450a17573bf6cfbf4a48ddc55`.

No finding of either severity remains open.
