# Adversarial first-read review 8 — Podcast Recall Loop

**Verdict: FAIL**

**Reviewed:** 30 August 2026 UTC  
**Candidate:** `49a4894f5b14a66bad1693a43f2bfa4bc7259330`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>

The first screen, demo, local data boundary, core recall loop, claims suite,
routing, accessibility, and visual identity pass. The release still fails
because the visible paid action is dead: Sociobot checkout returned HTTP 500
in the browser verifier and in three direct retries. This regresses the billing
outage recorded as F-13-1 in the handoff. A PASS requires zero findings.

## Finding

### Blocking

#### F-8-1 (repeat of handoff F-13-1) — “Buy unlimited” returns HTTP 500

- **Exact quote/location:** landing price section, **“Unlimited clips for $9
  once”**, **“Buy unlimited — $9 once”**, and **“Sociobot handles checkout.”**
  The live link targets
  `https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout`.
- **Observed:** the independent live browser verifier received HTTP 500 instead
  of the expected 303. Three subsequent direct requests each returned HTTP 500
  with `{"error":"Internal server error","status":500}` and no redirect.
- **Test gap:** `one-time-unlimited` and `sociobot-billing` pass because they
  intercept the checkout with a recorded fixture. They prove the link shape,
  product, currency, billing mode, and 900-cent amount, but not that the live
  purchase path is available. The live link crawl is the failing check.
- **Why this blocks:** a visitor who accepts the advertised $9 offer cannot buy
  it. The action names a result that it does not produce, and the only broken
  link on the site is the paid conversion path.
- **Concrete fix:** restore the Sociobot product/checkout endpoint until it
  returns 303 to a live 200 checkout showing product slug
  `podcast-recall-loop`, USD, one-time billing, and 900 cents. Make
  `npm run verify:billing-live` a required release/deployment health gate. If
  checkout cannot be kept available, remove the paid section and related
  claims until it can.

## Cold first screen

Fresh Chromium contexts opened the live home page at 390×844 and 1440×900.
Nothing was scrolled before recording these answers.

| Question | Answer from the first screen | Exact evidence | Result |
| --- | --- | --- | --- |
| What does this do? | It turns saved podcast moments into questions for later recall. | **“Turn podcast moments into recall questions”** | Pass |
| For whom? | Podcast listeners who save useful moments and forget what they learned. | **“For podcast listeners who save useful moments, then forget what they learned.”** | Pass |
| What should I click first? | **Try it with sample data.** | **“Opens five sample clips from fictional shows. No setup.”** | Pass |

At 390 px, the action ended at 481 px and all three facts ended at 730 px,
inside the 844 px viewport. At desktop width they ended at 808 px inside the
900 px viewport. Both documents stayed at their viewport width, began at
`scrollY=0`, used one `h1` and one `main`, and logged no console or page error.

## Copy audit

