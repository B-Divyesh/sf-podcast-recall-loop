# Adversarial first-read review 3 — Podcast Recall Loop

**Verdict:** FAIL

**Reviewed:** 29 August 2026 UTC

**Candidate:** `30fae39b1a88dc15865f3c07ea210edf22139efc`
**Live URL:** <https://podcast-recall-loop.sociobot.in>

One blocking regression remains. The normal one-click demo is clear and usable, but one visible link leaves demo mode without deleting its changed sample. That reopens **F-1-2**, so the demo is not reliably disposable. A PASS requires zero findings.

## Findings

### Blocking

#### F-3-1 (repeat of F-1-2) — “Restore a license” leaves changed demo data behind

- **Exact quote/location:** On live `/demo`, the limit notice visibly offers **“Restore a license”**. It is a normal `<a href="/#restore-license">` at `src/app.ts:135`, not a `data-link` route handled by `navigate()`. Only `navigate()` calls `resetDemo()` before leaving demo (`src/app.ts:28-30`).
- **Reproduction:** In a fresh live browser context, enter `/demo`, change one sample clip so that it is no longer due, follow the visible **Restore a license** destination, then return to `/demo`. The count is **“2 questions due”**, rather than the seeded **“3 questions due”**. The live route first opens `/#restore-license`, where the real-library license form is present.
- **Why this blocks:** The demo contract requires leaving demo to discard it. The privacy page promises: **“Resetting it or starting for real deletes its sample changes.”** A visitor has another direct exit from demo, and it retains changed sample data. This is the same sandbox failure previously recorded as F-1-2, not a cosmetic route difference.
- **Concrete fix:** Do not render purchase/license exits in demo mode, or mark every demo exit with the route handler that awaits `resetDemo()` before navigation. Cover the visible `/demo` **Restore a license** link (and the checkout link if retained): change a sample, activate the link, return to `/demo`, and assert five clips and three due questions. The test must exercise the actual anchor, not call **Start for real** instead.

## Cold first screen

Fresh, separate Chromium contexts were opened at 390×844 and 1440×900. Nothing was scrolled before the answers below were recorded.

| Question | First-read answer | Exact evidence | Result |
| --- | --- | --- | --- |
| What does this do? | It helps turn remembered podcast moments into daily recall. | **“Remember what your podcasts taught you”** | Pass |
| For whom? | Listeners who save useful moments but forget the ideas. | **“For curious listeners who save good moments but forget the ideas.”** | Pass |
| What should I click first? | **Try it with sample data.** | The adjacent result says **“Loads five podcast clips. No setup.”** | Pass |

The action, audience, and all three plain facts appear before scrolling at both widths. Mobile `scrollWidth` and `clientWidth` were both 390. No console errors occurred on the cold landing page.

## Copy audit

