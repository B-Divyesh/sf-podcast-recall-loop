# Polish round 3 — cumulative finding disposition

**Implementation commit:** `d48017813962dd6f3e48a9a52a153498faeaff26`

**Production:** <https://podcast-recall-loop.sociobot.in>

**Deployment:** `926d38f5-28cb-40a1-b7c0-607c74f157f1`, 29 August 2026

Every finding in reviews 1–3 was rechecked against the deployed site. The cold captures show the [desktop first screen](evidence/polish-3/live/home-desktop.png), [390 px first screen](evidence/polish-3/live/home-mobile.png), and [one-click demo](evidence/polish-3/live/demo-mobile.png). The structured live results are in [`browser-checks.json`](evidence/polish-3/live/browser-checks.json).

| Finding | Change made | Executable evidence | Screenshot and live URL evidence |
| --- | --- | --- | --- |
| F-1-1 | Demo mode is selected before licensing. It ignores license query values and never reads, verifies, or writes real license storage. | `@claim:demo-isolation` passed independently from a fresh clone in desktop and mobile Chromium. | [Demo mobile](evidence/polish-3/live/demo-mobile.png); the live `/?demo=1&license=ignored-demo-token` check records no unlimited state, no external request, and byte-equal real storage. |
| F-1-2 | All internal and direct-anchor exits now delete the demo database before navigation. The implementation covers SPA links, checkout, and external links at the navigation boundary. | `@claim:demo-isolation` changes the sample before the actual **Restore a license**, checkout, and **Start for real** controls; all three returns restore five clips and three due. | [Demo mobile](evidence/polish-3/live/demo-mobile.png); live checks under `demo.afterRestore`, `afterCheckout`, and `afterStart` are all true. |
| F-1-3 | The registered `demo-seed-reset` claim names five fictional sample clips and reset behavior. | `@claim:demo-seed-reset` passed independently in both browser projects. | [Demo mobile](evidence/polish-3/live/demo-mobile.png); live entry shows five clips and three due. |
| F-1-4 | The checkout fixture asserts slug, USD, one-time billing, and 900 cents. | `@claim:one-time-unlimited` passed independently in both browser projects. | [Home mobile](evidence/polish-3/live/home-mobile.png); live [`checkout.json`](evidence/polish-3/live/checkout.json) shows the product, $9, and one-time purchase, while the endpoint returned 303. |
| F-1-5 | Build-time route shells and runtime routing set route-specific title, description, canonical, Open Graph, and Twitter metadata. | `every route updates canonical, Open Graph, and Twitter metadata`; release unit route-shell test. | [Desktop home](evidence/polish-3/live/home-desktop.png); live checks cover `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the HTTP-404 route. |
| F-1-6 | The preview heading remains the explicit **Write your own recall question**. | Aggregate structure/copy suite passed. | [Desktop home](evidence/polish-3/live/home-desktop.png); cold `/` check. |
| F-1-7 | Visitor copy uses **podcast feed** and explains manual entry; RSS remains developer terminology. | `@claim:rss-lookup` passed independently. | [Demo mobile](evidence/polish-3/live/demo-mobile.png); live `/demo` capture form. |
| F-1-8 | The README introduction says notes stay in this browser; IndexedDB appears only in developer documentation. | `@claim:browser-persistence` passed independently. | [Home mobile](evidence/polish-3/live/home-mobile.png); live first-screen browser-storage fact. |
| F-1-9 | Visitor documentation describes installation and offline review without unexplained PWA jargon. | `@claim:installable-pwa` and `@claim:offline-reload` passed independently. | [Demo mobile](evidence/polish-3/live/demo-mobile.png); live offline check retains the banner and recall action. |
| F-1-10 | Copy explains that the next review follows the listener’s answer, and both result paths are protected. | `@claim:review-results` and `@claim:spaced-schedule` passed independently. | [Demo mobile](evidence/polish-3/live/demo-mobile.png); live mutation changed three due questions to two. |
| F-1-11 | **Restore a license** names the result. Its fragment route now opens the form and focuses the token input. | `@claim:license-restore`; `@claim:demo-isolation` activates the exact app-page anchor. | [Restore form mobile](evidence/polish-3/live/restore-mobile.png); live restore URL is `/#restore-license`, with the form visible and focused. |
| F-1-12 | The real recall page downloads a local recurring daily calendar event. | `@claim:calendar-reminder` passed independently and asserts `RRULE:FREQ=DAILY` plus the `/app` URL. | [Recall page mobile](evidence/polish-3/live/app-mobile.png); live `/app` route check returns 200. |
| F-2-1 | Feed privacy wording is consistent and the request starts only on explicit activation. | `@claim:feed-explicit-request` records zero fixture requests before the click and one after. | [Demo mobile](evidence/polish-3/live/demo-mobile.png); live demo flow records no outside requests before an exit. |
| F-2-2 | Atom parsing remains declared and protected with exact podcast, episode, and link assertions. | `@claim:atom-lookup` passed independently. | [Demo mobile](evidence/polish-3/live/demo-mobile.png); live `/demo` capture route returns 200. |
| F-2-3 | History entries retain scroll position; route changes focus and announce the destination heading. | `Back restores the previous scroll position and focuses its page heading` passed in desktop and mobile Chromium. | [Home mobile](evidence/polish-3/live/home-mobile.png); live browser check records 1200→1200 and focused Privacy/home headings. |
| F-3-1 | The visible demo **Restore a license** link now uses the guarded route handler. Direct links such as checkout are guarded too. The destination opens and focuses the restore form. | `@claim:demo-isolation` activates the actual restore anchor after changing a sample, returns to demo, and asserts five clips plus three due. | [Demo mobile](evidence/polish-3/live/demo-mobile.png); live exact reproduction records two due before exit, then the pristine five/three sample on return. |

## Additional release hardening

The offline fallback previously contained inline CSS that the deployed CSP would block. Its product-specific broken-loop styling now lives in `/offline.css`, the service worker precaches it, and the release unit suite protects that contract. The live fallback and stylesheet both return 200 under the production CSP.

## Complete acceptance evidence

- Fresh clone of `d480178`: all 26 claim commands passed independently. See [`clean-claims.json`](evidence/polish-3/clean-claims.json).
- Fresh clone aggregate: `npm test` 80 passed; `npm run test:unit` 10 passed; `npm run build` passed with `dist/index.html`; `npm audit --audit-level=high` found zero vulnerabilities. See [`clean-suite.json`](evidence/polish-3/clean-suite.json).
- Live accessibility and structure: zero serious/critical Axe findings, one `h1`, one `main`, route metadata, no mobile overflow, and no normal-route console errors across all public routes and 404. See [`browser-checks.json`](evidence/polish-3/live/browser-checks.json).
- Live performance: Lighthouse 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.0 s, CLS 0, TBT 0 ms. See [`lighthouse-summary.json`](evidence/polish-3/live/lighthouse-summary.json).
- Deployment integrity: live JS and CSS SHA-256 values match `dist/`. See [`asset-hashes.txt`](evidence/polish-3/live/asset-hashes.txt).

No finding of any severity remains open.