Counts treat hyphenated forms, prices, URLs, paths, and slash-separated
navigation labels as one word. Standalone headings, labels, captions, and
actions are included because a visitor encounters them as copy. No unit
exceeds 22 words. No banned marketing adjective, inconsistent core term,
mood-only heading, or unexplained visitor-facing RSS/PWA/IndexedDB term was
found. The checkout units are flagged only because their promised result is
unavailable (F-8-1).

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Podcast Recall Loop | 3 | Pass |
| Recall / Demo / Privacy | 1 each | Pass — destinations |
| Podcast recall for long listens | 5 | Pass — use-case label |
| Turn podcast moments into recall questions | 6 | Pass — verb-first job headline |
| For podcast listeners who save useful moments, then forget what they learned. | 11 | Pass — audience and change |
| Try it with sample data | 5 | Pass — result action |
| Opens five sample clips from fictional shows. | 7 | Pass — `demo-seed-reset` |
| No setup. | 2 | Pass — one-click/no-account path |
| Add a podcast feed | 4 | Pass — real first step |
| Notes stay in this browser. | 5 | Pass — privacy/persistence claims |
| Reviews work offline after your first visit. | 7 | Pass — `offline-reload` |
| The free library holds eight clips. | 6 | Pass — `free-limit` |
| Three porcelain pieces arranged in a quiet recall loop. | 9 | Pass — image alternative |
| Save a podcast moment. | 4 | Pass — workflow caption |
| Write a question. | 3 | Pass — workflow caption |
| Recall it later. | 3 | Pass — workflow caption |
| Today’s recall | 2 | Pass — section label |
| Write your own recall question | 5 | Pass — specific heading |
| You write the question while the idea is fresh. | 9 | Pass — `manual-authorship` |
| The recall queue brings it back later. | 7 | Pass — `spaced-schedule` |
| 12:34 · Why retrieval beats rereading | 5 | Pass — sample context |
| Why does retrieving an idea strengthen memory? | 7 | Pass — sample question |
| Reveal your takeaway when you have answered. | 7 | Pass — instruction |
| How it works | 3 | Pass — section heading |
| Choose a moment | 3 | Pass — step heading |
| Add a podcast feed and pick the episode. | 8 | Pass — `rss-lookup` |
| Add the timestamp yourself. | 4 | Pass — instruction |
| Write one question | 3 | Pass — step heading |
| Record the takeaway in your own words. | 7 | Pass — `manual-authorship` |
| No transcript is needed. | 4 | Pass — `metadata-only` |
| Recall three ideas | 3 | Pass — step heading |
| Answer from memory. | 3 | Pass — instruction |
| Your next review is based on your answer. | 8 | Pass — `review-results` |
| What the app stores | 4 | Pass — section label |
| Your audio stays where it is | 6 | Pass — storage boundary |
| The app reads podcast titles from the feed address you request. | 11 | Pass — feed claims |
| It stores written notes, not audio. | 6 | Pass — `metadata-only` |
| You write every question and takeaway. | 6 | Pass — `manual-authorship` |
| You do not need an account. | 6 | Pass — `no-account` |
| Unlimited clip license | 3 | Pass — section label |
| Unlimited clips for $9 once | 5 | **F-8-1** — purchase path unavailable |
| The one-time license removes only the clip limit. | 8 | Pass — license behavior |
| Reviews and exports stay free. | 5 | Pass — `free-reviews-exports` |
| Buy unlimited — $9 once | 4 | **F-8-1** — result action returns 500 |
| Restore a license | 3 | Pass — result action |
| License token | 2 | Pass — label |
| Verify license | 2 | Pass — result action |
| Paste the token from your purchase email. | 7 | Pass — instruction |
| Sociobot handles checkout. | 3 | **F-8-1** — live checkout is unavailable |
| Privacy / Terms | 1 each | Pass — destinations |
| Three podcast ideas, recalled daily. | 5 | Pass — `daily-three` |
| Built by Param Factory (opens in a new tab) | 9 | Pass — external-link disclosure |
| Version 1.0.10 | 2 | Pass — build identifier |
| Podcast Recall Loop — Remember podcast ideas | 7 | Pass — title, 44 characters |
| Save a podcast timestamp, write your own question, and recall three ideas each day. | 14 | Pass — meta description |
| Your notes stay in this browser. | 6 | Pass — meta description |
| Turn podcast moments into three daily recall questions. | 8 | Pass — social description |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Podcast Recall Loop | 3 | Pass — title |
| Turn saved podcast moments into questions, then recall three ideas each day. | 12 | Pass — job summary |
| Podcast Recall Loop is for self-learners who want recall without a larger note system. | 14 | Pass — audience |
| Add a podcast feed, choose an episode, mark a timestamp, and write one question. | 14 | Pass — workflow |
| The daily queue presents no more than three due questions. | 10 | Pass — `daily-three` |
| The app stores written notes in this browser. | 8 | Pass — privacy/persistence |
| It stores no audio. | 4 | Pass — `metadata-only` |
| The demo at `?demo=1` uses separate browser storage and never reads or writes your notes or license. | 17 | Pass — `demo-isolation` |
| Every exit discards sample changes. | 5 | Pass — `demo-isolation` |
| What v1 includes | 3 | Pass — heading |
| Fill podcast and episode details from a feed, or enter them yourself | 12 | Pass — `rss-lookup` |
| Learner-written questions and takeaways tied to timestamps | 7 | Pass — `manual-authorship` |
| Up to three due questions, with the next review based on your answer | 13 | Pass — queue claims |
| Markdown, CSV, and JSON backup exports | 6 | Pass — export claims |
| JSON backup import that rejects invalid files without changing saved clips | 11 | Pass — backup claims |
| Install the app and review offline after your first visit | 10 | Pass — install/offline claims |
| A daily calendar reminder download for the recall queue | 9 | Pass — `calendar-reminder` |
| A free eight-clip library | 4 | Pass — `free-limit` |
| A $9 one-time license for unlimited clips through Sociobot checkout | 10 | **F-8-1** — live purchase path unavailable |
| Try the isolated demo | 4 | Pass — heading |
| Open `http://localhost:4173/?demo=1` after starting the app. | 6 | Pass — instruction |
| It contains five sample clips from fictional educational shows. | 9 | Pass — `demo-seed-reset` |
| Use Reset demo to restore them. | 6 | Pass — `demo-seed-reset` |
| Every link that leaves the demo discards its changes. | 9 | Pass — `demo-isolation` |
| Start for real discards demo changes and opens your separate real library. | 12 | Pass — `demo-isolation` |
| Develop | 1 | Pass — heading |
| Requires Node.js 20.19+ or 22.12+. | 6 | Pass — supported range |
| Vite serves the development site at `http://localhost:4173`. | 7 | Pass — developer instruction |
| Test and build | 3 | Pass — heading |
| The Playwright suite checks every claim, offline reload, keyboard use, mobile width, route structure, and serious accessibility findings. | 18 | Pass — 98/98 rerun |
| Vitest covers data and release configuration. | 6 | Pass — 17/17 rerun |
| The production command writes `index.html` and fingerprinted static assets to `dist/`. | 11 | Pass — build rerun |
| The production build also stamps the service worker from those asset fingerprints. | 12 | Pass — release test |
| Installed copies therefore receive every new app build without a manual cache-version edit. | 13 | Pass — `build-coupled-updates` |
| Run one claim with its command from `.factory/claims.json`. | 8 | Pass — instruction |
| Deploy | 1 | Pass — heading |
| Deploy the contents of `dist/` as a static site. | 9 | Pass — instruction |
| `staticwebapp.config.json` provides SPA fallback and security headers for Azure Static Web Apps. | 12 | Pass — configuration checked |
| The factory owns DNS and deployment. | 6 | Pass — scope statement |
| Privacy | 1 | Pass — heading |
| The privacy policy is at `/privacy`; terms are at `/terms`. | 10 | Pass — routes checked |
| The app contacts the feed address only after you press Find episodes. | 12 | Pass — `feed-explicit-request` |
| Saved note flows send no note data or tracking requests to another origin. | 13 | Pass — `local-privacy` |
| One-time license | 2 | Pass — heading |
| The free library holds eight clips. | 6 | Pass — `free-limit` |
| A $9 one-time license removes that limit. | 7 | **F-8-1** — license cannot currently be purchased |
| Sociobot handles checkout. | 3 | **F-8-1** — live checkout is unavailable |
| Buyers can paste their license on the home page to restore it on another device. | 15 | Pass — `license-restore` |
| Developer notes | 2 | Pass — heading |
| The browser storage implementation uses IndexedDB. | 6 | Pass — developer-only term |
| The app reads RSS and Atom feeds only after you press Find episodes. | 11 | Pass — feed claims |
| Project notes | 2 | Pass — heading |
| `.factory/design.md` records the visual system and generated-art provenance. | 8 | Pass — repository note |
| `.factory/demo.md` documents demo isolation. | 4 | Pass — repository note |
| `.factory/claims.json` maps claims to executable tests. | 6 | Pass — repository note |
| `.factory/handoff.md` records final verification. | 4 | Pass — repository note |
| Licensed under the MIT License. | 5 | Pass |

