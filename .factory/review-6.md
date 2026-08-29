# Adversarial first-read review 6 — Podcast Recall Loop

**Verdict: FAIL**

**Reviewed:** 29 August 2026 UTC  
**Candidate:** `385bfe6899a57cf055baf2aeaa63d9225c8dc945`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>

The functional review passed, but PASS requires zero findings. One privacy
statement is both inaccurate and not registered as a claim.

## Findings

### Minor

#### F-6-1 — Privacy policy says the app stores only a license token

- **Exact quote/location:** `/privacy`, **Payment** section: “This app stores
  only your license token in this browser.”
- **Observed:** the deployed application also stores
  `sb_license:podcast-recall-loop:verdict`, a local object containing the
  cached `valid` result and `checkedAt` timestamp. This is required for the
  documented once-per-day license check (`src/license.ts`).
- **Why this matters:** a privacy policy must name the data it retains
  accurately. The claim is also absent from `.factory/claims.json`; the
  existing `existing-license` entry proves daily checking, but not the stated
  storage boundary.
- **Concrete fix:** rewrite the sentence as **“This app stores your license
  token and its daily verification result in this browser.”** Add a
  `license-storage` claim whose clean-context test restores a fixture license
  and asserts the token and the `{ valid, checkedAt }` verdict are the only
  `sb_license:podcast-recall-loop*` values written. Alternatively, remove the
  storage-detail sentence.

## Cold first screen

Fresh empty Chromium contexts opened the live home page at 390×844 and
1440×900. Screenshots were taken before scrolling.

| First-read question | Answer from the first screen | Result |
| --- | --- | --- |
| What does it do? | It turns a saved podcast moment into a question to recall later. **“Remember what your podcasts taught you”** and the preview make that clear. | Pass |
| For whom? | Listeners who save useful podcast moments but forget their ideas. **“For curious listeners who save good moments but forget the ideas.”** | Pass |
| What should I click first? | **“Try it with sample data”**; its adjacent outcome says it opens five fictional sample clips with no setup. | Pass |

At 390px the action, outcome, and three plain facts are above the hero image;
there is no horizontal overflow. The visual system is recognisably specific to
this product: glacial palette, asymmetric porcelain surfaces, Georgia prompt
type, timestamp marks, and original ceramic-loop still life. It is not a
generic SaaS template.

## Copy audit

