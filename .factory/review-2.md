# Adversarial first-read review 2 — Podcast Recall Loop

**Verdict: FAIL**

**Reviewed:** 29 August 2026  
**Repository candidate:** `65b513b2b92f1f211c85d7a276dd4d5f3cff3abe`  
**Live site:** <https://podcast-recall-loop.sociobot.in>

The cold first screen, demo, core recall flow, existing claim tests, offline behavior, accessibility baseline, and visual identity pass. There are no blocking findings. PASS still requires zero findings, and three minor findings remain: two public feed promises are not registered as claims, and Back navigation loses the prior scroll position.

## Findings

### Minor

#### F-2-1 — The explicit-action feed privacy promise is not a listed claim

- **Exact quotes/locations:** README: **“Feed URLs are requested only when the listener presses Find episodes.”**; live `/app`: **“The feed is requested only when you press Find episodes.”**; live `/privacy`: **“The app requests a feed address only after you choose Find episodes.”**
- **Registry gap:** `rss-lookup` claims only that a feed can fill podcast and episode fields. Its test enters a URL and presses **Find episodes**, but it does not assert that zero feed requests occur between entering the URL and pressing the button.
- **Observed behavior:** a live intercepted-feed check recorded zero requests before the click and exactly one after it. The behavior works, but the public privacy promise has no matching `claims.json` entry and tagged regression test.
- **Why this matters:** a listener may rely on the promise before pasting a private or unlisted feed address. The claims contract requires this assurance to be named and tested.
- **Concrete fix:** add `feed-explicit-request` to `.factory/claims.json`. Its test should fill a feed address, assert no request occurs before activation, press **Find episodes**, and assert exactly one request to that address. Use the clearer copy **“The app contacts the feed address only after you press Find episodes.”** on `/app`, `/privacy`, and in the README.

#### F-2-2 — Atom feed support is an unlisted claim

- **Exact quote/location:** README Developer notes: **“The feed parser reads RSS or Atom metadata only after the listener requests it.”**
- **Registry gap:** `.factory/claims.json` and `@claim:rss-lookup` name and exercise RSS only. No claim or test mentions Atom.
- **Observed behavior:** a live intercepted Atom fixture filled **Atom Learning** and **An Atom episode**, so this is a coverage/registry defect rather than a broken feature.
- **Why this matters:** a developer or listener can reasonably rely on the documented Atom support, but no declared test protects it.
- **Concrete fix:** either add an `atom-lookup` claim with an Atom fixture that asserts podcast, episode, and link fields, or remove Atom from the sentence. If retained, rewrite it as **“The app reads RSS and Atom feeds only after you press Find episodes.”** and cover the timing through F-2-1.

#### F-2-3 — Back navigation loses the prior scroll position

- **Exact location:** `src/app.ts:250-252` pushes routes and scrolls new pages to the top; `src/app.ts:282` handles `popstate` with `render()` but stores and restores no scroll position.
- **Observed live:** at 390×844, scroll `/` to `scrollY=1200`, open **Privacy**, then press Back. The browser returns to `/` and focuses **“Remember what your podcasts taught you”**, but `scrollY` is `0`, not `1200`.
- **Why this matters:** a phone visitor returning from Privacy or Terms loses their place on the long landing page. This violates the required back/forward scroll restoration even though the route and heading focus are correct.
- **Concrete fix:** store `scrollY` in the current history entry before `pushState`, then restore it after rendering on `popstate`. Add a Playwright test that starts at a non-zero scroll position, navigates away, goes Back, and asserts both the restored position and intended focus.

## Cold first screen

Fresh Chromium contexts were used at 390×844 and 1440×900. Nothing was scrolled before recording the answers.

| Question | First-read answer | Exact evidence | Result |
| --- | --- | --- | --- |
| What does this do? | It saves podcast moments as questions and brings back three for recall. | **“Remember what your podcasts taught you”**, **“Try it with sample data”**, and the three product facts. | Pass |
| For whom? | Curious podcast listeners who save ideas but forget them. | **“For curious listeners who save good moments but forget the ideas.”** | Pass |
| What should I click first? | **Try it with sample data.** | The primary action and **“Loads five podcast clips. No setup.”** are visible without scrolling at both widths. | Pass |