Terminology is consistent: **clip** is the saved timestamp/question/takeaway;
**recall question** is the cue; **takeaway** is the saved answer; **recall
queue** is up to three due questions; **demo** is isolated sample data;
**podcast feed** is the metadata source; **unlimited** is the paid no-limit
state.

## Demo, sandbox, offline, and privacy

- The landing action opened `/?demo=1` in one click. The first settled screen
  already showed five authored clips, three due questions, a realistic prompt,
  and **Question 1 of 3 today**.
- The persistent banner says **“Demo — sample data, nothing is saved to your
  notes.”** and includes **Reset demo** and **Start for real**.
- The live sequence was 1 → 2 → 3 → caught up. Reset restored five clips and
  Question 1. Offline reload retained the recall action and offline notice.
- A seeded real note and both real license keys remained byte-equal through
  demo entry, mutation, Restore, Reset, and Start-for-real exits. The demo URL
  ignored a `license=` query token. Returning recreated the pristine sample.
- The cold home/demo and isolation request logs contained only the product
  origin. The real-note privacy test separately covered save, reload, export,
  import, and delete with no cross-origin note or tracking request.

## Claims execution

The repository was cloned to a new directory and `npm ci` completed with zero
vulnerabilities. Every declared command was then run independently, in registry
order. Each registered tag occurs exactly once in the shipped tests.

