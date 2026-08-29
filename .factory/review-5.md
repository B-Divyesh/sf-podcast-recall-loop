# Adversarial first-read review 5 — Podcast Recall Loop

**Verdict: FAIL**

**Reviewed:** 29 August 2026  
**Candidate:** `61c6499b2f6d470ea820b2cc1ef05412c0269f09`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>

One minor, visitor-facing copy defect remains. All functional, sandbox, claim,
history, routing, accessibility, and build checks below passed. A PASS still
requires zero findings.

## Findings

### Minor

#### F-5-1 — The footer refers to inaccessible “design notes”

- **Exact quote/location:** global footer on every live route: **“Version
  1.0.5 · Generated art disclosed in the design notes.”**
- **Observed:** the phrase is plain text, not a link. The live header/footer,
  sitemap, and crawl expose no design-notes route or provenance page. A
  first-time visitor cannot find the disclosure the sentence promises.
- **Why this matters:** this is both an unverifiable provenance assertion and
  an unexplained reference. It does not tell a visitor where the generated art
  came from or how to inspect its disclosure.
- **Concrete fix:** either remove the clause, leaving the required build
  version, or add a linked public provenance page and rewrite it as
  **“Generated artwork: source and license.”** Do not keep a reference to
  internal repository notes in visitor-facing copy.

## Cold first screen

Fresh Chromium contexts were opened at 390×844 and 1440×900 with empty browser
storage. The screenshots were taken before scrolling.

| First-read question | Answer from the first screen | Evidence | Result |
| --- | --- | --- | --- |
| What does it do? | It helps a listener turn podcast moments into questions they recall later. | **“Remember what your podcasts taught you”** and the sample-prompt preview. | Pass |
| For whom? | Curious listeners who save useful podcast moments and forget them. | **“For curious listeners who save good moments but forget the ideas.”** | Pass |
| What should I click first? | **Try it with sample data.** | The high-contrast primary action says it opens five sample clips with no setup. | Pass |

The mobile first screen has no horizontal overflow (`390px` scroll width equals
client width) and shows the action, outcome, and three plain facts before the
hero art. Desktop uses the same hierarchy. The visual system is distinct from a
generic SaaS template: cool porcelain surfaces, original ceramic-loop art,
Georgia prompt type, and restrained teal controls match `.factory/design.md`.

## Copy audit