Counts treat hyphenated terms, prices, versions, URLs, and slash-separated navigation labels as one word. Landing entries are the visible text units, including labels and captions; README entries include headings and list items. No item exceeds 22 words. The only copy-related failure is F-3-1: the result-naming demo exit is not honest about what happens to changed sample data.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Podcast Recall Loop | 3 | Pass |
| Recall / Demo / Privacy | 1 each | Pass — destination links |
| Podcast recall for long listens | 5 | Pass |
| Remember what your podcasts taught you | 6 | Pass |
| For curious listeners who save good moments but forget the ideas. | 11 | Pass |
| Try it with sample data | 5 | Pass |
| Loads five podcast clips. | 4 | Pass — `demo-seed-reset` |
| No setup. | 2 | Pass — `no-account` |
| Add a podcast feed | 4 | Pass |
| Notes stay in this browser. | 5 | Pass — `browser-persistence` |
| Reviews work offline after your first visit. | 7 | Pass — `offline-reload` |
| The free library holds eight clips. | 6 | Pass — `free-limit` |
| Three porcelain pieces arranged in a quiet recall loop. | 9 | Pass — image alt text |
| Save. / Ask. / Recall. | 1 each | Pass — workflow caption |
| Today’s recall | 2 | Pass |
| Write your own recall question | 5 | Pass |
| You write the question while the idea is fresh. | 9 | Pass — `manual-authorship` |
| The recall queue brings it back later. | 7 | Pass — `spaced-schedule` |
| 12:34 · Why retrieval beats rereading | 5 | Pass — sample context |
| Why does retrieving an idea strengthen memory? | 7 | Pass — sample question |
| Reveal your takeaway when you have answered. | 7 | Pass |
| How it works | 3 | Pass |
| Choose a moment | 3 | Pass |
| Add a podcast feed and pick the episode. | 8 | Pass — `rss-lookup` |
| Add the timestamp yourself. | 4 | Pass |
| Write one question | 3 | Pass |
| Record the takeaway in your own words. | 7 | Pass — `manual-authorship` |
| No transcript is needed. | 4 | Pass — `metadata-only` |
| Recall three ideas | 3 | Pass |
| Answer from memory. | 3 | Pass |
| Your next review is based on your answer. | 8 | Pass — `review-results` |
| What the app stores | 4 | Pass |
| Your audio stays where it is | 6 | Pass — clarified by following sentence |
| The app reads podcast titles from the feed address you request. | 11 | Pass — `rss-lookup`, `feed-explicit-request` |
| It stores written notes, not audio. | 6 | Pass — `metadata-only` |
| You write every question and takeaway. | 6 | Pass — `manual-authorship` |
| You do not need an account. | 6 | Pass — `no-account` |
| Unlimited clip license | 3 | Pass |
| Unlimited clips for $9 once | 5 | Pass — `one-time-unlimited` |
| The one-time license removes only the clip limit. | 8 | Pass — `existing-license` / `free-reviews-exports` |
| Reviews and exports stay free. | 5 | Pass — `free-reviews-exports` |
| Buy unlimited — $9 once | 4 | Pass — result-naming verb |
| Restore a license | 3 | **F-3-1** — clear label, incorrect demo-exit behaviour |
| License token | 2 | Pass |
| Verify license | 2 | Pass — result-naming verb |
| Paste the token from your purchase email. | 7 | Pass |
| Sociobot handles checkout. | 3 | Pass — `sociobot-billing` |
| Three podcast ideas, recalled daily. | 5 | Pass |
| Built by Param Factory (opens in a new tab) | 9 | Pass |
| Version 1.0.3 · Generated art disclosed in the design notes. | 9 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Podcast Recall Loop | 3 | Pass |
| Turn podcast moments into three daily recall questions. | 8 | Pass |
| Podcast Recall Loop is for self-learners who want recall without a larger note system. | 14 | Pass |
| Add a podcast feed, choose an episode, mark a timestamp, and write one question. | 14 | Pass |
| The daily queue presents no more than three due questions. | 10 | Pass — `daily-three` |
| The app stores written notes in this browser. | 8 | Pass — `browser-persistence` |
| It stores no audio. | 4 | Pass — `metadata-only` |
| The demo at `?demo=1` uses separate browser storage and never reads or writes your notes or license. | 17 | Pass — `demo-isolation` |
| What v1 includes | 3 | Pass |
| Fill podcast and episode details from a feed, or enter them yourself | 12 | Pass — `rss-lookup` |
| Learner-written questions and takeaways tied to timestamps | 7 | Pass — `manual-authorship` |
| Up to three due questions, with the next review based on your answer | 13 | Pass — `daily-three`, `review-results` |
| Markdown, CSV, and JSON backup exports | 6 | Pass — export claims |
| JSON backup import | 3 | Pass — `json-backup` |
| Install the app and review offline after your first visit | 10 | Pass — PWA/offline claims |
| A daily calendar reminder download for the recall queue | 9 | Pass — `calendar-reminder` |
| A free eight-clip library | 4 | Pass — `free-limit` |
| A $9 one-time license for unlimited clips through Sociobot checkout | 10 | Pass — billing claims |
| Try the isolated demo | 4 | Pass |
| Open `http://localhost:4173/?demo=1` after starting the app. | 6 | Pass |
| It contains five sample clips from fictional educational shows. | 9 | Pass — `demo-seed-reset` |
| Use Reset demo to restore them. | 6 | Pass — `demo-seed-reset` |
| Start for real discards demo changes and opens the separate, empty library. | 12 | Pass for that control; does not cover F-3-1 |
| Develop | 1 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass |
| Vite serves the development site at `http://localhost:4173`. | 7 | Pass |
| Test and build | 3 | Pass |
| The Playwright suite checks every claim, offline reload, keyboard use, mobile width, route structure, and serious accessibility findings. | 18 | Pass |
| Vitest covers data and release configuration. | 6 | Pass |
| The production command writes `index.html` and fingerprinted static assets to `dist/`. | 11 | Pass |
| The production build also stamps the service worker from those asset fingerprints. | 12 | Pass |
| Installed copies therefore receive every new app build without a manual cache-version edit. | 13 | Pass — `build-coupled-updates` |
| Run one claim with its command from `.factory/claims.json`. | 8 | Pass |
| Deploy | 1 | Pass |
| Deploy the contents of `dist/` as a static site. | 9 | Pass |
| `staticwebapp.config.json` provides SPA fallback and security headers for Azure Static Web Apps. | 12 | Pass |
| The factory owns DNS and deployment. | 6 | Pass |
| Privacy | 1 | Pass |
| The privacy policy is at `/privacy`; terms are at `/terms`. | 10 | Pass |
| The app contacts the feed address only after you press Find episodes. | 12 | Pass — `feed-explicit-request` |
| Saved note flows send no note data or tracking requests to another origin. | 13 | Pass — `local-privacy` |
| One-time license | 2 | Pass |
| The free library holds eight clips. | 6 | Pass — `free-limit` |
| A $9 one-time license removes that limit. | 7 | Pass — `one-time-unlimited` |
| Sociobot handles checkout. | 3 | Pass — `sociobot-billing` |
| Buyers can paste their license on the home page to restore it on another device. | 15 | Pass — `license-restore` |
| Developer notes | 2 | Pass |
| The browser storage implementation uses IndexedDB. | 6 | Pass — developer context |
| The app reads RSS and Atom feeds only after you press Find episodes. | 11 | Pass — `atom-lookup`, `feed-explicit-request` |
| Project notes | 2 | Pass |
| `.factory/design.md` records the visual system and generated-art provenance. | 8 | Pass |
| `.factory/demo.md` documents demo isolation. | 4 | Pass |
| `.factory/claims.json` maps claims to executable tests. | 6 | Pass |
| `.factory/handoff.md` records final verification. | 4 | Pass |
| Licensed under the MIT License. | 5 | Pass |

