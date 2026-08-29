# Adversarial first-read review 4 — Podcast Recall Loop

**Verdict: FAIL**

**Reviewed:** 29 August 2026 UTC

**Candidate:** `c595b908e26a1f1c0ebbe8ea1030cf92d58147b9`

**Live URL:** <https://podcast-recall-loop.sociobot.in>

The cold landing screen is clear, the demo is isolated, all 26 declared claim commands pass, and the deployed JavaScript and CSS match the candidate build. The product still fails its central job: when more than three clips are overdue, completing three immediately presents a fourth. The first demo prompt also says **“Question 3 of up to 3 today”** before the visitor has answered anything. Four smaller copy and claim-coverage defects remain. PASS requires zero findings.

## Findings

### Blocking

#### F-4-1 — The “three questions daily” queue continues past three

- **Exact claims:** landing **“Recall three ideas”**; README **“The daily queue presents no more than three due questions.”**; `.factory/claims.json` **“The daily recall queue presents no more than three due questions.”**
- **Exact code/test gap:** `src/data.ts:53-55` slices the currently overdue list to three on every render. It does not freeze a three-item daily queue. `tests/claims.spec.ts:131-138` starts with exactly three due samples, so it cannot test overflow.
- **Observed live:** in a fresh `/demo` context, make all five shipped clips overdue and reload. The badge begins at three. After completing three distinct questions, the page is not caught up; it shows a fourth question, **“What makes a boundary example useful in an explanation?”**, with two overdue clips remaining.
- **Why this blocks:** the brief’s core product is a three-question daily recall queue. The implementation limits only the displayed backlog, not the number a listener is asked to complete. The registered central claim passes only because its fixture contains no fourth due item.
- **Concrete fix:** create a dated daily queue snapshot containing at most three clip IDs and persist its completion count. Do not replenish it until the next local day. Change `@claim:daily-three` to seed at least five overdue clips, complete three, assert **You are caught up for today**, reload, and confirm the remaining overdue clips are deferred until the next day.

#### F-4-2 — The one-click demo starts on “Question 3”

- **Exact quote/location:** the first live `/demo` screen says **“Question 3 of up to 3 today”**. `src/app.ts:116` calculates the position from every clip whose lifetime `reviewCount` is above zero.
- **Observed live:** a fresh context opened the landing action in one click. Before any answer, the demo showed question 3. The label remained question 3 for subsequent prompts. See [`review-4-demo-mobile.png`](evidence/review-4-demo-mobile.png).
- **Why this blocks:** the required demo must immediately show the product being used with coherent sample data. A first-time visitor is told they are already on the last question, even though they have completed none. It also conceals F-4-1 by never exposing honest daily progress.
- **Concrete fix:** derive the position from the persisted daily queue, not historical review counts. A fresh demo must show **Question 1 of 3 today**, then 2 and 3, then the caught-up state. Extend `demo-seed-reset` to assert the exact sequence before and after Reset.

### Minor

#### F-4-3 — The broad saved-note privacy promise has only a narrow demo test

- **Exact quote:** README: **“Saved note flows send no note data or tracking requests to another origin.”** Privacy page: **“Your clips, questions, takeaways, and review dates stay in this browser. We do not receive them.”**
- **Registry gap:** `local-privacy` claims and tests only the demo’s reveal-and-answer path. It does not exercise saving, deleting, importing, exporting, or reloading real notes.
- **Why this matters:** the public promise covers every saved-note flow, while the tagged request log covers two demo actions. Code inspection suggests the broader behavior is correct, but the claim contract requires observable coverage.
- **Concrete fix:** register the broader sentence and record requests while a fresh `/app` context saves, reloads, exports, imports, and deletes a note. Assert that no note or tracking request leaves the product origin. Keep the narrower sentence if broader coverage is not intended.

#### F-4-4 — README promises an empty real library when it may contain notes

- **Exact quote/location:** `README.md:23`: **“Start for real opens the separate, empty library.”**
- **Observed live/code:** the isolation flow deliberately preserves an existing real note and **Start for real** opens it. The demo test also seeds and expects that real note.
- **Why this matters:** returning users are told their real library will be empty, contradicting the product’s correct isolation behavior.
- **Concrete rewrite:** **“Start for real discards demo changes and opens your separate real library.”**

#### F-4-5 — “Save. Ask. Recall.” is a generic slogan

- **Exact quote/location:** landing art caption at `src/app.ts:101`: **“Save. Ask. Recall.”**
- **Why this matters:** “Ask” does not say that the listener writes the question, and the line could describe many unrelated flashcard products. It is the only landing copy unit that fails the no-slogan rule.
- **Concrete rewrite:** **“Save a podcast moment. Write a question. Recall it later.”**

