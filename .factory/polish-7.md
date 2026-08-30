# Polish round 7 retry — cumulative finding disposition

**Product commits:** `19652303c5f99c4d7e1efa92aed460edac575051`, `c61fc1fc39c730aefb940e3efe8bb41f3bf5e74e`

**Production:** <https://podcast-recall-loop.sociobot.in>

**Deployment:** Azure Static Web Apps `b93005b9-d722-48f5-9b8f-1f8673ee6265`, 30 August 2026 UTC

The controller-reported build failure was reproduced first: a dependency-free checkout exited 127 at `tsc: not found`. The new conditional prebuild installs the exact lockfile when build tools are absent. A clean copy with no `node_modules` then passed `npm run build` and produced `dist/index.html`; see [clean-suite.json](evidence/polish-7-retry1/clean-suite.json).

Every finding in reviews 1–7 and every earlier polish report was reread and rechecked. The structured cold-production record is [live-browser.json](evidence/polish-7-retry1/live/live-browser.json). Screenshots show the [390 px first screen](evidence/polish-7-retry1/live/live-home-mobile.png), [one-click demo](evidence/polish-7-retry1/live/live-demo-mobile.png), [recall app](evidence/polish-7-retry1/live/live-app-desktop.png), and [privacy page](evidence/polish-7-retry1/live/live-privacy-desktop.png).

| Finding | Change made | Test, screenshot, and live URL evidence |
| --- | --- | --- |
| F-1-1 | Demo mode is selected before licensing. `?license=` is ignored there, and real note/license storage is never read or changed. | `@claim:demo-isolation`; [demo](evidence/polish-7-retry1/live/live-demo-mobile.png); cold `/?demo=1&license=ignored-demo-token` kept real state byte-equal with zero external requests. |
| F-1-2 | Every demo exit deletes the demo database before navigation. | `@claim:demo-isolation`; [banner and exits](evidence/polish-7-retry1/live/live-demo-mobile.png); live Restore and Start exits each returned to five clips and three due questions. |
| F-1-3 | The five fictional clips and Reset behavior remain registered; the test now enters in one click and byte-compares restored sample state. | `@claim:demo-seed-reset`; [fresh demo](evidence/polish-7-retry1/live/live-demo-mobile.png); live `/?demo=1` Reset returned to Question 1 of 3. |
| F-1-4 | The checkout fixture asserts slug, USD, one-time billing, and 900 cents. | `@claim:one-time-unlimited`; [price section](evidence/polish-7-retry1/live/live-home-mobile.png); live checkout returned 303 with a destination. |
| F-1-5 | Build-time route shells and runtime navigation set route-specific title, description, canonical, Open Graph, and Twitter values. Preview now serves those real shells. | `every route updates canonical, Open Graph, and Twitter metadata` plus route response tests; [home](evidence/polish-7-retry1/live/live-home-desktop.png); live `/`, `/demo`, `/app`, `/privacy`, `/terms`, and 404 passed. |
| F-1-6 | The first screen and preview use explicit job wording: **Turn podcast moments into recall questions** and **Write your own recall question**. | `cold first screen names the job, audience, sample outcome, and three facts`; [390 px home](evidence/polish-7-retry1/live/live-home-mobile.png); live `/` passed the fold check. |
| F-1-7 | Visitor copy uses **podcast feed** and explains manual entry. | `@claim:rss-lookup`; [demo form](evidence/polish-7-retry1/live/live-demo-mobile.png); live `/demo` shows the feed-address helper and manual fields. |
| F-1-8 | Reader copy says notes stay in this browser; IndexedDB appears only in developer documentation. | `@claim:browser-persistence`; [first-screen facts](evidence/polish-7-retry1/live/live-home-mobile.png); live `/` shows the browser-storage wording. |
| F-1-9 | User documentation describes installation and offline review without PWA jargon. | `@claim:installable-pwa` and `@claim:offline-reload`; [demo](evidence/polish-7-retry1/live/live-demo-mobile.png); live `/?demo=1` reloaded offline with its recall action. |
| F-1-10 | Copy says the answer determines the next review, and both result paths are covered. | `@claim:review-results` and `@claim:spaced-schedule`; [recall UI](evidence/polish-7-retry1/live/live-app-desktop.png); live demo completed 1→2→3 without refilling. |
| F-1-11 | **Restore a license** names the result and focuses the token field. | `@claim:license-restore`; [price section](evidence/polish-7-retry1/live/live-home-mobile.png); live `/#restore-license` focused the input. |
| F-1-12 | The recall page downloads a local recurring daily calendar reminder. | `@claim:calendar-reminder`; [app](evidence/polish-7-retry1/live/live-app-desktop.png); live `/app` exposes the action. |
| F-2-1 | A feed request begins only after **Find episodes**. | `@claim:feed-explicit-request`; [demo form](evidence/polish-7-retry1/live/live-demo-mobile.png); cold live home/demo made no external request. |
| F-2-2 | Atom lookup remains registered and checks podcast, episode, and link fields. | `@claim:atom-lookup`; [demo form](evidence/polish-7-retry1/live/live-demo-mobile.png); live `/demo` retains the tested workflow. |
| F-2-3 | Back/Forward retain scroll and focus the destination heading. | `Back restores the previous scroll position and focuses its page heading`; [home](evidence/polish-7-retry1/live/live-home-desktop.png); live Back restored 1200 px and focused the h1. |
| F-3-1 | The visible demo Restore link uses the same disposal guard as every other exit. | `@claim:demo-isolation`; [demo exits](evidence/polish-7-retry1/live/live-demo-mobile.png); the exact live Restore path returned to a pristine demo. |
| F-4-1 | A persisted local-day snapshot holds at most three clip IDs and never refills that day. | `@claim:daily-three`; [queue](evidence/polish-7-retry1/live/live-demo-mobile.png); live sequence was 1→2→3→caught up and stayed caught up after reload. |
| F-4-2 | Progress comes from the daily snapshot, so a fresh demo starts at Question 1. | `@claim:demo-seed-reset`; [fresh demo](evidence/polish-7-retry1/live/live-demo-mobile.png); live `/?demo=1` began at Question 1 of 3. |
| F-4-3 | The privacy request log covers real save, reload, export, import, and delete flows. | `@claim:local-privacy`; [privacy](evidence/polish-7-retry1/live/live-privacy-desktop.png); cold live demo/isolation request lists were empty. |
| F-4-4 | README says Start for real opens the separate real library, which may contain notes. | `@claim:demo-isolation`; [Start for real](evidence/polish-7-retry1/live/live-demo-mobile.png); live Start preserved the seeded real note. |
| F-4-5 | The art caption names the task: save a podcast moment, write a question, recall it later. | `cold first screen names the job, audience, sample outcome, and three facts`; [home art](evidence/polish-7-retry1/live/live-home-mobile.png); live `/` contains the product-specific caption. |
| F-4-6 | README and package metadata state Node `^20.19.0 || >=22.12.0`. | `documents the supported Node versions precisely`; [versioned footer](evidence/polish-7-retry1/live/live-home-mobile.png); live assets match the verified build. |
| F-5-1 | The footer contains only the public version and no inaccessible design-notes reference. | `every route shows the build version without referring to private design notes`; [footer](evidence/polish-7-retry1/live/live-home-mobile.png); all live routes show Version 1.0.9. |
| F-6-1 | Privacy names the stored license token and daily verification result. | `@claim:license-storage`; [privacy](evidence/polish-7-retry1/live/live-privacy-desktop.png); live storage contained only the two documented keys and verdict fields. |
| F-7-1 | Privacy limits the daily promise to automatic checks. Two explicit submissions are documented by behavior as two requested checks. | `explicit Verify license submissions each request a fresh check while automatic reloads stay cached` and `@claim:existing-license`; [privacy](evidence/polish-7-retry1/live/live-privacy-desktop.png); live fixture recorded two explicit requests and no extra reload request. |

