# Polish round 5 — cumulative finding disposition

**Product repair commit:** `5e8c836331c0569ad4d614e027423da329a391ad`  
**Production:** <https://podcast-recall-loop.sociobot.in>  
**Deployment:** Azure Static Web Apps `809d33b5-901b-4692-9e17-81814e0d0a74`, 29 August 2026 UTC

Every finding in reviews 1–5 and every prior polish report was reread. All 27 claim commands passed independently from a clean clone of the repair commit. The cold captures show the [390 px first screen](evidence/polish-5/live-home-mobile.png), [desktop landing page](evidence/polish-5/live-home-desktop.png), and [isolated demo](evidence/polish-5/live-demo-mobile.png). The structured production recheck is in [live-browser.json](evidence/polish-5/live-browser.json).

| Finding | Change made | Test, screenshot, and live evidence |
| --- | --- | --- |
| F-1-1 | Demo mode is selected before license handling. It ignores URL licenses and never reads, verifies, or writes real notes or license storage. | `@claim:demo-isolation`; [demo capture](evidence/polish-5/live-demo-mobile.png); live `/?demo=1&license=ignored-demo-token` kept real state byte-equal and made zero external requests in `live-browser.json`. |
| F-1-2 | Every route, direct anchor, checkout, and Start-for-real exit deletes the demo database before leaving. | `@claim:demo-isolation`; [demo banner and exits](evidence/polish-5/live-demo-mobile.png); live Restore and Start exits both returned to a pristine five-clip, three-question `/demo`. |
| F-1-3 | The five fictional sample clips and Reset behavior remain registered in `claims.json`. | `@claim:demo-seed-reset`; [demo capture](evidence/polish-5/live-demo-mobile.png); live Reset returned to **Question 1 of 3 today**. |
| F-1-4 | The checkout fixture asserts product slug, USD, one-time billing, and 900 cents. | `@claim:one-time-unlimited`; [landing price](evidence/polish-5/live-home-mobile.png); live Sociobot checkout returned HTTP 303. |
| F-1-5 | Build-time route shells and runtime navigation set route-specific title, description, canonical, Open Graph, and Twitter metadata. | `every route updates canonical, Open Graph, and Twitter metadata`; [desktop capture](evidence/polish-5/live-home-desktop.png); live `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the HTTP-404 route passed in `live-browser.json`. |
| F-1-6 | The preview heading is **Write your own recall question**. | `cold first screen names the job, audience, sample outcome, and three facts`; [home mobile](evidence/polish-5/live-home-mobile.png); cold live `/` shows the heading in context. |
| F-1-7 | Visitor copy uses **podcast feed** and explains manual entry; RSS stays in developer documentation. | `@claim:rss-lookup`; [demo capture form](evidence/polish-5/live-demo-mobile.png); live `/demo` shows the feed-address helper and manual fields. |
| F-1-8 | Reader-facing storage copy says **this browser**; IndexedDB appears only in developer notes. | `@claim:browser-persistence`; [first-screen facts](evidence/polish-5/live-home-mobile.png); cold live `/` shows the browser-storage wording. |
| F-1-9 | User documentation describes installation and offline review without unexplained PWA jargon. | `@claim:installable-pwa` and `@claim:offline-reload`; [demo capture](evidence/polish-5/live-demo-mobile.png); live `/?demo=1` reloaded offline with its recall control. |
| F-1-10 | Copy explains that the next review follows the answer, and both answer paths are protected. | `@claim:review-results` and `@claim:spaced-schedule`; [How it works](evidence/polish-5/live-home-mobile.png); live demo completed its fixed queue without refilling. |
| F-1-11 | The disclosure and app exit say **Restore a license**, and the destination focuses the token field. | `@claim:license-restore`; [landing license panel](evidence/polish-5/live-home-mobile.png); live demo Restore opened `/#restore-license` with input focus. |
| F-1-12 | The real recall page downloads a local recurring daily calendar reminder. | `@claim:calendar-reminder`; [app UI](evidence/polish-5/live-app-desktop.png); live `/app` returned 200 and exposed the action. |
| F-2-1 | A feed request starts only after the visible **Find episodes** action. | `@claim:feed-explicit-request`; [demo form](evidence/polish-5/live-demo-mobile.png); live cold demo activity made zero external requests. |
| F-2-2 | Atom support is registered and asserts podcast, episode, and link fields. | `@claim:atom-lookup`; [demo form](evidence/polish-5/live-demo-mobile.png); live `/demo` retained the tested feed workflow. |
| F-2-3 | History entries retain scroll position; Back restores the position and focuses the destination heading. | `Back restores the previous scroll position and focuses its page heading`; [desktop page](evidence/polish-5/live-home-desktop.png); live Back restored `scrollY=1200` and focused the home `h1`. |
| F-3-1 | The visible demo Restore link uses the same disposal guard as every other demo exit. | `@claim:demo-isolation`; [demo exit links](evidence/polish-5/live-demo-mobile.png); the exact live Restore path reset the sample before returning. |
| F-4-1 | A persisted local-day snapshot contains at most three clip IDs and never refills that day. | `@claim:daily-three`; [demo queue](evidence/polish-5/live-demo-mobile.png); live production showed `1→2→3→caught up`, stayed caught up after reload, then Reset restored the queue. |
| F-4-2 | Progress comes from the daily snapshot, so a fresh demo begins at **Question 1 of 3 today**. | `@claim:demo-seed-reset`; [fresh demo](evidence/polish-5/live-demo-mobile.png); live `/?demo=1` began at question one. |
| F-4-3 | The privacy request-log test covers real save, reload, export, import, and delete flows. | `@claim:local-privacy`; [privacy fact](evidence/polish-5/live-home-mobile.png); live cold landing/demo logged only same-origin requests. |
| F-4-4 | README says Start for real discards sample changes and opens the separate real library, which may already contain notes. | `@claim:demo-isolation`; [Start for real](evidence/polish-5/live-demo-mobile.png); live Start preserved the seeded real note and reset the sample. |
| F-4-5 | The art caption names the actual work: save a podcast moment, write a question, recall it later. | `cold first screen names the job, audience, sample outcome, and three facts`; [caption in home capture](evidence/polish-5/live-home-mobile.png); cold live `/` uses the product-specific sentence. |
| F-4-6 | README and `package.json#engines` state Node `^20.19.0 || >=22.12.0`; CI checks both minimums. | `documents the supported Node versions precisely`; [landing remains unaffected](evidence/polish-5/live-home-desktop.png); deployed product asset matches the verified build. |
| F-5-1 | Removed the inaccessible **design notes** footer reference and bumped the visible build id to **Version 1.0.6**. Generated-art provenance remains in the repository design record. | `every route shows the build version without referring to private design notes`; [footer in home capture](evidence/polish-5/live-home-mobile.png); all six live routes show **Version 1.0.6** and contain no **design notes** text in `live-browser.json`. |

## Final verification

- Clean-clone verification: all 27 declared claim commands passed independently on product commit `5e8c836`; the final checkout passed 86 aggregate Playwright tests and 15 Vitest tests, produced `dist/index.html`, and had zero high-severity audit findings.
- Live structure and accessibility: both URL-verifier runs passed; every route has `lang=en`, one `h1`, one `main`, complete image alternatives, labeled controls, and zero serious/critical Axe findings. Normal routes logged no console or page errors.
- Live performance: [Lighthouse](evidence/polish-5/lighthouse-mobile.json) scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP 1.14 s, CLS 0, TBT 88.5 ms.
- Deployment integrity: production serves `index-BkeyvWx-.js` and `index-CB1EBUkx.css`; their SHA-256 values exactly match `dist/`. JavaScript is 10,811 bytes gzip and CSS is 4,209 bytes gzip.

No finding of any severity remains open.