#### F-4-6 — The stated Node requirement is inaccurate and untested

- **Exact quote/location:** `README.md:27`: **“Requires Node.js 20 or newer.”**
- **Evidence:** Vite 7.3.6 declares `^20.19.0 || >=22.12.0`; Node 20.0–20.18 and Node 21 do not meet that range. The clean run used Node 22.23.2, so it does not prove the README sentence.
- **Why this matters:** a contributor following the documented prerequisite can select an unsupported runtime.
- **Concrete rewrite/test:** say **“Requires Node.js 20.19+ or 22.12+.”** Add the same range to `package.json#engines` and verify the lowest supported version in CI.

## Cold first screen

Fresh Chromium contexts opened the production home page at 390×844 and 1440×900. Nothing was scrolled before recording these answers.

| Question | First-read answer | Exact evidence | Result |
| --- | --- | --- | --- |
| What does this do? | It turns podcast moments into questions that return for daily recall. | **“Remember what your podcasts taught you”** | Pass |
| For whom? | Podcast listeners who save useful moments but forget their ideas. | **“For curious listeners who save good moments but forget the ideas.”** | Pass |
| What should I click first? | **Try it with sample data.** | The adjacent text says **“Opens five sample clips from fictional shows. No setup.”** | Pass |

At 390 px, the headline ended at 288 px, the primary action at 452 px, and all three facts at 701 px within the 844 px viewport. At desktop width, the facts ended at 808 px within the 900 px viewport. Both pages had zero horizontal overflow and zero console errors. Captures: [`review-4-home-mobile.png`](evidence/review-4-home-mobile.png) and [`review-4-home-desktop.png`](evidence/review-4-home-desktop.png).

## Copy audit