## Additional retry repairs

- The first-screen headline and audience sentence now state the job and listener directly. The required action, result, and three facts remain above the fold at 390×844.
- The production preview now serves actual per-route HTML shells and an HTTP 404 instead of returning the home shell with 200. The browser suite asserts response status and pre-JavaScript titles.
- The offline claim creates and closes its own browser context before changing network state.
- The one-question count now announces **1 question due**, not **1 questions due**.
- The catalog line is verb-first and 76 characters: **“Turn saved podcast moments into questions, then recall three ideas each day.”**

## Acceptance evidence

- [Clean claims](evidence/polish-7-retry1/clean-claims.json): all 28 registry commands passed independently.
- [Clean suite](evidence/polish-7-retry1/clean-suite.json): dependency-free direct build passed, 92 Playwright tests passed, 17 Vitest tests passed, final build passed, and audit found zero high-severity vulnerabilities.
- [Home URL verifier](evidence/polish-7-retry1/live-home/verify.json) and [demo URL verifier](evidence/polish-7-retry1/live-demo/verify.json): no console errors, one h1, one main, `lang=en`, complete image alternatives, and labeled controls.
- [Live Lighthouse](evidence/polish-7-retry1/lighthouse-summary.json): 100 performance, accessibility, best practices, and SEO; LCP 1.1 s, CLS 0, TBT 0 ms.
- [Asset hashes](evidence/polish-7-retry1/asset-hashes.txt): production HTML, JS, CSS, worker, and manifest match `dist/` byte-for-byte.
- [Live headers](evidence/polish-7-retry1/live-headers.txt): immutable fingerprinted assets, revalidated worker/manifest, CSP, privacy headers, and a real HTTP 404.

No finding of any severity remains open.