Counts treat hyphenated terms, prices, labels, and slash-separated navigation
as one word. No landing or README sentence exceeds 22 words. No banned
marketing adjective, unexplained visitor-facing RSS/PWA/IndexedDB jargon,
non-result action, mood-only heading, or inconsistent core term was found.
F-6-1 is the only copy finding.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass — destination |
| Podcast Recall Loop | 3 | Pass — wordmark |
| Recall / Demo / Privacy | 1 each | Pass — destinations |
| Podcast recall for long listens | 5 | Pass — use-case label |
| Remember what your podcasts taught you | 6 | Pass — verb-first job headline |
| For curious listeners who save good moments but forget the ideas. | 11 | Pass — audience and change |
| Try it with sample data | 5 | Pass — result-naming action |
| Opens five sample clips from fictional shows. | 7 | Pass — `demo-seed-reset` |
| No setup. | 2 | Pass — demo/no-account path |
| Add a podcast feed | 4 | Pass — real first step |
| Notes stay in this browser. | 5 | Pass — `browser-persistence`, `local-privacy` |
| Reviews work offline after your first visit. | 7 | Pass — `offline-reload` |
| The free library holds eight clips. | 6 | Pass — `free-limit` |
| Three porcelain pieces arranged in a quiet recall loop. | 9 | Pass — image alt text |
| Save a podcast moment. | 4 | Pass — workflow caption |
| Write a question. | 3 | Pass — workflow caption |
| Recall it later. | 3 | Pass — workflow caption |
| Today’s recall | 2 | Pass — section label |
| Write your own recall question | 6 | Pass — product-specific heading |
| You write the question while the idea is fresh. | 9 | Pass — `manual-authorship` |
| The recall queue brings it back later. | 7 | Pass — `spaced-schedule` |
| 12:34 · Why retrieval beats rereading | 5 | Pass — sample label |
| Why does retrieving an idea strengthen memory? | 7 | Pass — sample question |
| Reveal your takeaway when you have answered. | 7 | Pass — useful instruction |
| How it works | 3 | Pass — section heading |
| Choose a moment | 3 | Pass — step heading |
| Add a podcast feed and pick the episode. | 8 | Pass — `rss-lookup` |
| Add the timestamp yourself. | 4 | Pass — usable instruction |
| Write one question | 3 | Pass — step heading |
| Record the takeaway in your own words. | 7 | Pass — `manual-authorship` |
| No transcript is needed. | 4 | Pass — `metadata-only` |
| Recall three ideas | 3 | Pass — step heading |
| Answer from memory. | 3 | Pass — usable instruction |
| Your next review is based on your answer. | 8 | Pass — `review-results` |
| What the app stores | 4 | Pass — section heading |
| Your audio stays where it is | 6 | Pass — followed by storage boundary |
| The app reads podcast titles from the feed address you request. | 11 | Pass — feed request claims |
| It stores written notes, not audio. | 6 | Pass — `metadata-only` |
| You write every question and takeaway. | 6 | Pass — `manual-authorship` |
| You do not need an account. | 6 | Pass — `no-account` |
| Unlimited clip license | 3 | Pass — section heading |
| Unlimited clips for $9 once | 5 | Pass — `one-time-unlimited` |
| The one-time license removes only the clip limit. | 8 | Pass — `existing-license` |
| Reviews and exports stay free. | 5 | Pass — `free-reviews-exports` |
| Buy unlimited — $9 once | 5 | Pass — result-naming action |
| Restore a license | 3 | Pass — result-naming action |
| License token | 2 | Pass — label |
| Verify license | 2 | Pass — result-naming action |
| Paste the token from your purchase email. | 7 | Pass — useful instruction |
| Sociobot handles checkout. | 3 | Pass — `sociobot-billing` |
| Three podcast ideas, recalled daily. | 5 | Pass — `daily-three` |
| Privacy / Terms | 1 each | Pass — destinations |
| Built by Param Factory (opens in a new tab) | 9 | Pass — external-link disclosure |
| Version 1.0.6 | 2 | Pass — build id |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Podcast Recall Loop | 3 | Pass — title |
| Turn podcast moments into three daily recall questions. | 8 | Pass — `daily-three` |
| Podcast Recall Loop is for self-learners who want recall without a larger note system. | 14 | Pass — audience |
| Add a podcast feed, choose an episode, mark a timestamp, and write one question. | 14 | Pass — workflow |
| The daily queue presents no more than three due questions. | 10 | Pass — `daily-three` |
| The app stores written notes in this browser. | 8 | Pass — local-storage claims |
| It stores no audio. | 4 | Pass — `metadata-only` |
| The demo at `?demo=1` uses separate browser storage and never reads or writes your notes or license. | 17 | Pass — `demo-isolation` |
| Every exit discards sample changes. | 5 | Pass — `demo-isolation` |
| What v1 includes | 3 | Pass — heading |
| Fill podcast and episode details from a feed, or enter them yourself | 12 | Pass — `rss-lookup` |
| Learner-written questions and takeaways tied to timestamps | 7 | Pass — `manual-authorship` |
| Up to three due questions, with the next review based on your answer | 13 | Pass — queue claims |
| Markdown, CSV, and JSON backup exports | 6 | Pass — export claims |
| JSON backup import that rejects invalid files without changing saved clips | 11 | Pass — backup claims |
| Install the app and review offline after your first visit | 10 | Pass — `installable-pwa`, `offline-reload` |
| A daily calendar reminder download for the recall queue | 9 | Pass — `calendar-reminder` |
| A free eight-clip library | 4 | Pass — `free-limit` |
| A $9 one-time license for unlimited clips through Sociobot checkout | 10 | Pass — billing claims |
| Try the isolated demo | 4 | Pass — heading |
| Open `http://localhost:4173/?demo=1` after starting the app. | 6 | Pass — instruction |
| It contains five sample clips from fictional educational shows. | 9 | Pass — `demo-seed-reset` |
| Use Reset demo to restore them. | 6 | Pass — `demo-seed-reset` |
| Every link that leaves the demo discards its changes. | 9 | Pass — `demo-isolation` |
| Start for real discards demo changes and opens your separate real library. | 12 | Pass — `demo-isolation` |
| Develop | 1 | Pass — heading |
| Requires Node.js 20.19+ or 22.12+. | 6 | Pass — release configuration |
| Vite serves the development site at `http://localhost:4173`. | 7 | Pass — developer instruction |
| Test and build | 3 | Pass — heading |
| The Playwright suite checks every claim, offline reload, keyboard use, mobile width, route structure, and serious accessibility findings. | 18 | Pass — rerun |
| Vitest covers data and release configuration. | 6 | Pass — rerun |
| The production command writes `index.html` and fingerprinted static assets to `dist/`. | 11 | Pass — build verified |
| The production build also stamps the service worker from those asset fingerprints. | 12 | Pass — release test |
| Installed copies therefore receive every new app build without a manual cache-version edit. | 13 | Pass — `build-coupled-updates` |
| Run one claim with its command from `.factory/claims.json`. | 8 | Pass — instruction |
| Deploy | 1 | Pass — heading |
| Deploy the contents of `dist/` as a static site. | 9 | Pass — instruction |
| `staticwebapp.config.json` provides SPA fallback and security headers for Azure Static Web Apps. | 12 | Pass — developer instruction |
| The factory owns DNS and deployment. | 6 | Pass — scope statement |
| Privacy | 1 | Pass — heading |
| The privacy policy is at `/privacy`; terms are at `/terms`. | 10 | Pass — route information |
| The app contacts the feed address only after you press Find episodes. | 12 | Pass — `feed-explicit-request` |
| Saved note flows send no note data or tracking requests to another origin. | 13 | Pass — `local-privacy` |
| One-time license | 2 | Pass — heading |
| The free library holds eight clips. | 6 | Pass — `free-limit` |
| A $9 one-time license removes that limit. | 7 | Pass — `one-time-unlimited` |
| Sociobot handles checkout. | 3 | Pass — `sociobot-billing` |
| Buyers can paste their license on the home page to restore it on another device. | 15 | Pass — `license-restore` |
| Developer notes | 2 | Pass — heading |
| The browser storage implementation uses IndexedDB. | 6 | Pass — developer terminology |
| The app reads RSS and Atom feeds only after you press Find episodes. | 11 | Pass — feed claims |
| Project notes | 2 | Pass — heading |
| `.factory/design.md` records the visual system and generated-art provenance. | 8 | Pass — repository documentation |
| `.factory/demo.md` documents demo isolation. | 4 | Pass — repository documentation |
| `.factory/claims.json` maps claims to executable tests. | 6 | Pass — repository documentation |
| `.factory/handoff.md` records final verification. | 4 | Pass — repository documentation |
| Licensed under the MIT License. | 5 | Pass |