| Claim ID | Result | Seconds |
| --- | --- | ---: |
| `offline-reload` | PASS | 9 |
| `demo-isolation` | PASS | 20 |
| `demo-seed-reset` | PASS | 12 |
| `rss-lookup` | PASS | 8 |
| `feed-explicit-request` | PASS | 9 |
| `atom-lookup` | PASS | 9 |
| `daily-three` | PASS | 13 |
| `csv-export` | PASS | 8 |
| `markdown-export` | PASS | 7 |
| `free-limit` | PASS | 12 |
| `free-reviews-exports` | PASS | 11 |
| `local-privacy` | PASS | 10 |
| `no-account` | PASS | 9 |
| `browser-persistence` | PASS | 10 |
| `metadata-only` | PASS | 8 |
| `manual-authorship` | PASS | 11 |
| `json-backup` | PASS | 8 |
| `invalid-backup-recovery` | PASS | 10 |
| `spaced-schedule` | PASS | 9 |
| `review-results` | PASS | 10 |
| `calendar-reminder` | PASS | 8 |
| `installable-pwa` | PASS | 8 |
| `existing-license` | PASS | 17 |
| `one-time-unlimited` | PASS — recorded checkout fixture; live failure is F-8-1 | 9 |
| `license-restore` | PASS | 8 |
| `license-storage` | PASS | 8 |
| `build-coupled-updates` | PASS | 2 |
| `sociobot-billing` | PASS — endpoint-shape fixture; live failure is F-8-1 | 8 |

Aggregate verification also passed: Playwright 98/98, Vitest 17/17, production
build, TypeScript, and `npm audit --audit-level=high`. The build emits 11.07 KB
gzip JavaScript and 4.20 KB gzip CSS. A second dependency-free clone passed
direct `npm run build`; its prebuild installed the exact lockfile first.

No landing or README claim-like sentence is absent from `claims.json`. F-8-1
is a failing live dependency check for listed paid claims, not an unlisted
claim.

## Earlier findings rechecked

Every `review-1` through `review-7`, every `polish-1` through `polish-7`, and
the full handoff were read. The checks below use current code and live behavior,
not prior disposition labels.