Counting method: visible or accessible copy units are counted once; hyphenated terms, prices, versions, paths, and URLs count as one word. Commands are not prose. No unit exceeds 22 words and no banned marketing adjective appears. Flags are shown inline.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Podcast Recall Loop | 3 | Pass |
| Recall / Demo / Privacy / Terms | 1 each | Pass; destination links |
| Podcast recall for long listens | 5 | Pass |
| Remember what your podcasts taught you | 6 | Pass |
| For curious listeners who save good moments but forget the ideas. | 11 | Pass |
| Try it with sample data | 5 | Pass; result-naming action |
| Opens five sample clips from fictional shows. | 7 | Pass; `demo-seed-reset` |
| No setup. | 2 | Pass; one-click path |
| Add a podcast feed | 4 | Pass; verb-led real action |
| Notes stay in this browser. | 5 | Pass; storage claims |
| Reviews work offline after your first visit. | 7 | Pass; `offline-reload` |
| The free library holds eight clips. | 6 | Pass; `free-limit` |
| Three porcelain pieces arranged in a quiet recall loop. | 9 | Pass; image alternative |
| Save. / Ask. / Recall. | 1 each | **F-4-5** |
| Today’s recall | 2 | Pass |
| Write your own recall question | 5 | Pass |
| You write the question while the idea is fresh. | 9 | Pass; `manual-authorship` |
| The recall queue brings it back later. | 7 | Pass; `spaced-schedule` |
| 12:34 · Why retrieval beats rereading | 5 | Pass; sample context |
| Why does retrieving an idea strengthen memory? | 7 | Pass; sample question |
| Reveal your takeaway when you have answered. | 7 | Pass |
| How it works | 3 | Pass |
| Choose a moment | 3 | Pass |
| Add a podcast feed and pick the episode. | 8 | Pass; `rss-lookup` |
| Add the timestamp yourself. | 4 | Pass |
| Write one question | 3 | Pass |
| Record the takeaway in your own words. | 7 | Pass; `manual-authorship` |
| No transcript is needed. | 4 | Pass; `metadata-only` |
| Recall three ideas | 3 | **F-4-1**; product does not stop after three |
| Answer from memory. | 3 | Pass |
| Your next review is based on your answer. | 8 | Pass; `review-results` |
| What the app stores | 4 | Pass |
| Your audio stays where it is | 6 | Pass; names the privacy outcome |
| The app reads podcast titles from the feed address you request. | 11 | Pass; feed claims |
| It stores written notes, not audio. | 6 | Pass; `metadata-only` |
| You write every question and takeaway. | 6 | Pass; `manual-authorship` |
| You do not need an account. | 6 | Pass; `no-account` |
| Unlimited clip license | 3 | Pass |
| Unlimited clips for $9 once | 5 | Pass; `one-time-unlimited` |
| The one-time license removes only the clip limit. | 8 | Pass; license claims |
| Reviews and exports stay free. | 5 | Pass; export claims |
| Buy unlimited — $9 once | 4 | Pass; result-naming action |
| Restore a license | 3 | Pass; result-naming action |
| License token | 2 | Pass |
| Verify license | 2 | Pass; result-naming action |
| Paste the token from your purchase email. | 7 | Pass |
| Sociobot handles checkout. | 3 | Pass; `sociobot-billing` |
| Three podcast ideas, recalled daily. | 5 | **F-4-1** |
| Built by Param Factory (opens in a new tab) | 9 | Pass |
| Version 1.0.4 · Generated art disclosed in the design notes. | 9 | Pass |
| Save a podcast timestamp, write your own question, and recall three ideas each day. | 14 | **F-4-1**; meta description |
| Your notes stay in this browser. | 6 | Pass; meta description |
| Turn podcast moments into three daily recall questions. | 8 | **F-4-1**; social description |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Podcast Recall Loop | 3 | Pass |
| Turn podcast moments into three daily recall questions. | 8 | **F-4-1** |
| Podcast Recall Loop is for self-learners who want recall without a larger note system. | 14 | Pass |
| Add a podcast feed, choose an episode, mark a timestamp, and write one question. | 14 | Pass |
| The daily queue presents no more than three due questions. | 10 | **F-4-1** |
| The app stores written notes in this browser. | 8 | Pass; storage claims |
| It stores no audio. | 4 | Pass; `metadata-only` |
| The demo at `?demo=1` uses separate browser storage and never reads or writes your notes or license. | 17 | Pass; `demo-isolation` |
| Every exit discards sample changes. | 5 | Pass; `demo-isolation` |
| What v1 includes | 3 | Pass |
| Fill podcast and episode details from a feed, or enter them yourself | 12 | Pass; `rss-lookup` |
| Learner-written questions and takeaways tied to timestamps | 7 | Pass; `manual-authorship` |
| Up to three due questions, with the next review based on your answer | 13 | **F-4-1** |
| Markdown, CSV, and JSON backup exports | 6 | Pass; export claims |
| JSON backup import | 3 | Pass; `json-backup` |
| Install the app and review offline after your first visit | 10 | Pass; install/offline claims |
| A daily calendar reminder download for the recall queue | 9 | Pass; `calendar-reminder` |
| A free eight-clip library | 4 | Pass; `free-limit` |
| A $9 one-time license for unlimited clips through Sociobot checkout | 10 | Pass; billing claims |
| Try the isolated demo | 4 | Pass |
| Open `http://localhost:4173/?demo=1` after starting the app. | 6 | Pass |
| It contains five sample clips from fictional educational shows. | 9 | Pass; `demo-seed-reset` |
| Use Reset demo to restore them. | 6 | Pass; `demo-seed-reset` |
| Every link that leaves the demo discards its changes. | 9 | Pass; `demo-isolation` |
| Start for real opens the separate, empty library. | 8 | **F-4-4** |
| Develop | 1 | Pass |
| Requires Node.js 20 or newer. | 5 | **F-4-6** |
| Vite serves the development site at `http://localhost:4173`. | 7 | Pass; verified |
| Test and build | 3 | Pass |
| The Playwright suite checks every claim, offline reload, keyboard use, mobile width, route structure, and serious accessibility findings. | 18 | **F-4-1, F-4-3**; current coverage is incomplete |
| Vitest covers data and release configuration. | 6 | Pass |
| The production command writes `index.html` and fingerprinted static assets to `dist/`. | 11 | Pass; build verified |
| The production build also stamps the service worker from those asset fingerprints. | 12 | Pass; release test verified |
| Installed copies therefore receive every new app build without a manual cache-version edit. | 13 | Pass; `build-coupled-updates` |
| Run one claim with its command from `.factory/claims.json`. | 8 | Pass |
| Deploy | 1 | Pass |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| `staticwebapp.config.json` provides SPA fallback and security headers for Azure Static Web Apps. | 12 | Pass; release configuration verified |
| The factory owns DNS and deployment. | 6 | Pass; scope statement |
| Privacy | 1 | Pass |
| The privacy policy is at `/privacy`; terms are at `/terms`. | 10 | Pass |
| The app contacts the feed address only after you press Find episodes. | 12 | Pass; `feed-explicit-request` |
| Saved note flows send no note data or tracking requests to another origin. | 13 | **F-4-3** |
| One-time license | 2 | Pass |
| The free library holds eight clips. | 6 | Pass; `free-limit` |
| A $9 one-time license removes that limit. | 7 | Pass; `one-time-unlimited` |
| Sociobot handles checkout. | 3 | Pass; `sociobot-billing` |
| Buyers can paste their license on the home page to restore it on another device. | 15 | Pass; `license-restore` |
| Developer notes | 2 | Pass |
| The browser storage implementation uses IndexedDB. | 6 | Pass; developer context |
| The app reads RSS and Atom feeds only after you press Find episodes. | 11 | Pass; feed claims |
| Project notes | 2 | Pass |
| `.factory/design.md` records the visual system and generated-art provenance. | 8 | Pass |
| `.factory/demo.md` documents demo isolation. | 4 | Pass |
| `.factory/claims.json` maps claims to executable tests. | 6 | Pass as documentation; coverage gaps are findings |
| `.factory/handoff.md` records final verification. | 4 | Pass |
| Licensed under the MIT License. | 5 | Pass |