Terminology is consistent: **clip** = saved timestamp/question/takeaway,
**recall question** = learner cue, **takeaway** = learner answer, **recall
queue** = due questions, **demo** = isolated samples, and **podcast feed** =
metadata source.

## Demo, sandbox, offline, and privacy checks

- The first-screen action opened `/?demo=1` in one click. Its first view
  already showed a realistic question, five clips, three due questions, the
  persistent **“Demo — sample data, nothing is saved to your notes.”** banner,
  **Reset demo**, and **Start for real**.
- Completing a sample changed **Question 1 of 3 today** to **Question 2 of 3
  today**. Reset restored five clips and Question 1. Completing all three
  reached the caught-up state; an offline reload retained the recall action.
- A live seeded-real-library check byte-compared real IndexedDB/localStorage
  before and during a demo mutation: it remained equal; **Start for real**
  restored the real question and discarded the demo question. The only
  remaining database was `podcast-recall-loop`.
- Live first-screen, demo, and isolation request logs contained only
  `https://podcast-recall-loop.sociobot.in`. There were no tracking, media,
  audio, authentication, or provider requests. Explicit feed requests are
  separately exercised by their fixture test.

## Claims execution

After `npm ci` in this clean checkout, every command declared by
`.factory/claims.json` passed independently (27/27; 256 seconds total).
Every registry tag occurs exactly once in the shipped test suite.