The mobile first screen also shows all three required facts before the fold. It has no horizontal overflow and no console errors.

## Copy audit

Counting method: visible or accessible copy units are counted once; repeated navigation labels are not duplicated. Hyphenated terms, prices, file paths, and URLs count as one word. Code blocks are commands rather than prose. No item exceeds 22 words, and no banned marketing adjective appears.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Podcast Recall Loop | 3 | Pass |
| Recall / Demo / Privacy / Terms | 1 each | Pass; destination links |
| Podcast recall for long listens | 5 | Pass; names the use case |
| Remember what your podcasts taught you | 6 | Pass; job headline |
| For curious listeners who save good moments but forget the ideas. | 11 | Pass |
| Try it with sample data | 5 | Pass; required demo action |
| Loads five podcast clips. | 4 | Pass; `demo-seed-reset` |
| No setup. | 2 | Pass; `no-account` |
| Add a podcast feed | 4 | Pass; result-naming action |
| Notes stay in this browser. | 5 | Pass; `browser-persistence`, `local-privacy` |
| Reviews work offline after your first visit. | 7 | Pass; `offline-reload` |
| The free library holds eight clips. | 6 | Pass; `free-limit` |
| Three porcelain pieces arranged in a quiet recall loop. | 9 | Pass; image alt text |
| Save. / Ask. / Recall. | 1 each | Pass; three-step figure caption |
| Today’s recall | 2 | Pass |
| Write your own recall question | 5 | Pass |
| You write the question while the idea is fresh. | 9 | Pass; `manual-authorship` |
| The recall queue brings it back later. | 7 | Pass; `spaced-schedule` |
| 12:34 · Why retrieval beats rereading | 5 | Pass; sample label |
| Why does retrieving an idea strengthen memory? | 7 | Pass; sample question |
| Reveal your takeaway when you have answered. | 7 | Pass |
| How it works | 3 | Pass |
| Choose a moment | 3 | Pass |
| Add a podcast feed and pick the episode. | 8 | Pass; `rss-lookup` |
| Add the timestamp yourself. | 4 | Pass |
| Write one question | 3 | Pass |
| Record the takeaway in your own words. | 7 | Pass; `manual-authorship` |
| No transcript is needed. | 4 | Pass; `metadata-only` |
| Recall three ideas | 3 | Pass |
| Answer from memory. | 3 | Pass |
| Your next review is based on your answer. | 8 | Pass; `review-results` |
| What the app stores | 4 | Pass |
| Your audio stays where it is | 6 | Pass |
| The app reads podcast titles from the feed address you request. | 11 | Pass; `rss-lookup` |
| It stores written notes, not audio. | 6 | Pass; `metadata-only` |
| You write every question and takeaway. | 6 | Pass; `manual-authorship` |
| You do not need an account. | 6 | Pass; `no-account` |
| Unlimited clip license | 3 | Pass |
| Unlimited clips for $9 once | 5 | Pass; `one-time-unlimited` |
| The one-time license removes only the clip limit. | 8 | Pass; `existing-license` |
| Reviews and exports stay free. | 5 | Pass; `free-reviews-exports` |
| Buy unlimited — $9 once | 4 | Pass; result-naming action |
| Restore a license | 3 | Pass; result-naming disclosure |
| License token | 2 | Pass |
| Verify license | 2 | Pass; result-naming action |
| Paste the token from your purchase email. | 7 | Pass |
| Sociobot handles checkout. | 3 | Pass; `sociobot-billing` |
| Three podcast ideas, recalled daily. | 5 | Pass |
| Built by Param Factory (opens in a new tab) | 9 | Pass |
| Version 1.0.2 · Generated art disclosed in the design notes. | 9 | Pass |
| Save a podcast timestamp, write your own question, and recall three ideas each day. | 14 | Pass; meta description |
| Your notes stay in this browser. | 6 | Pass; meta description |
| Turn podcast moments into three daily recall questions. | 8 | Pass; social description |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Podcast Recall Loop | 3 | Pass |
| Turn podcast moments into three daily recall questions. | 8 | Pass |
| Podcast Recall Loop is for self-learners who want recall without a larger note system. | 14 | Pass |
| Add a podcast feed, choose an episode, mark a timestamp, and write one question. | 14 | Pass |
| The daily queue presents no more than three due questions. | 10 | Pass; `daily-three` |
| The app stores written notes in this browser. | 8 | Pass; `browser-persistence` |
| It stores no audio. | 4 | Pass; `metadata-only` |
| The demo at `/demo` uses separate browser storage and never reads or writes your notes or license. | 17 | Pass; `demo-isolation` |
| What v1 includes | 3 | Pass |
| Fill podcast and episode details from a feed, or enter them yourself | 12 | Pass; `rss-lookup`, `manual-authorship` |
| Learner-written questions and takeaways tied to timestamps | 7 | Pass; `manual-authorship` |
| Up to three due questions, with the next review based on your answer | 13 | Pass; `daily-three`, `review-results` |
| Markdown, CSV, and JSON backup exports | 6 | Pass; export claims |
| JSON backup import | 3 | Pass; `json-backup` |
| Install the app and review offline after your first visit | 10 | Pass; `installable-pwa`, `offline-reload` |
| A daily calendar reminder download for the recall queue | 9 | Pass; `calendar-reminder` |
| A free eight-clip library | 4 | Pass; `free-limit` |
| A $9 one-time license for unlimited clips through Sociobot checkout | 10 | Pass; `one-time-unlimited`, `sociobot-billing` |
| Try the isolated demo | 4 | Pass |
| Open `http://localhost:4173/demo` after starting the app. | 6 | Pass |
| It contains five sample clips from fictional educational shows. | 9 | Pass; `demo-seed-reset` |
| Use Reset demo to restore them. | 6 | Pass; `demo-seed-reset` |
| Start for real discards demo changes and opens the separate, empty library. | 12 | Pass; `demo-isolation` |
| Develop | 1 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass; contributor prerequisite verified by the clean install |
| Vite serves the development site at `http://localhost:4173`. | 7 | Pass; contributor instruction |
| Test and build | 3 | Pass |
| The Playwright suite checks every claim, offline reload, keyboard use, mobile width, route structure, and serious accessibility findings. | 18 | Pass; 74-test suite verified |
| Vitest covers data and release configuration. | 6 | Pass; 9-test suite verified |
| The production command writes `index.html` and fingerprinted static assets to `dist/`. | 11 | Pass; build verified |
| The production build also stamps the service worker from those asset fingerprints. | 12 | Pass; release test verified |
| Installed copies therefore receive every new app build without a manual cache-version edit. | 13 | Pass; `build-coupled-updates` |
| Run one claim with its command from `.factory/claims.json`. | 8 | Pass |
| Deploy | 1 | Pass |
| Deploy the contents of `dist/` as a static site. | 9 | Pass; deployment instruction |
| `staticwebapp.config.json` provides SPA fallback and security headers for Azure Static Web Apps. | 12 | Pass; release configuration verified |
| The factory owns DNS and deployment. | 6 | Pass; scope statement |
| Privacy | 1 | Pass |
| The privacy policy is at `/privacy`; terms are at `/terms`. | 10 | Pass |
| Feed URLs are requested only when the listener presses Find episodes. | 11 | **F-2-1** |
| Saved note flows send no note data or tracking requests to another origin. | 13 | Pass; `local-privacy` plus demo-isolation request log |
| One-time license | 2 | Pass |
| The free library holds eight clips. | 6 | Pass; `free-limit` |
| A $9 one-time license removes that limit. | 7 | Pass; `one-time-unlimited` |
| Sociobot handles checkout. | 3 | Pass; `sociobot-billing` |
| Buyers can paste their license on the home page to restore it on another device. | 15 | Pass; `license-restore` |
| Developer notes | 2 | Pass |
| The browser storage implementation uses IndexedDB. | 6 | Pass; implementation note |
| The feed parser reads RSS or Atom metadata only after the listener requests it. | 14 | **F-2-1, F-2-2** |
| Project notes | 2 | Pass |
| `.factory/design.md` records the visual system and generated-art provenance. | 8 | Pass |
| `.factory/demo.md` documents demo isolation. | 4 | Pass |
| `.factory/claims.json` maps claims to executable tests. | 6 | Pass |
| `.factory/handoff.md` records final verification. | 4 | Pass |
| Licensed under the MIT License. | 5 | Pass |