Technical terms such as IndexedDB, RSS, Atom, service worker, fingerprinted assets, and SPA appear only in contributor/deployment sections where they name implementation concepts. Visitor-facing controls otherwise use consistent terms and result-naming verbs.

## Demo and sandbox behavior

- One click on **Try it with sample data** opened the app with five authored clips, three due questions, a prompt, and **Reveal my takeaway**.
- The persistent banner says **“Demo — sample data, nothing is saved to your notes.”** It includes **Reset demo** and **Start for real**.
- A normal answer changed three due questions to two. Reset restored five clips and three due questions.
- A seeded real license and real note remained unchanged through `/?demo=1&license=ignored-token`, review, Reset, a Privacy exit, and **Start for real**. No request left the product origin during the demo recall flow.
- A Privacy exit discarded changed demo state; returning showed the original five clips and three due questions. The declared test also covers Restore, checkout, and Start exits.
- After service-worker control, an offline reload retained the demo, offline notice, and **Reveal my takeaway**.
- The sandbox is nevertheless weak because its first prompt is misnumbered (**F-4-2**) and it does not expose the five-overdue case that falsifies the daily limit (**F-4-1**).

## Claims execution

Every declared command was run independently, in registry order, from a clean local clone of `c595b90` after `npm ci`. Browser commands ran in desktop Chromium and the configured 390 px mobile project.

| Claim | Result | Time |
| --- | --- | ---: |
| `offline-reload` | PASS — 2 tests | 8.9 s |
| `demo-isolation` | PASS — 2 tests | 18.1 s |
| `demo-seed-reset` | PASS — 2 tests | 9.9 s |
| `rss-lookup` | PASS — 2 tests | 8.9 s |
| `feed-explicit-request` | PASS — 2 tests | 9.1 s |
| `atom-lookup` | PASS — 2 tests | 8.9 s |
| `daily-three` | Command passes — 2 tests; false-positive fixture is **F-4-1** | 10.9 s |
| `csv-export` | PASS — 2 tests | 8.1 s |
| `markdown-export` | PASS — 2 tests | 8.0 s |
| `free-limit` | PASS — 2 tests | 12.6 s |
| `free-reviews-exports` | PASS — 2 tests | 11.6 s |
| `local-privacy` | Command passes — 2 tests; scope gap is **F-4-3** | 9.3 s |
| `no-account` | PASS — 2 tests | 9.2 s |
| `browser-persistence` | PASS — 2 tests | 9.3 s |
| `metadata-only` | PASS — 2 tests | 8.0 s |
| `manual-authorship` | PASS — 2 tests | 9.8 s |
| `json-backup` | PASS — 2 tests | 8.2 s |
| `spaced-schedule` | PASS — 2 tests | 8.9 s |
| `review-results` | PASS — 2 tests | 9.9 s |
| `calendar-reminder` | PASS — 2 tests | 8.0 s |
| `installable-pwa` | PASS — 2 tests | 8.2 s |
| `existing-license` | PASS — 2 tests | 16.4 s |
| `one-time-unlimited` | PASS — 2 tests | 8.1 s |
| `license-restore` | PASS — 2 tests | 8.3 s |
| `build-coupled-updates` | PASS — 1 test | 1.4 s |
| `sociobot-billing` | PASS — 2 tests | 8.3 s |

The independent five-overdue browser check fails the observable `daily-three` promise even though its declared command passes. Additional clean-clone gates: `npm test` passed 80 tests; `npm run test:unit` passed 10; `npm run build` produced `dist/`. Built JavaScript is 28.78 KB raw and 10.04 KB gzip.

## Earlier findings rechecked

Every earlier review, polish report, and current handoff was read. Each prior finding was checked in current code and on the live deployment rather than accepted from its disposition label.