No banned marketing adjective, unhelpful first-step jargon, or non-result-naming button was found. Every claim-like landing/README statement maps to a declared claim except the demonstrated behavioural gap in F-3-1, which is within the existing `demo-isolation` promise but lacks coverage for this exit.

## Demo, privacy, and claim evidence

- The landing button opens the app in use immediately: five authored clips, three due questions, an active recall question, and **Reveal my takeaway**.
- The persistent banner says **“Demo — sample data, nothing is saved to your notes.”** It provides **Reset demo** and **Start for real**.
- In a fresh live mobile context, Reveal + **I remembered** changed the count from three to two. **Reset demo** restored three due questions. The observed request log for this recall/reset path contained only `podcast-recall-loop.sociobot.in`.
- The current implementation correctly keeps demo’s IndexedDB namespace separate and ignores real-license URL state on demo entry. F-3-1 is the remaining untested exit path, not a finding that demo writes real notes or licenses while its banner is present.
- From a fresh `git clone` at the candidate, after `npm ci`, every declared command in `.factory/claims.json` passed independently: `offline-reload`, `demo-isolation`, `demo-seed-reset`, `rss-lookup`, `feed-explicit-request`, `atom-lookup`, `daily-three`, `csv-export`, `markdown-export`, `free-limit`, `free-reviews-exports`, `local-privacy`, `no-account`, `browser-persistence`, `metadata-only`, `manual-authorship`, `json-backup`, `spaced-schedule`, `review-results`, `calendar-reminder`, `installable-pwa`, `existing-license`, `one-time-unlimited`, `license-restore`, `build-coupled-updates`, and `sociobot-billing`.
- The claim suite passes because `@claim:demo-isolation` tests only **Start for real** (`tests/claims.spec.ts:49-54`), not the other visible demo exits.

