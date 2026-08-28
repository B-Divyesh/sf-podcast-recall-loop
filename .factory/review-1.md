# Adversarial first-read review 1 — Podcast Recall Loop

**Verdict: FAIL**

**Reviewed:** 28 August 2026

**Repository candidate:** `d27feb9a4b68436bad8817aa361578498ded2830`

**Live site:** <https://podcast-recall-loop.sociobot.in>

The first screen, core recall flow, offline behavior, and visual identity are clear and functional. The release still fails the supplied contract: demo mode reads and can write the real license namespace, modified demo state survives leaving the demo, two demo promises are absent from the claims registry, and the `$9` claim test does not verify the amount charged at checkout. Eight additional minor findings remain. A PASS requires zero findings.

## Findings

### Blocking

#### F-1-1 — Demo mode reads and writes real license storage

- **Exact location:** `src/app.ts:79` calls `cachedUnlocked()` for both real and demo routes; `src/app.ts:266-272` accepts and verifies licenses before considering demo isolation; `src/license.ts:12-18` and `src/license.ts:33-45` use the shared `sb_license:podcast-recall-loop` keys.
- **Observed live:** after seeding a valid real license and visiting `/demo`, the demo displayed **“Unlimited clips active.”** While the demo banner was visible, opening `/demo?license=demo-url-token` wrote both `sb_license:podcast-recall-loop=demo-url-token` and its verdict to `localStorage`.
- **Why this fails:** the demo contract says real data is never read or written while the demo banner is shown. The current `demo-isolation` test covers only the note database, so it misses shared license state.
- **Concrete fix:** determine demo mode before license handling. In demo mode, do not accept, read, verify, or write real license keys and do not call the licensing gateway. Add a claim test that preloads a real library and license, exercises `/demo` including a `?license=` URL, and confirms both real IndexedDB and all real `localStorage` keys remain byte-for-byte unchanged with zero external requests.

#### F-1-2 — Leaving the demo does not discard demo changes

- **Exact quote/location:** demo banner action **“Start for real”** (`src/app.ts:29`); demo state is only deleted by **“Reset demo”** (`src/app.ts:240`).
- **Observed live:** mark one sample question remembered, click **Start for real**, then revisit `/demo`; the modified queue still reports two due questions rather than the original three.
- **Why this fails:** the supplied sandbox contract requires leaving demo mode to discard demo data or explicitly offer to keep it once. A returning evaluator does not get a clean sample.
- **Concrete fix:** clear/reseed the demo database when leaving `/demo`, or present a one-time **Keep these as my notes** choice and otherwise discard it. Add a test that changes the demo, leaves, returns, and finds the original five clips with three due.

#### F-1-3 — Demo seed and reset promises are unlisted claims

- **Exact quotes:** landing **“Loads five podcast clips. No setup.”**; README **“It contains five realistic sample clips.”** and **“Use Reset demo to restore them.”**
- **Why this fails:** `.factory/claims.json` has no entry claiming that the demo starts with five samples or that Reset restores them. `tests/quality.spec.ts:74-81` happens to check Reset, but the test is not claim-tagged or declared. The claims contract treats an unlisted user-reliance promise as untested.
- **Concrete fix:** add one `demo-seed-reset` claim, tag the existing test exactly once, enter through `/demo` in a fresh context, assert five authored clips and three due questions, change the sample, reset it, and assert the exact original records return. Rewrite **“realistic”** as the concrete **“five sample clips from fictional educational shows.”**

#### F-1-4 — The quantitative `$9` checkout claim is not tested