| Claim ids with passing declared command |
| --- |
| `offline-reload`, `demo-isolation`, `demo-seed-reset`, `rss-lookup`, `feed-explicit-request`, `atom-lookup`, `daily-three` |
| `csv-export`, `markdown-export`, `free-limit`, `free-reviews-exports`, `local-privacy`, `no-account`, `browser-persistence` |
| `metadata-only`, `manual-authorship`, `json-backup`, `invalid-backup-recovery`, `spaced-schedule`, `review-results` |
| `calendar-reminder`, `installable-pwa`, `existing-license`, `one-time-unlimited`, `license-restore`, `build-coupled-updates`, `sociobot-billing` |

The only unlisted claim-like statement is F-6-1. All landing and README
product-reliance statements map to one of the passing entries above.

## Earlier findings rechecked

Every earlier review, polish report, and handoff was read. The checks below
were repeated against the deployed product and current source, rather than
accepted from the historical “fixed” labels.

| Earlier finding | Current result |
| --- | --- |
| F-1-1 | Fixed — demo selects its database before license handling; real state stayed byte-equal. |
| F-1-2 / F-3-1 | Fixed — Restore, checkout, Start-for-real, and direct exits dispose demo state. |
| F-1-3 | Fixed — five sample clips and Reset are claimed and observed. |
| F-1-4 | Fixed — checkout fixture asserts product, USD, one-time billing, and 900 cents. |
| F-1-5 | Fixed — all six routes have route-specific title, description, canonical, OG, and Twitter values. |
| F-1-6 | Fixed — preview heading is **Write your own recall question**. |
| F-1-7 | Fixed — visitor copy says podcast feed/address and gives manual entry. |
| F-1-8 | Fixed — visitor README says this browser; IndexedDB is developer-only. |
| F-1-9 | Fixed — user documentation says install and review offline. |
| F-1-10 | Fixed — answer-dependent scheduling is explicit and tested on both results. |
| F-1-11 | Fixed — **Restore a license** names its result and focuses the field. |
| F-1-12 | Fixed — real recall page downloads a daily local calendar event. |
| F-2-1 | Fixed — feed request begins only after **Find episodes**. |
| F-2-2 | Fixed — Atom parsing fills podcast, episode, and link under fixture. |
| F-2-3 | Fixed — Back restores scroll position and focuses the destination h1. |
| F-4-1 | Fixed — a local-day snapshot is capped at three and does not refill that day. |
| F-4-2 | Fixed — clean demo starts at Question 1 of 3. |
| F-4-3 | Fixed — privacy request log covers real save, reload, export, import, and delete. |
| F-4-4 | Fixed — README says separate real library, not empty library. |
| F-4-5 | Fixed — hero caption names saving, questioning, and recalling. |
| F-4-6 | Fixed — Node range is precise in README/package metadata and release tests. |
| F-5-1 | Fixed — footer contains only the build version; no inaccessible design-notes reference remains. |

## Structure, accessibility, and deployment checks

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200. `/missing-page`
  returned a styled 404 with **Return home**. All have one `h1`, one `main`,
  route-specific plain titles, descriptions, canonicals, OG/Twitter metadata,
  consistent header/footer, Privacy/Terms links, focus handling, and no
  normal-route console errors.
- The live verifier confirmed 390px first-screen fit, keyboard use, route
  focus, Back scroll restoration (1200px), reduced motion, dark theme, and
  zero serious/critical Axe findings on all six routes.
- `robots.txt`, sitemap, favicon, apple touch icon, 1200×630 OG art, manifest,
  CSP/security headers, SPA fallback, and service worker are present. Every
  discovered link resolved (internal 200; checkout 303; factory 200).
- `npm test` passed 86 tests, `npm run test:unit` passed 15 tests, and `npm run
  build` passed and produced `dist/`. The 10,811-byte gzipped app script and
  service worker SHA-256 hashes exactly match the live deployment.

## Missed leverage and AI check

No extra feature is an obvious omission from the brief. The product includes
feed/manual capture, learner-written questions, timestamp notes, spaced daily
review, exports/backup import, offline review, and a calendar reminder. Sync
would change the local-first privacy model. AI-authored questions would oppose
the brief’s learner-written retrieval practice. No runtime provider key, Azure
endpoint, Sociobot model call, or decorative AI feature is present.

## What would make this perfect

Correct F-6-1 and add the targeted storage-boundary claim test. Then rerun the
single claim, the full test/build suite, and the live privacy-page smoke test.
Nothing else is open.
