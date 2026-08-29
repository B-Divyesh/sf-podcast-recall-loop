# Polish round 7 — cumulative finding disposition

**Product repair commit:** `65004e84df44c946831fda7170730da8da099f4d`  
**Production:** <https://podcast-recall-loop.sociobot.in>  
**Deployment:** Azure Static Web Apps `42b3ed95-7833-461a-ae17-0d8cce950fc0`, 29 August 2026 UTC

Every finding in reviews 1–7 and every earlier polish report was reread and rechecked against source, a clean clone, and the deployed product. The live structured result is [live-browser.json](evidence/polish-7/live-browser.json). Cold screenshots cover the [390 px home screen](evidence/polish-7/live-home-mobile.png), [one-click demo](evidence/polish-7/live-demo-mobile.png), [recall app](evidence/polish-7/live-app-desktop.png), and [corrected privacy page](evidence/polish-7/live-privacy-desktop.png).

| Finding | Change present in round 7 | Executable and live evidence |
| --- | --- | --- |
| F-1-1 | Demo mode is selected before licensing and never reads, verifies, or writes real notes or license keys. | `@claim:demo-isolation`; [demo screenshot](evidence/polish-7/live-demo-mobile.png); live `/?demo=1&license=ignored-demo-token` kept real state byte-equal and made no external request. |
| F-1-2 | Every demo exit deletes the demo database before navigation. | `@claim:demo-isolation`; [demo banner](evidence/polish-7/live-demo-mobile.png); live Restore and Start exits both returned to a pristine five-clip, three-question demo. |
| F-1-3 | Five fictional clips and Reset behavior remain registered as one observable claim. | `@claim:demo-seed-reset`; [fresh demo](evidence/polish-7/live-demo-mobile.png); live Reset restored five clips and Question 1 of 3. |
| F-1-4 | The checkout fixture asserts slug, USD, one-time billing, and 900 cents. | `@claim:one-time-unlimited`; live Sociobot checkout returned 303 with a destination. |
| F-1-5 | Static route shells and runtime navigation use route-specific titles, descriptions, canonicals, Open Graph, and Twitter values. | `every route updates canonical, Open Graph, and Twitter metadata`; live `/`, `/demo`, `/app`, `/privacy`, `/terms`, and HTTP 404 passed in [live-browser.json](evidence/polish-7/live-browser.json). |
| F-1-6 | The preview heading is **Write your own recall question**. | `cold first screen names the job, audience, sample outcome, and three facts`; [home screenshot](evidence/polish-7/live-home-mobile.png). |
| F-1-7 | Visitor copy uses **podcast feed** and explains manual entry. | `@claim:rss-lookup`; [demo form](evidence/polish-7/live-demo-mobile.png); live `/demo` shows the helper and manual fields. |
| F-1-8 | Reader copy says notes stay in this browser; IndexedDB is developer-only wording. | `@claim:browser-persistence`; [first-screen facts](evidence/polish-7/live-home-mobile.png). |
| F-1-9 | User documentation describes installation and offline review without PWA jargon. | `@claim:installable-pwa` and `@claim:offline-reload`; live offline demo reload retained the recall control. |
| F-1-10 | Copy explains that the answer determines the next review, with both outcomes covered. | `@claim:review-results` and `@claim:spaced-schedule`; live demo reached caught-up without refilling. |
| F-1-11 | **Restore a license** names the result and focuses the token field. | `@claim:license-restore`; live demo Restore opened `/#restore-license` with input focus. |
| F-1-12 | The recall page downloads a local recurring daily calendar reminder. | `@claim:calendar-reminder`; [app screenshot](evidence/polish-7/live-app-desktop.png); live `/app` exposes the action. |
| F-2-1 | Feed requests begin only after **Find episodes**. | `@claim:feed-explicit-request`; live cold home/demo activity made no external request. |
| F-2-2 | Atom lookup remains declared and asserts podcast, episode, and link values. | `@claim:atom-lookup`; clean-clone command passed. |
| F-2-3 | Back restores scroll and focuses the destination heading. | `Back restores the previous scroll position and focuses its page heading`; live Back restored 1200 px and focused the home h1. |
| F-3-1 | The visible demo Restore link uses the same disposal guard as every other exit. | `@claim:demo-isolation`; live exact Restore exit reset the sample before return. |
| F-4-1 | The local-day queue snapshot holds at most three clip IDs and does not refill that day. | `@claim:daily-three`; clean five-overdue flow completed 1→2→3→caught up and stayed caught up after reload. |
| F-4-2 | Daily snapshot progress makes a fresh demo start at Question 1. | `@claim:demo-seed-reset`; [fresh demo](evidence/polish-7/live-demo-mobile.png); live sequence was 1→2→3→caught up. |
| F-4-3 | The privacy request log covers real save, reload, export, import, and delete flows. | `@claim:local-privacy`; live cold home/demo logs were same-origin only. |
| F-4-4 | README says Start for real opens the separate real library, which may contain notes. | `@claim:demo-isolation`; live Start preserved the seeded real note and discarded demo changes. |
| F-4-5 | The art caption names the task: save a podcast moment, write a question, recall it later. | `cold first screen names the job, audience, sample outcome, and three facts`; [home screenshot](evidence/polish-7/live-home-mobile.png). |
| F-4-6 | README and package metadata state Node `^20.19.0 || >=22.12.0`. | `documents the supported Node versions precisely`; clean unit/release suite passed 16/16. |
| F-5-1 | The footer contains only the public version and no inaccessible design-notes reference. | `every route shows the build version without referring to private design notes`; all live routes show Version 1.0.8. |
| F-6-1 | Privacy names both the license token and daily verification result. | `@claim:license-storage`; [privacy screenshot](evidence/polish-7/live-privacy-desktop.png); live storage had only the token and `{valid, checkedAt}` verdict. |
| F-7-1 | Privacy now says only automatic stored-license checks occur at most daily. The `existing-license` claim uses the same scope. A new regression proves two explicit **Verify license** submissions are two user-requested checks and a reload adds none. | `explicit Verify license submissions each request a fresh check while automatic reloads stay cached` and `@claim:existing-license`; [privacy screenshot](evidence/polish-7/live-privacy-desktop.png); live fixture recorded `explicitVerificationRequests: 2`. |

## Acceptance evidence

- Clean clone of `65004e8`: all 28 claim registry commands passed independently; see [clean-claims.json](evidence/polish-7/clean-claims.json).
- The same clean clone passed `npm test` (90), `npm run test:unit` (16), `npm run build`, and `npm audit --audit-level=high`; see [clean-suite.json](evidence/polish-7/clean-suite.json).
- Both factory URL-verifier runs passed with no console errors, one h1, one main, `lang=en`, complete image alternatives, and labeled controls; see [home](evidence/polish-7/verify-home/verify.json) and [demo](evidence/polish-7/verify-demo/verify.json).
- Playwright Axe found zero serious/critical findings on every public route and the 404. Mobile Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP 0.99 s, CLS 0, and TBT 33 ms. See [summary](evidence/polish-7/lighthouse-summary.json).
- Production HTML, JavaScript, CSS, service worker, and manifest hashes match `dist/`; see [asset hashes](evidence/polish-7/asset-hashes.txt).
- Catalog description is verb-first and 68 characters: **“Turn podcast moments into questions and recall three ideas each day.”**

No finding of any severity remains open.