| Earlier finding | Current verification | Status |
| --- | --- | --- |
| F-1-1 | Demo mode is selected before licensing; seeded real notes/license state stayed byte-equal. | Fixed |
| F-1-2 | Reset and every tested demo exit delete the demo database; returning restores five clips and three due. | Fixed |
| F-1-3 | `demo-seed-reset` exists, occurs once, and passes. | Fixed |
| F-1-4 | The fixture asserts slug, USD, one-time billing, and 900 cents. Live availability has separately regressed as F-8-1. | Fixed test gap; live regression open |
| F-1-5 | All six routes publish route-specific title, description, canonical, OG, and Twitter values. | Fixed |
| F-1-6 | The live preview heading is **Write your own recall question**. | Fixed |
| F-1-7 | Visitor copy uses podcast feed/address and provides manual entry. | Fixed |
| F-1-8 | Reader copy says **this browser**; IndexedDB is developer-only. | Fixed |
| F-1-9 | Reader documentation describes install/offline results without PWA jargon. | Fixed |
| F-1-10 | Answer-dependent scheduling is explicit and both outcomes pass. | Fixed |
| F-1-11 | **Restore a license** names the result and focuses the field. | Fixed |
| F-1-12 | The recall page downloads a tested daily calendar reminder. | Fixed |
| F-2-1 | The feed request log records zero requests before **Find episodes** and one after. | Fixed |
| F-2-2 | Atom fills the podcast, episode, and link fields under its declared fixture. | Fixed |
| F-2-3 | Live Back restored 1200 px and focused the destination `h1`. | Fixed |
| F-3-1 | The visible demo Restore exit uses the disposal guard and returns to a pristine demo. | Fixed |
| F-4-1 | Five overdue clips produce exactly three questions, caught-up state, then defer two to the next day. | Fixed |
| F-4-2 | A fresh live demo begins at **Question 1 of 3 today**. | Fixed |
| F-4-3 | `local-privacy` covers real save, reload, export, import, and delete. | Fixed |
| F-4-4 | README says **separate real library**, not empty library. | Fixed |
| F-4-5 | The art caption states the save/question/recall workflow. | Fixed |
| F-4-6 | README/package specify Node `^20.19.0 || >=22.12.0`; a dependency-free build passed. | Fixed |
| F-5-1 | The footer exposes only Version 1.0.10; no inaccessible design-note reference remains. | Fixed |
| F-6-1 | Privacy names the token and verification result; `license-storage` proves only those keys/fields. | Fixed |
| F-7-1 | Privacy limits the daily promise to automatic checks; two explicit submissions made two requested checks. | Fixed |
| Handoff F-13-1 | License verification works and fails invalid tokens closed, but live checkout returned 500 four times. | **Regressed — F-8-1** |
| Handoff F-13-2 | Missing/malformed/unavailable verification remains locked; a fresh live invalid token showed eight free spaces and no unlimited state. | Fixed |
| Polish-7 dependency-free build failure | A new clone with no `node_modules` ran `npm run build`; prebuild installed the lockfile and produced `dist/`. | Fixed |

## Structure, links, accessibility, and identity

| Check | Result |
| --- | --- |
| Titles and metadata | Pass: `/`, `/demo`, `/app`, `/privacy`, `/terms`, and 404 use route-specific plain titles, descriptions, canonicals, OG/Twitter values, one `h1`, and one `main`. |
| Assets | Pass: SVG favicon, 180×180 touch icon, 1200×630 product OG art, manifest, robots, sitemap, theme color, and service worker return 200. |
| 404 | Pass: `/missing-page` returns HTTP 404 with product styling and **Return home**. |
| Deep links/history | Pass: direct routes load; Back restores scroll and focuses the destination heading; route changes have the live announcement region. |
| Link crawl | **Fail only F-8-1:** all internal routes and `sociobot.in` return 200; checkout returns 500 without a redirect. |
| Header/footer | Pass: consistent wordmark, Demo/Privacy navigation, skip link, Privacy/Terms, factory attribution, product line, and Version 1.0.10. |
| Accessibility | Pass: the factory URL verifier reports no errors; integrated Axe found zero serious/critical issues on all routes and 404; keyboard, 44 px targets, reduced motion, dark contrast, alt text, labels, and 390 px reflow pass. |
| Performance/integrity | Pass: JavaScript is 11.07 KB gzip. Live JS, CSS, and worker SHA-256 values exactly match the candidate build. |
| Visual identity | Pass: glacial colors, asymmetric porcelain surfaces, original ceramic still life, serif prompt type, timestamp marks, and restrained set-down motion match `.factory/design.md` and are not a generic SaaS template. |

## Missed leverage and AI check

No additional feature is an obvious omission from the brief beyond restoring
the paid path. Feed/manual capture, learner-written questions, a strict daily
queue, offline review, calendar reminders, CSV/Markdown export, and complete
JSON backup import/export are present. Sync would change the stated local-first
privacy model. AI-written prompts would undermine the brief’s learner-authored
retrieval practice. No provider key, Azure endpoint, runtime model call, or
decorative AI feature is present.

## What would make this perfect

Resolve F-8-1: make the live checkout return 303 to a working 200 hosted page
with the advertised one-time $9 product, and require the existing live billing
probe before release. Then rerun the link crawl and billing smoke check. No
other open item was found.