- **Exact claim:** `.factory/claims.json` says **“Unlimited clips cost $9 once through Sociobot checkout.”**
- **Exact test gap:** `tests/quality.spec.ts:102-116` verifies `$9` in the site's own heading/link, intercepts the gateway URL, and returns a fixture containing only **“Secure checkout.”** It never asserts the checkout product, currency, one-time billing mode, or `900`-cent amount.
- **Why this fails:** this test can pass while the hosted checkout charges a different amount or recurs. The supplied claims contract requires quantitative claims to measure the stated number in the sandbox.
- **Concrete fix:** make the recorded gateway/checkout fixture include product slug, `USD`, one-time billing, and amount `900`, and assert all four after activating the purchase action. If the sandbox cannot prove those values, remove `$9 once` from public copy and narrow the claim. The live checkout happened to show **Podcast Recall Loop Unlimited**, **$9.00**, and `one_time_price` during this review; that manual observation does not repair the automated contract.

### Minor

#### F-1-5 — Deep routes publish home-page Open Graph metadata

- **Exact location:** `index.html:10-17` fixes Open Graph/Twitter title, description, and URL to the home page; `src/app.ts:102-107` updates only `document.title` and the canonical URL.
- **Observed live:** `/demo`, `/app`, `/privacy`, `/terms`, and the 404 all retain `og:title="Podcast Recall Loop — Remember podcast ideas"` and `og:url="https://podcast-recall-loop.sociobot.in/"`.
- **Why this matters:** shared privacy, terms, demo, and missing-page URLs are represented as the home page.
- **Concrete fix:** publish route-specific static metadata or update every Open Graph/Twitter field per route and provide crawlable route shells. For example, `/demo` should use **“Demo — Podcast Recall Loop”** and its own canonical Open Graph URL.

#### F-1-6 — A landing heading is unclear out of context

- **Exact quote/location:** `<h2>` **“One question. Your words.”** (`src/app.ts:54`).
- **Why this matters:** in a screen-reader headings list, it does not name podcast recall or explain whether the user writes or answers the question.
- **Concrete rewrite:** **“Write your own recall question.”**

#### F-1-7 — “RSS feed” is unexplained first-step jargon

- **Exact quotes:** **“Start with your RSS feed”**, **“Paste an RSS feed and pick the episode”**, README **“Paste a podcast RSS feed”**, and **“RSS metadata lookup with a manual fallback.”**
- **Why this matters:** a normal podcast listener may know the show or episode but not where to obtain an RSS URL, so the real first action can stop at terminology.
- **Concrete rewrite:** use **“Add a podcast feed”** in visitor copy and add helper text: **“Paste the show’s feed address. If you do not have it, enter the podcast and episode below.”** In the README feature list, use **“Fill podcast and episode details from a feed, or enter them yourself.”**

#### F-1-8 — “IndexedDB” is unnecessary jargon in the README introduction

- **Exact quote:** **“The app stores written notes in IndexedDB.”**
- **Why this matters:** the reader needs the storage location and privacy consequence, not the browser API name.
- **Concrete rewrite:** **“The app stores written notes in this browser.”** Put `IndexedDB` only in a developer architecture note.

#### F-1-9 — “PWA” is unexplained in user-facing feature copy

- **Exact quote:** **“An installable PWA and offline review after the first visit.”**
- **Why this matters:** “PWA” describes implementation rather than the result.
- **Concrete rewrite:** **“Install the app and review offline after your first visit.”**

#### F-1-10 — “Simple spaced scheduling” is vague jargon

- **Exact quotes:** README **“A three-question due queue with simple spaced scheduling.”** and landing **“The next date changes with your result.”**
- **Why this matters:** it does not say how the schedule responds to the listener.
- **Concrete rewrite:** **“Up to three due questions, with the next review based on your answer.”** Add a claim test for both **I remembered** and **Review sooner** if this broader behavior remains public.

#### F-1-11 — The license disclosure control does not name its result

- **Exact quote/location:** interactive `<summary>` **“Have a license?”** (`src/app.ts:59`).
- **Why this matters:** it asks a question instead of saying what activating the control will do.
- **Concrete rewrite:** **“Restore a license.”**