Counting treats hyphenated terms, prices, URLs, and slash-separated labels as
one word. Navigation destinations and form labels are included because they are
visitor copy. No landing or README sentence exceeds 22 words. No banned
marketing adjective, unexplained visitor-facing RSS/PWA/IndexedDB jargon, or
non-result-naming action was found. F-5-1 is the only flagged unit.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Podcast Recall Loop | 3 | Pass |
| Recall / Demo / Privacy | 1 each | Pass — destinations |
| Podcast recall for long listens | 5 | Pass — identifies the use case |
| Remember what your podcasts taught you | 6 | Pass — clear `<h1>` |
| For curious listeners who save good moments but forget the ideas. | 11 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Opens five sample clips from fictional shows. | 7 | Pass — `demo-seed-reset` |
| No setup. | 2 | Pass — sample/no-account path |
| Add a podcast feed → | 4 | Pass — real first step |
| Notes stay in this browser. | 5 | Pass — `browser-persistence`, `local-privacy` |
| Reviews work offline after your first visit. | 7 | Pass — `offline-reload` |
| The free library holds eight clips. | 6 | Pass — `free-limit` |
| Three porcelain pieces arranged in a quiet recall loop. | 9 | Pass — image alt text |
| Save a podcast moment. | 4 | Pass |
| Write a question. | 3 | Pass |
| Recall it later. | 3 | Pass |
| Today’s recall | 2 | Pass — section label |
| Write your own recall question | 6 | Pass — explicit heading |
| You write the question while the idea is fresh. | 9 | Pass — `manual-authorship` |
| The recall queue brings it back later. | 8 | Pass — `spaced-schedule` |
| 12:34 · Why retrieval beats rereading | 5 | Pass — sample label |
| Why does retrieving an idea strengthen memory? | 7 | Pass — sample question |
| Reveal your takeaway when you have answered. | 7 | Pass |
| How it works | 3 | Pass |
| Choose a moment | 3 | Pass |
| Add a podcast feed and pick the episode. | 8 | Pass |
| Add the timestamp yourself. | 4 | Pass |
| Write one question | 3 | Pass |
| Record the takeaway in your own words. | 7 | Pass — `manual-authorship` |
| No transcript is needed. | 4 | Pass — `metadata-only` |
| Recall three ideas | 3 | Pass — `daily-three` |
| Answer from memory. | 3 | Pass |
| Your next review is based on your answer. | 8 | Pass — `review-results` |
| What the app stores | 4 | Pass — section label |
| Your audio stays where it is | 6 | Pass — followed by the exact storage boundary |
| The app reads podcast titles from the feed address you request. | 11 | Pass — feed claims |
| It stores written notes, not audio. | 6 | Pass — `metadata-only` |
| You write every question and takeaway. | 6 | Pass — `manual-authorship` |
| You do not need an account. | 6 | Pass — `no-account` |
| Unlimited clip license | 3 | Pass — section label |
| Unlimited clips for $9 once | 5 | Pass — `one-time-unlimited` |
| The one-time license removes only the clip limit. | 8 | Pass — `existing-license` |
| Reviews and exports stay free. | 5 | Pass — `free-reviews-exports` |
| Buy unlimited — $9 once | 5 | Pass — result-naming action |
| Restore a license | 3 | Pass — result-naming action |
| License token | 2 | Pass — form label |
| Verify license | 2 | Pass — result-naming action |
| Paste the token from your purchase email. | 7 | Pass |
| Sociobot handles checkout. | 3 | Pass — `sociobot-billing` |
| Privacy / Terms | 1 each | Pass — destinations |
| Three podcast ideas, recalled daily. | 5 | Pass — `daily-three` |
| Built by Param Factory (opens in a new tab) | 9 | Pass — external-link disclosure |
| Version 1.0.5 · Generated art disclosed in the design notes. | 9 | **F-5-1** |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Podcast Recall Loop | 3 | Pass |
| Turn podcast moments into three daily recall questions. | 8 | Pass — `daily-three` |
| Podcast Recall Loop is for self-learners who want recall without a larger note system. | 14 | Pass |
| Add a podcast feed, choose an episode, mark a timestamp, and write one question. | 14 | Pass |
| The daily queue presents no more than three due questions. | 10 | Pass — `daily-three` |
| The app stores written notes in this browser. | 8 | Pass — privacy/persistence claims |
| It stores no audio. | 4 | Pass — `metadata-only` |
| The demo at `?demo=1` uses separate browser storage and never reads or writes your notes or license. | 17 | Pass — `demo-isolation` |
| Every exit discards sample changes. | 5 | Pass — `demo-isolation` |
| What v1 includes | 3 | Pass — section heading |
| Fill podcast and episode details from a feed, or enter them yourself | 12 | Pass — `rss-lookup` |
| Learner-written questions and takeaways tied to timestamps | 7 | Pass — `manual-authorship` |
| Up to three due questions, with the next review based on your answer | 13 | Pass — queue claims |
| Markdown, CSV, and JSON backup exports | 6 | Pass — export claims |
| JSON backup import that rejects invalid files without changing saved clips | 11 | Pass — backup claims |
| Install the app and review offline after your first visit | 10 | Pass — install/offline claims |
| A daily calendar reminder download for the recall queue | 9 | Pass — `calendar-reminder` |
| A free eight-clip library | 4 | Pass — `free-limit` |
| A $9 one-time license for unlimited clips through Sociobot checkout | 10 | Pass — billing claims |
| Try the isolated demo | 4 | Pass — section heading |
| Open `http://localhost:4173/?demo=1` after starting the app. | 6 | Pass |
| It contains five sample clips from fictional educational shows. | 9 | Pass — `demo-seed-reset` |
| Use Reset demo to restore them. | 6 | Pass — `demo-seed-reset` |
| Every link that leaves the demo discards its changes. | 9 | Pass — `demo-isolation` |
| Start for real discards demo changes and opens your separate real library. | 12 | Pass — `demo-isolation` |
| Develop | 1 | Pass — section heading |
| Requires Node.js 20.19+ or 22.12+. | 6 | Pass — release regression test |
| Vite serves the development site at `http://localhost:4173`. | 7 | Pass — developer instruction |
| Test and build | 3 | Pass — section heading |
| The Playwright suite checks every claim, offline reload, keyboard use, mobile width, route structure, and serious accessibility findings. | 18 | Pass — aggregate suite rerun |
| Vitest covers data and release configuration. | 6 | Pass — aggregate unit run |
| The production command writes `index.html` and fingerprinted static assets to `dist/`. | 11 | Pass — build rerun |
| The production build also stamps the service worker from those asset fingerprints. | 12 | Pass — release test |
| Installed copies therefore receive every new app build without a manual cache-version edit. | 13 | Pass — `build-coupled-updates` |
| Run one claim with its command from `.factory/claims.json`. | 8 | Pass |
| Deploy | 1 | Pass — section heading |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| `staticwebapp.config.json` provides SPA fallback and security headers for Azure Static Web Apps. | 12 | Pass — developer instruction |
| The factory owns DNS and deployment. | 6 | Pass — scope statement |
| Privacy | 1 | Pass — section heading |
| The privacy policy is at `/privacy`; terms are at `/terms`. | 10 | Pass |
| The app contacts the feed address only after you press Find episodes. | 12 | Pass — `feed-explicit-request` |
| Saved note flows send no note data or tracking requests to another origin. | 13 | Pass — `local-privacy` |
| One-time license | 2 | Pass — section heading |
| The free library holds eight clips. | 6 | Pass — `free-limit` |
| A $9 one-time license removes that limit. | 7 | Pass — `one-time-unlimited` |
| Sociobot handles checkout. | 3 | Pass — `sociobot-billing` |
| Buyers can paste their license on the home page to restore it on another device. | 15 | Pass — `license-restore` |
| Developer notes | 2 | Pass — section heading |
| The browser storage implementation uses IndexedDB. | 6 | Pass — developer terminology |
| The app reads RSS and Atom feeds only after you press Find episodes. | 11 | Pass — feed claims |
| Project notes | 2 | Pass — section heading |
| `.factory/design.md` records the visual system and generated-art provenance. | 8 | Pass — repository documentation |
| `.factory/demo.md` documents demo isolation. | 4 | Pass — repository documentation |
| `.factory/claims.json` maps claims to executable tests. | 6 | Pass — repository documentation |
| `.factory/handoff.md` records final verification. | 4 | Pass — repository documentation |
| Licensed under the MIT License. | 5 | Pass |

