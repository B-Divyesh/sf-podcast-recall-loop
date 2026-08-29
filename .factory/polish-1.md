# Polish round 1 — finding disposition

**Repair commit:** `9831c19650d7a3fd9f738cc3f0f7c2f86a989a9e`  
**Production:** <https://podcast-recall-loop.sociobot.in>  
**Deployed:** 29 August 2026, Static Web Apps deployment `657513c1-eff8-424b-ac81-25542901e4e2`

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo mode is determined before license handling. It ignores `license` query values and never calls, reads, or writes real license storage. | `@claim:demo-isolation`; live [`live-browser-a11y.json`](evidence/polish-1/live-browser-a11y.json) records unchanged storage, zero outside requests, and no unlimited state at `/demo?license=demo-url-token`. |
| F-1-2 | **Start for real** deletes the demo database before routing to `/app`; a later `/demo` reseeds the original sample. | `@claim:demo-isolation`; live evidence records five clips and three due questions after returning to `/demo`. |
| F-1-3 | Added `demo-seed-reset` to `claims.json`, tagged its observable test, and rewrote sample wording as five clips from fictional educational shows. | `@claim:demo-seed-reset` (fresh clone, desktop and mobile). |
| F-1-4 | Recorded checkout fixture now exposes and asserts product slug, `USD`, `one_time`, and 900 cents after the purchase link is activated. | `@claim:one-time-unlimited`; live checkout endpoint: HTTP 303. |
| F-1-5 | Added route-specific static crawl shells plus runtime canonical/Open Graph/Twitter updates for demo, app, legal, and 404 routes. | `every route updates canonical, Open Graph, and Twitter metadata`; live `/demo` has `Demo — Podcast Recall Loop` and its `/demo` canonical. |
| F-1-6 | Rewrote the preview heading to **Write your own recall question**. | Cold live home screenshot: [`screenshot-desktop.png`](evidence/polish-1/screenshot-desktop.png). |
| F-1-7 | Replaced visitor-facing RSS jargon with **podcast feed** / **feed address** and added the manual-entry helper. | `@claim:rss-lookup`; live `/app` cold check in [`live-browser-a11y.json`](evidence/polish-1/live-browser-a11y.json). |
| F-1-8 | Rewrote README storage language as “this browser”; IndexedDB is now limited to Developer notes. | README review and `@claim:browser-persistence`. |
| F-1-9 | Rewrote README feature language as “Install the app and review offline”. | `@claim:installable-pwa`; live offline evidence: [`live-offline.json`](evidence/polish-1/live-offline.json). |
| F-1-10 | Rewrote scheduling language to explain that the next review is based on the answer; added both-result coverage. | `@claim:review-results` and `@claim:spaced-schedule`. |
| F-1-11 | Renamed the disclosure control to **Restore a license**. | `@claim:license-restore`; live home screenshot. |
| F-1-12 | Added a local **Add a daily calendar reminder** download with a daily ICS rule and `/app` link. | `@claim:calendar-reminder` (fresh clone, desktop and mobile). |

## Earlier verification findings rechecked

| Earlier finding | Current evidence |
| --- | --- |
| Advertised checkout was a 404 | Production checkout is HTTP 303; `@claim:one-time-unlimited` and `@claim:sociobot-billing` pass. |
| Unit command failed | Fresh clone `npm run test:unit`: 9 passed. |
| Claims were incomplete | `claims.json` now has 24 entries; each appears exactly once as `@claim:<id>` and every declared command passed from the fresh clone. |
| Fictional episode links were dead | `demo has no dead fictional episode links` passes. |
| Factory footer hostname was invalid | `footer uses the valid canonical factory hostname` passes. |
| Static assets lacked immutable caching | Live fingerprinted JS returns `Cache-Control: public, max-age=31536000, immutable`. |
| Missing route returned 200 | Live `/missing-page` returns HTTP 404 and renders the styled recovery page. |
| Worker updates required a manual version | `@claim:build-coupled-updates` passes in Vitest. |

## Live evidence

- [`verify.json`](evidence/polish-1/verify.json): cold home URL check, no console errors, `lang=en`, one `h1`, main landmark, image alt coverage.
- [`live-browser-a11y.json`](evidence/polish-1/live-browser-a11y.json): mobile checks on all six routes; route metadata, zero overflow, and zero serious/critical Axe findings.
- [`live-offline.json`](evidence/polish-1/live-offline.json): controlling service worker, offline reload, offline notice, and recall action.
- [`lighthouse-mobile.json`](evidence/polish-1/lighthouse-mobile.json): 96 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.13 s, CLS 0.