#### F-1-12 — The daily loop has no way to prompt a return

- **Exact scope:** the brief promises **“a three-question daily recall queue”**; the product has no reminder, calendar export, or notification setting.
- **Why this matters:** a learner must remember to revisit a product whose job is helping them remember. This leaves the loop passive.
- **Concrete feature:** add an optional **Add a daily calendar reminder** action that downloads a recurring `.ics` event pointing to `/app`. Keep it local and permission-free; no AI is needed. List and test the export claim.

## Cold first screen

Fresh Chromium contexts were used at 390×844 and 1440×900 before scrolling.

| Question | First-read answer | Evidence | Result |
| --- | --- | --- | --- |
| What does this do? | Turns saved podcast moments into self-written recall questions and a daily review queue. | **“Remember what your podcasts taught you”** and the three short steps. | Pass |
| For whom? | Curious podcast listeners who save useful moments but forget the ideas. | **“For curious listeners who save good moments but forget the ideas.”** | Pass |
| What should I click first? | **Try it with sample data.** | The primary action is visible without scrolling and says **“Loads five podcast clips. No setup.”** | Pass |

At both widths the first screen also showed the three required facts: notes stay in the browser, reviews work offline after the first visit, and the free library holds eight clips. The mobile first screen had no horizontal overflow. No blocking first-read finding was recorded.

## Copy audit