## Demo and sandbox behavior

- One click on **Try it with sample data** opened `/demo` and immediately showed the product in use: five saved clips, three due questions, a realistic show/timestamp/question, and **Reveal my takeaway**.
- The persistent banner says **“Demo — sample data, nothing is saved to your notes.”** and exposes **Reset demo** and **Start for real**.
- Answering reduced the due count from three to two. **Reset demo** restored five clips and three due questions and announced the reset.
- A seeded real note and both real license keys remained byte-for-byte unchanged through demo entry, review, reset, exit, and `/demo?license=demo-url-token`. The demo never displayed the real unlimited state.
- **Start for real** removed demo changes, returned to the real library, and preserved the seeded real note. Returning to `/demo` recreated the original five clips and three due questions.
- The live request log recorded no request outside `podcast-recall-loop.sociobot.in` during demo navigation, review, reset, exit, or offline reload.
- After service-worker control, a live offline reload retained the due question and **Reveal my takeaway** and displayed **“Offline. Your saved clips and review queue still work.”**

## Claims execution

The supplied checkout was clean at the candidate commit before review artifacts were added. After `npm ci`, every declared command was run separately. Browser claims passed in desktop Chromium and the 390px mobile project.

| Claim id | Declared command | Result |
| --- | --- | --- |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — 2 tests |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS — 2 tests |
| `demo-seed-reset` | `npm test -- --grep @claim:demo-seed-reset` | PASS — 2 tests |
| `rss-lookup` | `npm test -- --grep @claim:rss-lookup` | PASS — 2 tests; scope gaps are F-2-1/F-2-2 |
| `daily-three` | `npm test -- --grep @claim:daily-three` | PASS — 2 tests |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS — 2 tests |
| `markdown-export` | `npm test -- --grep @claim:markdown-export` | PASS — 2 tests |
| `free-limit` | `npm test -- --grep @claim:free-limit` | PASS — 2 tests |
| `free-reviews-exports` | `npm test -- --grep @claim:free-reviews-exports` | PASS — 2 tests |
| `local-privacy` | `npm test -- --grep @claim:local-privacy` | PASS — 2 tests |
| `no-account` | `npm test -- --grep @claim:no-account` | PASS — 2 tests |
| `browser-persistence` | `npm test -- --grep @claim:browser-persistence` | PASS — 2 tests |
| `metadata-only` | `npm test -- --grep @claim:metadata-only` | PASS — 2 tests |
| `manual-authorship` | `npm test -- --grep @claim:manual-authorship` | PASS — 2 tests |
| `json-backup` | `npm test -- --grep @claim:json-backup` | PASS — 2 tests |
| `spaced-schedule` | `npm test -- --grep @claim:spaced-schedule` | PASS — 2 tests |
| `review-results` | `npm test -- --grep @claim:review-results` | PASS — 2 tests |
| `calendar-reminder` | `npm test -- --grep @claim:calendar-reminder` | PASS — 2 tests |
| `installable-pwa` | `npm test -- --grep @claim:installable-pwa` | PASS — 2 tests |
| `existing-license` | `npm test -- --grep @claim:existing-license` | PASS — 2 tests |
| `one-time-unlimited` | `npm test -- --grep @claim:one-time-unlimited` | PASS — 2 tests |
| `license-restore` | `npm test -- --grep @claim:license-restore` | PASS — 2 tests |
| `build-coupled-updates` | `npm run test:unit -- -t @claim:build-coupled-updates` | PASS — 1 test |
| `sociobot-billing` | `npm test -- --grep @claim:sociobot-billing` | PASS — 2 tests |