## Demo, sandbox, and privacy

- The landing action opened `/?demo=1` in one click. The first product screen
  showed a realistic question, five saved clips, three due questions, the
  persistent **“Demo — sample data, nothing is saved to your notes.”** banner,
  **Reset demo**, and **Start for real**.
- Revealing then marking the first prompt remembered changed the live queue to
  **Question 2 of 3 today**. Reset returned it to five clips and
  **Question 1 of 3 today**.
- A cold live request log for the landing and the demo/review/reset path
  contained only `https://podcast-recall-loop.sociobot.in`; it made no tracking,
  media, authentication, or third-party request. The dedicated
  `local-privacy` and `demo-isolation` tests passed from the clean checkout.
- The implementation selects the `podcast-recall-loop-demo` IndexedDB database
  before license handling, and `resetDemo()` is called before every demo exit.
  The dedicated test byte-compares the real database/localStorage through
  sample mutation, Restore, checkout, and Start-for-real exits.

## Claims execution

After `npm ci`, every command in `.factory/claims.json` was run separately
from this clean checkout. All passed. The aggregate Playwright run also passed
all 82 tests; `npm run test:unit` passed 15/15 and `npm run build` produced
`dist/`.

| Claim ids with passing declared test |
| --- |
| `offline-reload`, `demo-isolation`, `demo-seed-reset`, `rss-lookup`, `feed-explicit-request`, `atom-lookup`, `daily-three` |
| `csv-export`, `markdown-export`, `free-limit`, `free-reviews-exports`, `local-privacy`, `no-account`, `browser-persistence` |
| `metadata-only`, `manual-authorship`, `json-backup`, `invalid-backup-recovery`, `spaced-schedule`, `review-results` |
| `calendar-reminder`, `installable-pwa`, `existing-license`, `one-time-unlimited`, `license-restore`, `build-coupled-updates`, `sociobot-billing` |