Counting method: visible sentences and standalone copy units are counted; hyphenated terms, prices, versions, and URLs count as one word. Repeated navigation labels are listed once. Code commands are not prose. No item exceeds 22 words, and no banned marketing term appears.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Podcast Recall Loop | 3 | Pass |
| Recall / Demo / Privacy / Terms | 1 each | Pass; destination links |
| A small loop for long listens | 6 | Pass |
| Remember what your podcasts taught you | 6 | Pass |
| For curious listeners who save good moments but forget the ideas. | 11 | Pass |
| Try it with sample data | 5 | Pass |
| Loads five podcast clips. | 4 | F-1-3 |
| No setup. | 2 | Covered by the no-account demo path |
| Start with your RSS feed | 5 | F-1-7 |
| Notes stay in this browser. | 5 | Pass; `browser-persistence` / `local-privacy` |
| Reviews work offline after your first visit. | 7 | Pass; `offline-reload` |
| The free library holds eight clips. | 6 | Pass; `free-limit` |
| Three porcelain pieces arranged in a quiet recall loop. | 9 | Pass; image alt text |
| Capture. / Ask. / Recall. | 1 each | Pass |
| Today’s recall | 2 | Pass |
| One question. / Your words. | 2 each | F-1-6 |
| You write the question while the idea is fresh. | 9 | Pass; `manual-authorship` |
| The loop brings it back later. | 6 | Pass; `spaced-schedule` |
| 12:34 · Why retrieval beats rereading | 5 | Pass; sample label |
| Why does retrieving an idea strengthen memory? | 7 | Pass; sample question |
| Reveal your takeaway when you have answered. | 7 | Pass |
| How it works | 3 | Pass |
| Choose a moment | 3 | Pass |
| Paste an RSS feed and pick the episode. | 8 | F-1-7 |
| Add the timestamp yourself. | 4 | Pass |
| Write one question | 3 | Pass |
| Record the takeaway in your own words. | 7 | Pass |
| No transcript is needed. | 4 | Pass; `metadata-only` |
| Recall three ideas | 3 | Pass |
| Answer from memory. | 3 | Pass |
| The next date changes with your result. | 7 | F-1-10 (test only covers one result) |
| Small on purpose | 3 | Pass |
| Your audio stays where it is | 6 | Pass |
| The app reads podcast titles from the RSS feed you request. | 11 | F-1-7; function covered by `rss-lookup` |
| It stores written notes, not audio. | 6 | Pass; `metadata-only` |
| You write every question and takeaway. | 6 | Pass; `manual-authorship` |
| You do not need an account. | 6 | Pass; `no-account` |
| Keep going when eight is not enough | 7 | Pass |
| Unlimited clips for $9 once | 5 | F-1-4 |
| The one-time license removes only the clip limit. | 8 | Pass; `existing-license` |
| Reviews and exports stay free. | 5 | Pass; `free-reviews-exports` |
| Buy unlimited — $9 once | 5 | F-1-4 |
| Have a license? | 3 | F-1-11 |
| License token | 2 | Pass; form label |
| Verify license | 2 | Pass; result-naming verb |
| Paste the token from your purchase email. | 7 | Pass |
| Sociobot handles checkout. | 3 | Pass; `sociobot-billing` |
| Three podcast ideas, recalled daily. | 5 | Pass |
| Built by Param Factory (opens in a new tab) | 9 | Pass |
| Version 1.0.2 · Generated art disclosed in the design notes. | 9 | Pass |
| Save a podcast timestamp, write your own question, and recall three ideas each day. | 14 | Pass; meta description |
| Your notes stay in this browser. | 6 | Pass; meta description |
| Turn podcast moments into three daily recall questions. | 8 | Pass; Open Graph description |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Podcast Recall Loop | 3 | Pass |
| Turn podcast moments into three daily recall questions. | 8 | Pass |
| Podcast Recall Loop is for self-learners who want recall without a larger note system. | 14 | Pass |
| Paste a podcast RSS feed, choose an episode, mark a timestamp, and write one question. | 15 | F-1-7 |
| The daily queue presents no more than three due questions. | 10 | Pass; `daily-three` |
| The app stores written notes in IndexedDB. | 7 | F-1-8 |
| It stores no audio. | 4 | Pass; `metadata-only` |
| The demo at `/demo` uses a separate database and never enters the real note library. | 15 | Listed note claim passes, but broader isolation fails F-1-1 |
| What v1 includes | 3 | Pass |
| RSS metadata lookup with a manual fallback | 7 | F-1-7 |
| Learner-written questions and takeaways tied to timestamps | 7 | Pass; `manual-authorship` |
| A three-question due queue with simple spaced scheduling | 8 | F-1-10 |
| Markdown, CSV, and JSON backup exports | 6 | Pass; export claims |
| JSON backup import | 3 | Pass; `json-backup` |
| An installable PWA and offline review after the first visit | 10 | F-1-9 |
| A free eight-clip library | 4 | Pass; `free-limit` |
| A $9 one-time license for unlimited clips through Sociobot checkout | 10 | F-1-4 |
| Try the isolated demo | 4 | Pass |
| Open `http://localhost:4173/demo` after starting the app. | 6 | Pass |
| It contains five realistic sample clips. | 6 | F-1-3 |
| Use Reset demo to restore them. | 6 | F-1-3 |
| Use Start for real to open the separate, empty library. | 10 | Pass; note isolation confirmed |
| Develop | 1 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass; precise developer prerequisite |
| Vite serves the development site at `http://localhost:4173`. | 7 | Pass; developer context |
| Test and build | 3 | Pass |
| The Playwright suite checks every claim, offline reload, keyboard use, mobile width, route structure, and serious accessibility findings. | 18 | Fails in full because F-1-3 and F-1-4 are not adequately claimed/tested |
| Vitest covers data and release configuration. | 6 | Pass |
| The production command writes `index.html` and fingerprinted static assets to `dist/`. | 11 | Pass; developer context |
| The production build also stamps the service worker from those asset fingerprints. | 12 | Pass; developer context |
| Installed copies therefore receive every new app build without a manual cache-version edit. | 13 | Pass; `build-coupled-updates` |
| Run one claim with its command from `.factory/claims.json`. | 8 | Pass |
| Deploy | 1 | Pass |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| `staticwebapp.config.json` provides SPA fallback and security headers for Azure Static Web Apps. | 12 | Pass; deployment context |
| The factory owns DNS and deployment. | 6 | Pass |
| Privacy | 1 | Pass |
| The privacy policy is at `/privacy`; terms are at `/terms`. | 10 | Pass |
| RSS URLs are requested only when the listener presses Find episodes. | 11 | Pass; `rss-lookup` / request-log check |
| Saved note flows send no note data or tracking requests to another origin. | 13 | Pass for the declared clean demo flow; `local-privacy` |
| One-time license | 2 | Pass |
| The free library holds eight clips. | 6 | Pass; `free-limit` |
| A $9 one-time license removes that limit. | 7 | F-1-4 |
| Sociobot handles checkout. | 3 | Pass; `sociobot-billing` |
| Buyers can paste their license on the home page to restore it on another device. | 15 | Pass; `license-restore` |
| Project notes | 2 | Pass |
| `.factory/design.md` records the visual system and generated-art provenance. | 8 | Pass |
| `.factory/demo.md` documents demo isolation. | 4 | Pass as documentation; implementation fails F-1-1/F-1-2 |
| `.factory/claims.json` maps claims to executable tests. | 6 | Pass, with the coverage gaps in F-1-3/F-1-4 |
| `.factory/handoff.md` records final verification. | 4 | Pass |
| Licensed under the MIT License. | 5 | Pass |

