# Polish round 4 — cumulative finding disposition

**Repair commits:** `71836131dbe35dfe7a60125b2e5b0ba5fffa33a7`, `97cf4e4113df9d751da307e84bf9505db44ccce1`  
**Production:** <https://podcast-recall-loop.sociobot.in>  
**Deployment:** Static Web Apps `0e29b1df-e333-4519-868c-d6a3fa4c691d`, 29 August 2026 UTC

Every finding in reviews 1–4 and every prior polish report was reread, rechecked in the repair, and checked again on production. All 26 declared claim commands passed independently from a fresh clone.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Demo mode remains selected before licensing and never uses real notes or license keys. | `@claim:demo-isolation`; live demo in `evidence/polish-4/live-demo/screenshot-mobile.png`; no external request in `live-browser.json`. |
| F-1-2 | Every demo exit deletes the separate demo database before navigating. | `@claim:demo-isolation`; live `/?demo=1` reset path and banner in `live-demo/screenshot-mobile.png`. |
| F-1-3 | Five authored sample clips and Reset are declared claims; Reset now also proves the 1→2→3 queue sequence. | `@claim:demo-seed-reset`; live `daily-three-mobile.png`. |
| F-1-4 | The hosted checkout fixture verifies product, USD, one-time billing, and 900 cents. | `@claim:one-time-unlimited`; `@claim:sociobot-billing`. |
| F-1-5 | Route shells and runtime metadata retain route-specific title, description, canonical, Open Graph, and Twitter fields. | Live route check for `/`, `/demo`, `/app`, `/privacy`, `/terms`, and 404 in `live-browser.json`. |
| F-1-6 | The preview heading remains **Write your own recall question**. | `npm test`; cold home capture `live-home/screenshot-desktop.png`. |
| F-1-7 | Visitor language uses podcast feed and provides manual entry help. | `@claim:rss-lookup`; demo capture `live-demo/screenshot-mobile.png`. |
| F-1-8 | Reader-facing storage copy says **this browser**; IndexedDB remains developer documentation only. | `@claim:browser-persistence`; README and copy audit review. |
| F-1-9 | User-facing documentation says install and review offline, without unexplained PWA jargon. | `@claim:installable-pwa`; `@claim:offline-reload`. |
| F-1-10 | The answer-dependent next review remains explicit and both result paths are tested. | `@claim:review-results`; `@claim:spaced-schedule`. |
| F-1-11 | **Restore a license** names the action and its demo exit is guarded. | `@claim:license-restore`; `@claim:demo-isolation`. |
| F-1-12 | The recall page keeps the local recurring daily calendar download. | `@claim:calendar-reminder`. |
| F-2-1 | A feed request begins only after the visible **Find episodes** action. | `@claim:feed-explicit-request`. |
| F-2-2 | Atom parsing stays declared with exact podcast, episode, and link assertions. | `@claim:atom-lookup`. |
| F-2-3 | Back/Forward preserve scroll and focus the destination heading. | `Back restores the previous scroll position and focuses its page heading` in `npm test`. |
| F-3-1 | Every visible demo departure, including Restore and checkout, uses the disposal guard. | `@claim:demo-isolation`; live demo capture above. |
| F-4-1 | Added a persisted local-day queue snapshot with at most three IDs and completed IDs; it does not refill until the next local day. | `@claim:daily-three`; live five-overdue sequence in `live-browser.json`: 1/3 → caught up → caught up after reload. |
| F-4-2 | Progress comes from that daily queue, not historical review counts; fresh sample starts at **Question 1 of 3 today**. Deleting the first prompt now preserves 2/3 across reload. | `@claim:demo-seed-reset`; `live-demo/daily-three-mobile.png`; live `live-browser.json`. |
| F-4-3 | Broadened `local-privacy` to record requests through real-note save, reload, export, import, and delete. | `@claim:local-privacy`; fresh-clone request log asserts no external requests. |
| F-4-4 | README now says Start for real discards demo changes and opens the separate real library. | README review; `@claim:demo-isolation` preserves a seeded real note. |
| F-4-5 | Replaced the generic art caption with **Save a podcast moment. Write a question. Recall it later.** | Cold production home `live-home/screenshot-desktop.png`; exact live text in `live-browser.json`. |
| F-4-6 | Corrected the Node range, added `package.json#engines`, a regression test, and a minimum-version GitHub Actions matrix. | `npm run test:unit`; [successful Node 20.19/22.12 workflow](https://github.com/B-Divyesh/sf-podcast-recall-loop/actions/runs/33266434900). |

## Final production checks

- `/opt/fleet/lib/verify-url.sh` passed cold home and `?demo=1`: title, `lang=en`, one `h1`, one main landmark, complete image alt text, labeled controls, and zero console errors. See `evidence/polish-4/live-home/verify.json` and `live-demo/verify.json`.
- Live Axe checks found zero serious or critical findings on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the HTTP-404 route. See `evidence/polish-4/live-browser.json`.
- Live mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.08 s, CLS 0, TBT 26 ms. See `evidence/polish-4/lighthouse-mobile.json`.
- Production references `index-CSQkdIlP.js`, the same fingerprint as the deployed `dist/` build. Its live cache header is immutable; headers are in `evidence/polish-4/live-headers.txt`.