| Earlier finding | Current evidence | Status |
| --- | --- | --- |
| F-1-1 — demo read/wrote real license storage | Live seeded storage remained byte-equal; demo entry ignores `license=` and made no external request. | Fixed |
| F-1-2 — leaving demo retained changes | Privacy exit passed live; Restore, checkout, and Start exits pass `demo-isolation`; generalized link guard is present. | Fixed |
| F-1-3 — demo/reset promises unlisted | `demo-seed-reset` is registered and passes. | Fixed |
| F-1-4 — $9 amount untested | Fixture asserts slug, USD, one-time billing, and 900 cents; live checkout resolves. | Fixed |
| F-1-5 — deep routes retained home social metadata | All six checked routes have route-specific title, description, canonical, OG title, and OG URL. | Fixed |
| F-1-6 — unclear preview heading | Live heading is **Write your own recall question**. | Fixed |
| F-1-7 — RSS jargon blocked the first step | Visitor copy says podcast feed/address and explains manual entry. | Fixed |
| F-1-8 — IndexedDB in the README introduction | Browser wording is used in the introduction; IndexedDB is developer-only. | Fixed |
| F-1-9 — PWA jargon in feature copy | README describes installation and offline review in user terms. | Fixed |
| F-1-10 — vague answer-dependent schedule | Both answer paths pass and the copy names the result. F-4-1 is a separate daily-cap defect. | Fixed |
| F-1-11 — non-result license control | **Restore a license** names its result. | Fixed |
| F-1-12 — no daily reminder | Daily `.ics` download exists and passes its claim test. | Fixed |
| F-2-1 — feed request timing unlisted | `feed-explicit-request` records zero requests before activation and one after. | Fixed |
| F-2-2 — Atom support unlisted | `atom-lookup` asserts the podcast, episode, and link fields. | Fixed |
| F-2-3 — Back lost scroll position | Live Back restored 1200 px to 1200 px and focused the home `h1`. | Fixed |
| F-3-1 — Restore link retained demo changes | The visible link uses guarded navigation; the exact regression path passes. | Fixed |

No earlier finding is reopened under the same ID. F-4-1 and F-4-2 expose a separate queue/progress defect that prior rounds did not exercise.

## Structure, links, accessibility, and identity

| Check | Result |
| --- | --- |
| Titles and route metadata | Pass: `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the 404 use route-specific plain titles, descriptions, canonicals, OG/Twitter values, one `h1`, and one `main`. |
| Metadata assets | Pass: `lang=en`, SVG favicon, 180×180 touch icon, 1200×630 product OG art, manifest, robots, sitemap, and matching theme color. |
| Designed 404 | Pass: `/missing-page` returns HTTP 404 with product styling and **Return home**. |
| Deep links, Back, focus | Pass: direct routes load; navigation and Back focus the destination `h1`; Back restored the recorded 1200 px scroll position. |
| Link crawl | Pass: every discovered internal link and the factory link resolved; checkout returned a live 200 destination. The designed missing route correctly remained 404. |
| Header/footer | Pass: consistent wordmark, three-link navigation, skip link, Privacy, Terms, product one-line description, factory attribution, and version. |
| Accessibility | Pass apart from the misleading progress semantics in F-4-2: final live Axe runs found zero serious/critical issues; the URL verifier reported no errors; focus, touch targets, reduced motion, labels, alt text, and mobile width pass locally. |
| Security/performance basics | Pass: required security headers are live; fingerprinted assets are immutable; JavaScript is 10.04 KB gzip; the live JS/CSS SHA-256 hashes exactly match the clean candidate build. |
| Visual identity | Pass: the glacial palette, asymmetric porcelain surfaces, original still-life, serif prompt face, timestamp marks, and restrained motion match `.factory/design.md` and do not resemble a generic SaaS template. |

## Missed leverage and AI check

No additional feature is an obvious omission beyond repairing the promised daily limit. The product already provides feed/manual capture, local persistence, CSV/Markdown/JSON export, JSON import, offline review, and a daily calendar reminder. Optional sync would change the stated local-only privacy model. AI-written questions would undermine the brief’s learner-written retrieval step, so no AI feature is warranted. Runtime code contains no provider key, Azure endpoint, Sociobot model call, or decorative AI feature.

## What would make this perfect

Implement a real dated three-item daily queue and honest 1→2→3 progress, then seed the claim test with at least five overdue clips. Expand the saved-note request-log test, correct the two README statements, and replace the generic art caption. Rerun every claim command and the full live mobile/desktop checklist. Nothing else should remain open.