Technical terms such as service worker, fingerprinted assets, and SPA are retained only in contributor/deployment sections, where they name exact implementation concepts. All visitor-facing interactive labels use result-naming verbs except F-1-11; navigation links use destination names.

## Demo and sandbox evidence

- One click from the landing action opened `/demo`.
- The first settled demo screen showed the banner **“Demo — sample data, nothing is saved to your notes”**, five saved clips, three due questions, a realistic prompt, and **Reveal my takeaway**.
- Reveal and **I remembered** reduced the due count from three to two.
- **Reset demo** restored five clips and three due questions and announced **“Demo reset to five sample clips.”**
- **Start for real** opened a separate empty real library; the demo question was absent.
- The live request log for reveal, answer, service-worker activation, and offline reload contained only the product origin. Offline reload retained a Reveal action and displayed the offline notice.
- Failures F-1-1 and F-1-2 remain despite note-database isolation.

## Claims execution

Every command was run independently and in declaration order from a clean local clone after `npm ci`. Browser commands ran in desktop Chromium and the 390×844 mobile project.

| Claim id | Declared command | Result |
| --- | --- | --- |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — 2 tests |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS — 2 tests; scope is notes only |
| `rss-lookup` | `npm test -- --grep @claim:rss-lookup` | PASS — 2 tests |
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
| `installable-pwa` | `npm test -- --grep @claim:installable-pwa` | PASS — 2 tests |
| `existing-license` | `npm test -- --grep @claim:existing-license` | PASS — 2 tests |
| `one-time-unlimited` | `npm test -- --grep @claim:one-time-unlimited` | Command passes — 2 tests; assertion gap F-1-4 |
| `license-restore` | `npm test -- --grep @claim:license-restore` | PASS — 2 tests |
| `build-coupled-updates` | `npm run test:unit -- -t @claim:build-coupled-updates` | PASS — 1 test |
| `sociobot-billing` | `npm test -- --grep @claim:sociobot-billing` | PASS — 2 tests |

Additional clean-clone gates: `npm run test:unit` passed 9 tests; `npm test` passed 68 tests; `npm run build` produced `dist/`; `npm audit --audit-level=high` found zero vulnerabilities. The built JavaScript is 25.77 KB raw / 9.18 KB gzip.

Live checks also confirmed a CORS-enabled RSS feed populated 50 episodes, a manually saved question survived reload, and the checkout redirected through Sociobot to a hosted one-time $9.00 product page. These observations do not replace the missing automated coverage.

## History recheck

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The repository contains prior verification reports and a handoff; every previously recorded defect was rechecked on the live site and in current code.