Each registered claim tag occurs exactly once in the test sources. No registered claim failed. F-2-1 and F-2-2 are unlisted claims, so the release still has untested public promises.

Additional gates: exact `npm test` passed 74 tests; `npm run test:unit` passed 9 tests; `npm run build` produced `dist/`; built JavaScript is 27.67 KB raw / 9.69 KB gzip. The live hosted checkout showed **Podcast Recall Loop Unlimited**, **$9.00**, and **One-time license** without completing a purchase.

## History recheck

Every finding in `.factory/review-1.md`, the disposition in `.factory/polish-1.md`, and the current handoff was checked against both live behavior and current code.

| Earlier finding | Current evidence | Status |
| --- | --- | --- |
| F-1-1 — demo read/wrote real license storage | Live seeded note/license comparison stayed unchanged; `/demo?license=` ignored the token; `startsInDemo` gates license functions at `src/app.ts:298-305`. | Fixed |
| F-1-2 — leaving demo retained changes | `src/app.ts:272` resets before entering `/app`; returning live restored five clips and three due. | Fixed |
| F-1-3 — demo/reset claims unlisted | `demo-seed-reset` exists and its desktop/mobile tests pass. | Fixed |
| F-1-4 — $9 amount not tested | The fixture asserts slug, USD, one-time billing, and 900 cents; live checkout showed $9.00 one-time. | Fixed |
| F-1-5 — deep-route social metadata stayed on home values | Static responses and runtime metadata are route-specific for `/app`, `/demo`, `/privacy`, `/terms`, and 404. | Fixed |
| F-1-6 — unclear preview heading | Live heading is **“Write your own recall question.”** | Fixed |
| F-1-7 — unexplained RSS first-step jargon | Visitor copy says **podcast feed/feed address** and provides manual-entry help. RSS remains only in Developer notes. | Fixed |
| F-1-8 — IndexedDB in README introduction | Introduction says **“this browser”**; IndexedDB appears only in Developer notes. | Fixed |
| F-1-9 — PWA jargon in feature copy | README says **“Install the app and review offline after your first visit.”** | Fixed |
| F-1-10 — vague scheduling copy/test | Landing explains the next review is based on the answer; both result paths pass `review-results`. | Fixed |
| F-1-11 — non-result license control | Live control says **“Restore a license.”** | Fixed |
| F-1-12 — no reminder | The recurring calendar download exists and `calendar-reminder` passes. | Fixed |