There is exactly one shipped `@claim:<id>` test occurrence for each of the 27
registry ids. All product-reliance copy on the landing and README maps to the
listed observable claim checks; the footer provenance sentence is separately
recorded as F-5-1 because it is not usable from the live product.

## Earlier findings rechecked

Every earlier review, polish report, and handoff was read. Each prior finding
was checked against current source and the live site rather than accepted from
its “fixed” label.

| Earlier finding | Current verification | Status |
| --- | --- | --- |
| F-1-1 | Demo chooses its database before license code; isolation claim passed. | Fixed |
| F-1-2 | Restore, checkout, Start-for-real, and ordinary exits reset demo data. | Fixed |
| F-1-3 | Five clips/reset is registered and observed. | Fixed |
| F-1-4 | Checkout fixture asserts product, USD, one-time billing, and 900 cents. | Fixed |
| F-1-5 | Six live routes have route-specific title, description, canonical, OG/Twitter values. | Fixed |
| F-1-6 | Preview heading is **Write your own recall question**. | Fixed |
| F-1-7 | Visitor copy says podcast feed/address and provides a manual fallback. | Fixed |
| F-1-8 | Reader copy says “this browser”; IndexedDB is developer-only. | Fixed |
| F-1-9 | Visitor copy describes install/offline results without PWA jargon. | Fixed |
| F-1-10 | Both answer paths are tested and the copy explains the result. | Fixed |
| F-1-11 | **Restore a license** names the control result. | Fixed |
| F-1-12 | `/app` supplies and tests a local recurring calendar download. | Fixed |
| F-2-1 | Feed request occurs only after the visible action; request-log claim passed. | Fixed |
| F-2-2 | Atom fills podcast, episode, and link under its declared fixture. | Fixed |
| F-2-3 | Back restores scroll and focuses the destination heading. | Fixed |
| F-3-1 | The exact Restore exit is now included in the isolation regression. | Fixed |
| F-4-1 | Five overdue clips yield exactly 1→2→3, caught-up state, then two next day. | Fixed |
| F-4-2 | Fresh demo starts at **Question 1 of 3 today**. | Fixed |
| F-4-3 | Privacy claim records real save, reload, export, import, and delete flows. | Fixed |
| F-4-4 | README says “separate real library,” not “empty library.” | Fixed |
| F-4-5 | Hero caption names the actual capture/question/recall task. | Fixed |
| F-4-6 | README/package requirement is precise and release-tested. | Fixed |

## Structure and route checks

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200; `/missing-page`
  returned a designed 404 with a Return home action. All routes have a single
  `<h1>`, `<main>`, consistent header/footer, Privacy/Terms links, plain
  route title, description, canonical, OG/Twitter metadata, and no page or
  console error. (The browser’s expected failed-document resource message for
  the HTTP 404 is excluded from normal-route console checks.)
- `robots.txt`, `sitemap.xml`, SVG favicon, apple-touch icon, 1200×630 OG art,
  manifest, and matching theme colour are live. The link crawl found all
  internal routes and factory link at 200; the supported Sociobot checkout
  correctly returned 303 to checkout.
- Keyboard, reduced-motion, dark theme, touch-target, mobile-overflow, route
  focus, Back scroll restoration, and serious/critical Axe checks all pass in
  the aggregate suite. No remote font or script loads. The build emitted
  10.89 KB gzip JavaScript.

## Missed leverage and AI check

No missing feature is evident from the brief. The product includes the useful
local counterparts: RSS/Atom/manual capture, timestamp notes, a strict
three-question daily queue, CSV/Markdown/JSON export and backup restore,
offline review, and a daily calendar reminder. Sync would contradict the
explicit local-first model. AI-authored questions would undermine the stated
learner-written retrieval practice, so no Sociobot AI feature is expected.
No provider key, Azure endpoint, or decorative AI control is present.

## What would make this perfect

Resolve F-5-1 by removing the inaccessible design-notes reference or linking a
public artwork-provenance disclosure. Then rerun the one copy/route smoke
check. No other product change is indicated by this review.