| Earlier finding | Current evidence | Status |
| --- | --- | --- |
| Checkout returned 404 / paid feature unavailable | Sociobot endpoint returns 303; hosted checkout returns 200 and shows the correct product and $9.00 one-time price. | Fixed; automated amount gap is new F-1-4 |
| `npm run test:unit` failed | 9 tests pass in the clean clone. | Fixed |
| Public claims lacked entries | Prior no-account, free review/export, licensing, metadata, persistence, import, and update claims now have entries. Refund language is absent. | Fixed for earlier quotes; new demo claims are F-1-3 |
| Fictional episode links were dead | Sample `episodeUrl` values are empty; no **Open episode** links render in the demo. | Fixed |
| Footer used TLS-invalid `www.sociobot.in` | Footer uses `https://sociobot.in/`, which returns 200. | Fixed |
| Static assets lacked immutable caching | Fingerprinted assets have immutable policy in configuration and the release test passes. | Fixed |
| Unknown routes returned HTTP 200 | `/missing-page` returns HTTP 404 and renders the designed recovery screen. | Fixed |
| PWA updates relied on manual cache versioning | `build-coupled-updates` test passes and worker output changes with fingerprinted shell assets. | Fixed |
| Handoff noted RSS CORS limitations | Manual entry remains available; a live Simplecast feed returned 50 episodes in this review. | Confirmed, not regressed |

No earlier finding is being repeated under its old wording.

## Structure, links, identity, and accessibility

| Check | Result |
| --- | --- |
| Route titles | Pass in the browser: home, Demo, Recall queue, Privacy, Terms, and Page not found use the required patterns. |
| One `h1`, `main`, `lang=en` | Pass on every real route and the 404 at mobile and desktop widths. |
| Meta description, canonical, OG/Twitter, favicon | Base metadata, canonical, 1200×630 OG image, SVG favicon, and 180px touch icon exist; route-specific OG/Twitter fails F-1-5. |
| Designed 404 | Pass: HTTP 404, product styling, one `h1`, and **Return home**. The browser logs the expected failed-document 404 message. |
| Deep links, history, focus | Pass: direct routes load; link navigation and Back move focus to the route `h1` and restore the title. |
| Link crawl | Pass: `/`, `/app`, `/demo`, `/privacy`, `/terms`, and `https://sociobot.in/` return 200; checkout returns the expected redirect to a live 200 page. No sample episode links render. |
| Header/footer | Pass: consistent wordmark/navigation, skip link, Privacy, Terms, factory link, version, and product line. |
| Accessibility | Pass: Playwright Axe found zero serious/critical issues on six routes at both widths; reduced motion, 44px controls, focus, alt text, and no horizontal overflow pass. `/opt/fleet/lib/verify-url.sh` also passed. |
| Visual identity | Pass: the glacial ceramic palette, asymmetric porcelain cards, original still-life, serif/sans pairing, and restrained set-down motion are recognizable and not a generic SaaS hero/card system. |

## Missed leverage and AI check

F-1-12 records the one obvious missing loop-closing feature: an optional local calendar reminder. The product already provides CSV, Markdown, and complete JSON import/export. Sync would contradict its local-first position unless made explicit and optional. AI is not needed for learner-written questions and would weaken the retrieval practice premise; no runtime model key, Azure endpoint, or decorative AI feature is embedded. Generated hero art has provenance in `.factory/design.md` and `assets/src/recall-ceramics.json`.

## What would make this perfect

Resolve F-1-1 through F-1-12, then rerun every claim command from a fresh clone and repeat the full live mobile/desktop review. In particular, demo mode must be completely isolated from real notes and license state, leaving it must restore a pristine sample, every public demo/price promise must have an adequate tagged test, route shares must carry correct metadata, and the remaining copy must use concrete listener language. At that point there should be no finding left to waive.