The previous handoff's no-gap statement is superseded by F-2-1 through F-2-3.

## Structure, links, identity, and accessibility

| Check | Result |
| --- | --- |
| Titles | Pass: home uses **“Podcast Recall Loop — Remember podcast ideas”**; every deep route uses its own plain title. |
| One `h1`, landmarks, heading order | Pass on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the designed 404 at both widths. |
| Metadata/assets | Pass: descriptions, canonical, OG/Twitter fields, SVG favicon, 180×180 touch icon, 1200×630 product art, theme color, manifest, robots, and sitemap are present. Static deep-route HTML also carries the correct titles. |
| 404 | Pass: unknown paths return HTTP 404 with product styling, one `h1`, consistent header/footer, and **Return home**. The browser's failed-document 404 console line is the expected navigation status, not an application error. |
| Deep links and focus | Pass: direct routes load; link navigation and Back move focus to the destination `h1`. Scroll restoration fails F-2-3. |
| Links | Pass: all navigational and fragment targets resolve; the checkout returns 303 to a live hosted page; the factory link returns 200. The 404 page's same-document skip fragment naturally retains its 404 document status. |
| Header/footer | Pass: consistent wordmark, three-link navigation, skip link, Privacy, Terms, factory attribution, product line, and version. |
| Accessibility | Pass apart from F-2-3's navigation expectation: live Axe checks found zero serious/critical findings on six routes at mobile and desktop widths; `/opt/fleet/lib/verify-url.sh` found no console or structural errors; tests cover keyboard use, 44px targets, dark contrast, reduced motion, labels, and mobile overflow. |
| Visual identity | Pass: glacial ceramic colors, asymmetric porcelain surfaces, original still-life art, serif/sans pairing, timestamp marks, and restrained set-down motion are recognizable and not a generic SaaS template. Provenance is recorded in `.factory/design.md` and asset sidecars. |

## Missed leverage and AI check

No additional product feature is an obvious omission from the brief. The product has feed/manual capture, daily recall, a recurring calendar reminder, CSV/Markdown export, complete JSON import/export, and local persistence. Sync would change the local-first privacy model rather than complete the stated v1. AI-generated questions would undermine the brief's learner-written retrieval practice, so an AI feature is not warranted. No provider key, Azure endpoint, Sociobot model call, or decorative AI feature appears in runtime code.

## What would make this perfect

Resolve F-2-1 through F-2-3: register and test the explicit-action feed request promise, register and test Atom support or remove that word, and restore scroll position on Back/Forward with a regression test. Then rerun all 24 claim commands and the full cold mobile/desktop checklist. No other change is identified.