## Earlier findings rechecked

All earlier review, polish, verification, and handoff files were read. The following reflects current code and the live deployment, not a prior “fixed” label.

| Earlier finding | Current result |
| --- | --- |
| F-1-1 demo read/wrote real license storage | Fixed: demo entry gates license handling; the full demo flow left seeded real storage unchanged. |
| F-1-2 leaving demo retained changes | **Regressed — F-3-1.** `Start for real` resets, but visible `/demo` license restoration does not. |
| F-1-3 demo/reset claims unlisted | Fixed: `demo-seed-reset` is declared and passes. |
| F-1-4 $9 amount untested | Fixed: fixture checks product, USD, one-time billing, and 900 cents. |
| F-1-5 deep social metadata | Fixed: each checked route has its own title, description, canonical, and OG URL. |
| F-1-6 unclear preview heading | Fixed: **Write your own recall question**. |
| F-1-7 RSS jargon | Fixed in visitor copy: it says podcast feed/address and gives a manual fallback. |
| F-1-8 IndexedDB visitor jargon | Fixed: browser storage wording is in the introduction; IndexedDB is developer-only. |
| F-1-9 PWA jargon | Fixed: README describes installation/offline result. |
| F-1-10 vague scheduling | Fixed: answer-dependent scheduling has both-result coverage. |
| F-1-11 non-result license control | Fixed: **Restore a license** names the result; its demo exit behaviour is F-3-1. |
| F-1-12 missing reminder | Fixed: daily ICS download exists and is claim-tested. |
| F-2-1 explicit feed request | Fixed: `feed-explicit-request` records zero requests before activation and one after. |
| F-2-2 Atom support | Fixed: `atom-lookup` asserts podcast, episode, and link fields. |
| F-2-3 back scroll restoration | Fixed: current history logic stores `scrollY`; regression test passes. |

## Structure, links, accessibility, and identity

- `/`, `/demo`, `/app`, `/privacy`, `/terms`, and an unknown URL were checked live. They have one `h1`, one `main`, route-specific titles/descriptions/canonicals/OG URLs, `lang="en"`, and a designed HTTP-404 page. The site includes favicon, touch icon, OG art, manifest, robots, and sitemap.
- The visible internal routes, fragment targets, checkout redirect, and Param Factory link all resolved. Header/footer, skip link, Privacy, and Terms are consistent.
- `npm test` passed (80 tests); `npm run test:unit` passed (9 tests); `npm run build` passed and produced `dist/`. The built JS is 28.30 kB raw / 9.90 kB gzip and CSS is 14.18 kB raw / 4.20 kB gzip.
- The app remains visually distinct: the glacial/porcelain palette, asymmetric ceramic surfaces, original still-life, serif recall prompts, and restrained motion match `.factory/design.md`; it is not a generic SaaS layout.
- The brief’s obvious leverage is present: manual/feed capture, recall scheduling, exports/import, local persistence, and a calendar reminder. AI-generated questions would conflict with the explicit learner-written retrieval practice, so no AI omission is found. No provider key or decorative AI implementation was found.

## What would make this perfect

Make every way out of demo discard its separate database, add the direct-anchor regression test described in F-3-1, and rerun all claim commands plus the cold mobile/desktop review. No further finding was identified.
