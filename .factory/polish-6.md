# Polish round 6 — cumulative finding disposition

**Deployed product commit:** `3e18e76afe39204938f76fcceaf3be5729999577`  
**Production:** <https://podcast-recall-loop.sociobot.in>  
**Deployment:** Azure Static Web Apps `9c2bfe81-6353-4bc2-83f0-4e598c50e5ac`, 29 August 2026 UTC

Every finding in reviews 1–6 and every prior polish report was reread and rechecked against the deployed product. The structured cold-production results are in [live-browser.json](evidence/polish-6/live-browser.json). Screenshots show the [390 px first screen](evidence/polish-6/live-home-mobile.png), [desktop landing page](evidence/polish-6/live-home-desktop.png), [one-click demo](evidence/polish-6/live-demo-mobile.png), [recall app](evidence/polish-6/live-app-desktop.png), and [corrected privacy page](evidence/polish-6/live-privacy-desktop.png).

| Finding | Change made | Test, screenshot, and live URL evidence |
| --- | --- | --- |
| F-1-1 | Demo mode is selected before licensing and never reads, accepts, verifies, or writes real license state. | `@claim:demo-isolation`; [demo screenshot](evidence/polish-6/live-demo-mobile.png); live `/?demo=1&license=ignored-demo-token` kept real IndexedDB/localStorage byte-equal and made zero external requests. |
| F-1-2 | Every demo exit deletes the demo database before navigation. | `@claim:demo-isolation`; [demo banner/actions](evidence/polish-6/live-demo-mobile.png); live Restore and Start-for-real exits both returned to a pristine five-clip, three-question demo. |
| F-1-3 | Five fictional clips and Reset behavior remain registered and observable. | `@claim:demo-seed-reset`; [fresh demo](evidence/polish-6/live-demo-mobile.png); live `/demo` and Reset both showed five clips and Question 1 of 3. |
| F-1-4 | The checkout fixture proves product slug, USD, one-time billing, and 900 cents. | `@claim:one-time-unlimited`; [landing price](evidence/polish-6/live-home-mobile.png); live Sociobot checkout returned HTTP 303 with a destination. |
| F-1-5 | Static route shells and runtime navigation publish route-specific titles, descriptions, canonicals, Open Graph, and Twitter fields. | `every route updates canonical, Open Graph, and Twitter metadata`; [privacy route](evidence/polish-6/live-privacy-desktop.png); live `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/missing-page` passed metadata/status checks. |
| F-1-6 | The preview heading remains **Write your own recall question**. | `cold first screen names the job, audience, sample outcome, and three facts`; [desktop landing](evidence/polish-6/live-home-desktop.png); cold live `/` contained the explicit heading. |
| F-1-7 | Visitor copy uses **podcast feed** and explains manual entry. | `@claim:rss-lookup`; [demo form](evidence/polish-6/live-demo-mobile.png); live `/demo` showed the feed-address helper and manual fields. |
| F-1-8 | Reader copy says notes stay in this browser; IndexedDB remains developer-only wording. | `@claim:browser-persistence`; [first-screen facts](evidence/polish-6/live-home-mobile.png); cold live `/` showed the browser-storage fact. |
| F-1-9 | Visitor documentation describes installation and offline review without PWA jargon. | `@claim:installable-pwa` and `@claim:offline-reload`; [demo](evidence/polish-6/live-demo-mobile.png); live `/?demo=1` reloaded offline with the recall action present. |
| F-1-10 | Copy explains that the answer determines the next review; both result paths remain covered. | `@claim:review-results` and `@claim:spaced-schedule`; [recall UI](evidence/polish-6/live-app-desktop.png); live demo reached caught-up without refilling. |
| F-1-11 | **Restore a license** names the action and focuses the token field. | `@claim:license-restore`; [landing license panel](evidence/polish-6/live-home-mobile.png); live `/#restore-license` opened and focused the field. |
| F-1-12 | The recall page downloads a local recurring daily calendar reminder. | `@claim:calendar-reminder`; [recall app](evidence/polish-6/live-app-desktop.png); live `/app` exposed the download action. |
| F-2-1 | Feed requests begin only after **Find episodes**. | `@claim:feed-explicit-request`; [demo form](evidence/polish-6/live-demo-mobile.png); cold live home/demo activity made no external request. |
| F-2-2 | Atom support remains declared and asserts podcast, episode, and link fields. | `@claim:atom-lookup`; [demo form](evidence/polish-6/live-demo-mobile.png); live `/demo` retained the tested import workflow. |
| F-2-3 | Back/Forward preserve scroll and focus the destination heading. | `Back restores the previous scroll position and focuses its page heading`; [desktop landing](evidence/polish-6/live-home-desktop.png); live Back restored `scrollY=1200` and focused the home h1. |
| F-3-1 | The visible demo Restore link uses the same disposal guard as every other exit. | `@claim:demo-isolation`; [demo exits](evidence/polish-6/live-demo-mobile.png); the exact live Restore path reset the sample before return. |
| F-4-1 | The persisted local-day snapshot holds at most three clip IDs and does not refill that day. | `@claim:daily-three`; [demo queue](evidence/polish-6/live-demo-mobile.png); live production showed 1→2→3→caught up and remained caught up after reload. |
| F-4-2 | Progress comes from the daily snapshot, so a fresh demo starts at Question 1. | `@claim:demo-seed-reset`; [fresh demo](evidence/polish-6/live-demo-mobile.png); live `/?demo=1` showed **Question 1 of 3 today**. |
| F-4-3 | The privacy request log covers real save, reload, export, import, and delete flows. | `@claim:local-privacy`; [privacy page](evidence/polish-6/live-privacy-desktop.png); live cold home/demo request logs contained only the product origin. |
| F-4-4 | README says Start for real opens the separate real library, which may already contain notes. | `@claim:demo-isolation`; [Start for real](evidence/polish-6/live-demo-mobile.png); live Start preserved the seeded real note and discarded the sample changes. |
| F-4-5 | The art caption names the actual task: save a podcast moment, write a question, recall it later. | `cold first screen names the job, audience, sample outcome, and three facts`; [landing art/caption](evidence/polish-6/live-home-mobile.png); cold live `/` used the product-specific wording. |
| F-4-6 | README and package metadata state Node `^20.19.0 || >=22.12.0`; the release suite protects the range. | `documents the supported Node versions precisely`; [versioned landing](evidence/polish-6/live-home-desktop.png); live assets matched the Node-verified build byte-for-byte. |
| F-5-1 | The footer contains only the public build version and no inaccessible design-notes reference. | `every route shows the build version without referring to private design notes`; [footer](evidence/polish-6/live-home-mobile.png); all six live routes showed **Version 1.0.7** with no design-notes text. |
| F-6-1 | The privacy policy now names both stored licensing values. Added `license-storage`, which restores a fixture license and asserts the token and `{valid, checkedAt}` verdict are the only product license keys. | `@claim:license-storage`; [privacy screenshot](evidence/polish-6/live-privacy-desktop.png); live `/privacy` showed the corrected sentence and the verifier recorded exactly the two expected keys and verdict fields. |

## Acceptance evidence

- Fresh clone of `3e18e76`: all 28 declared claim commands passed independently in 272.4 seconds; see [clean-claims.json](evidence/polish-6/clean-claims.json).
- The same fresh clone passed `npm test` (88), `npm run test:unit` (16), `npm run build`, and `npm audit --audit-level=high`; see [clean-suite.json](evidence/polish-6/clean-suite.json).
- The claim setup now waits for the seeded demo transaction before mutating all five due dates. `@claim:daily-three --repeat-each=3` passed 6/6 before the final aggregate run.
- Both factory URL-verifier runs passed with no console errors. Playwright Axe found zero serious/critical findings on all public routes and the 404.
- Mobile Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP 1.06 s, CLS 0, TBT 79 ms. See [lighthouse-summary.json](evidence/polish-6/lighthouse-summary.json).
- Production JavaScript, CSS, and service-worker SHA-256 values match `dist/`; see [asset-hashes.txt](evidence/polish-6/asset-hashes.txt).

No finding of any severity remains open.
