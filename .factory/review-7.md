# Adversarial first-read review 7 — Podcast Recall Loop

**Verdict: FAIL**

**Reviewed:** 29 August 2026 UTC  
**Candidate checkout:** `7f9d0a04ca57561d0c6a4643c55e2831f87f3d0d`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>

One visitor-facing privacy statement remains broader than the behavior and its
claim test. A PASS requires zero findings.

## Finding

### Minor

#### F-7-1 — License-network wording promises a daily cap that manual verification does not keep

- **Exact quote/location:** `/privacy` → **When the app uses the network**:
  “A license check sends your token to Sociobot at most once each day.”
- **Observed:** in a fresh live browser context, I opened **Restore a license**,
  entered the same fixture token, and pressed **Verify license** twice without
  waiting a day. The intercepted Sociobot verification endpoint received **two**
  requests. Both actions showed “License verified. Unlimited clips are active.”
  `restoreLicense()` sends on each explicit form submission.
- **Why this fails:** the sentence is not limited to the automatic recheck of
  an already stored license. A reader can reasonably rely on it as the total
  number of token transmissions. The registered `existing-license` claim
  proves only that the automatic recheck after storage/reload happens at most
  once daily; it does not prove this wider privacy sentence. This is a
  claim-scope mismatch, so the privacy disclosure is not exact.
- **Concrete fix:** rewrite it as **“After you restore a license, the app
  automatically checks the stored license at most once each day.”** Keep the
  existing `@claim:existing-license` assertion for automatic reloads, and add
  an assertion that two explicit **Verify license** submissions are separate
  user-requested checks (or throttle them if the intended promise is a total
  daily cap).

## Cold first-read gate

Fresh empty Chromium contexts opened the live home page at 390×844 and
1440×900. This was assessed before scrolling.

| Question | Answer from the first screen | Result |
| --- | --- | --- |
| What does this do? | It helps a listener turn podcast moments into self-written questions to recall later: **“Remember what your podcasts taught you.”** | Pass |
| For whom? | Listeners who save useful podcast moments but forget the ideas: **“For curious listeners who save good moments but forget the ideas.”** | Pass |
| What should I click first? | **“Try it with sample data.”** The adjacent copy says it opens five fictional sample clips with no setup. | Pass |

At 390px, the primary action and all three facts appeared above the artwork;
there was no horizontal overflow. The porcelain still life, glacial palette,
serif recall prompts, timestamp marks, and uneven ceramic cards match the
recorded visual thesis and are distinct from a generic SaaS template.

## Copy audit

Counting method: visible copy units, headings, labels, and standalone
sentences are included. Hyphenated forms, prices, versions, URLs, and
slash-separated navigation labels count as one word. No landing or README
entry exceeds 22 words. No banned marketing adjective, unexplained
visitor-facing RSS/PWA/IndexedDB term, mood-only heading, inconsistent core
term, or non-result-naming product button was found. The privacy copy in
F-7-1 is outside the requested landing/README audit.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | Pass — destination |
| Podcast Recall Loop | 3 | Pass — wordmark |
| Recall / Demo / Privacy | 1 each | Pass — destinations |
| Podcast recall for long listens | 5 | Pass — use-case label |
| Remember what your podcasts taught you | 6 | Pass — clear job h1 |
| For curious listeners who save good moments but forget the ideas. | 11 | Pass — audience and outcome |
| Try it with sample data | 5 | Pass — result action |
| Opens five sample clips from fictional shows. | 7 | Pass — `demo-seed-reset` |
| No setup. | 2 | Pass — one-click/no-account flow |
| Add a podcast feed | 4 | Pass — real first step |
| Notes stay in this browser. | 5 | Pass — privacy/persistence claims |
| Reviews work offline after your first visit. | 7 | Pass — `offline-reload` |
| The free library holds eight clips. | 6 | Pass — `free-limit` |
| Three porcelain pieces arranged in a quiet recall loop. | 9 | Pass — useful image alternative |
| Save a podcast moment. | 4 | Pass — workflow caption |
| Write a question. | 3 | Pass — workflow caption |
| Recall it later. | 3 | Pass — workflow caption |
| Today’s recall | 2 | Pass — section label |
| Write your own recall question | 6 | Pass — specific heading |
| You write the question while the idea is fresh. | 9 | Pass — `manual-authorship` |
| The recall queue brings it back later. | 7 | Pass — `spaced-schedule` |
| 12:34 · Why retrieval beats rereading | 5 | Pass — sample context |
| Why does retrieving an idea strengthen memory? | 7 | Pass — realistic sample question |
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
| What the app stores | 4 | Pass — section heading |
| Your audio stays where it is | 6 | Pass — storage boundary heading |
| The app reads podcast titles from the feed address you request. | 11 | Pass — feed-request claims |
| It stores written notes, not audio. | 6 | Pass — `metadata-only` |
| You write every question and takeaway. | 6 | Pass — `manual-authorship` |
| You do not need an account. | 6 | Pass — `no-account` |
| Unlimited clip license | 3 | Pass — section heading |
| Unlimited clips for $9 once | 5 | Pass — `one-time-unlimited` |
| The one-time license removes only the clip limit. | 8 | Pass — `existing-license` |
| Reviews and exports stay free. | 5 | Pass — `free-reviews-exports` |
| Buy unlimited — $9 once | 5 | Pass — result action |
| Restore a license | 3 | Pass — result action |
| License token | 2 | Pass — label |
| Verify license | 2 | Pass — result action |
| Paste the token from your purchase email. | 7 | Pass — instruction |
| Sociobot handles checkout. | 3 | Pass — `sociobot-billing` |
| Three podcast ideas, recalled daily. | 5 | Pass — `daily-three` |
| Privacy / Terms | 1 each | Pass — destinations |
| Built by Param Factory (opens in a new tab) | 9 | Pass — external-link disclosure |
| Version 1.0.7 | 2 | Pass — build identifier |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Podcast Recall Loop | 3 | Pass — title |
| Turn podcast moments into three daily recall questions. | 8 | Pass — `daily-three` |
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
| A $9 one-time license for unlimited clips through Sociobot checkout | 10 | Pass — billing claims |
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
| The Playwright suite checks every claim, offline reload, keyboard use, mobile width, route structure, and serious accessibility findings. | 18 | Pass — rerun |
| Vitest covers data and release configuration. | 6 | Pass — rerun |
| The production command writes `index.html` and fingerprinted static assets to `dist/`. | 11 | Pass — build |
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
| The browser storage implementation uses IndexedDB. | 6 | Pass — developer-only term |
| The app reads RSS and Atom feeds only after you press Find episodes. | 11 | Pass — feed claims |
| Project notes | 2 | Pass — heading |
| `.factory/design.md` records the visual system and generated-art provenance. | 8 | Pass — repository note |
| `.factory/demo.md` documents demo isolation. | 4 | Pass — repository note |
| `.factory/claims.json` maps claims to executable tests. | 6 | Pass — repository note |
| `.factory/handoff.md` records final verification. | 4 | Pass — repository note |
| Licensed under the MIT License. | 5 | Pass |

Terminology is consistent: **clip** (saved timestamp/question/takeaway),
**recall question** (learner cue), **takeaway** (learner answer), **recall
queue** (due questions), **demo** (isolated sample workspace), and **podcast
feed** (metadata source).

## Demo, sandbox, and privacy verification

- The first-screen action opened `/?demo=1` in one click. The first settled
  screen already showed five fictional-but-realistic clips, three due questions,
  a prompt, a persistent **“Demo — sample data, nothing is saved to your
  notes.”** banner, **Reset demo**, and **Start for real**.
- Revealing and answering moved the queue from Question 1 to 2 to 3, then the
  caught-up state. Reset restored five clips and Question 1. Offline reload
  kept the review control available.
- A live seeded-real-library comparison byte-matched real IndexedDB and the
  real license keys before/during demo mutation. Restore and Start-for-real
  exits discarded demo changes and restored the real library.
- Cold home/demo and demo-isolation request logs contained only the product
  origin. The local saved-note privacy claim also passed through save, reload,
  export, import, and delete. Explicit feed lookup is separately fixture-tested.

## Claims execution

After `npm ci`, I ran each of the 28 commands declared in
`.factory/claims.json` independently in this checkout. All passed. Each
registry ID occurs exactly once as a shipped `@claim:<id>` tag.

| Passing claim IDs |
| --- |
| `offline-reload`, `demo-isolation`, `demo-seed-reset`, `rss-lookup`, `feed-explicit-request`, `atom-lookup`, `daily-three` |
| `csv-export`, `markdown-export`, `free-limit`, `free-reviews-exports`, `local-privacy`, `no-account`, `browser-persistence` |
| `metadata-only`, `manual-authorship`, `json-backup`, `invalid-backup-recovery`, `spaced-schedule`, `review-results` |
| `calendar-reminder`, `installable-pwa`, `existing-license`, `one-time-unlimited`, `license-restore`, `license-storage`, `build-coupled-updates`, `sociobot-billing` |

F-7-1 does not report a failing declared command; it reports that the live
privacy sentence reaches beyond the already-passing automatic verification
claim.

## Earlier findings rechecked

Every earlier `review-*`, `polish-*`, and handoff file was read. Each finding
was checked against current source and the live deployment rather than accepted
from the prior fixed label.

| Earlier finding | Current verification | Status |
| --- | --- | --- |
| F-1-1 | Demo chooses its database before license handling; seeded real state remained byte-equal. | Fixed |
| F-1-2 | Start-for-real clears demo state before real-library navigation. | Fixed |
| F-1-3 | Five sample clips and Reset are listed and observed. | Fixed |
| F-1-4 | Checkout fixture asserts slug, USD, one-time billing, and 900 cents. | Fixed |
| F-1-5 | All checked routes have distinct titles, descriptions, canonicals, and OG/Twitter URLs. | Fixed |
| F-1-6 | Preview heading is **Write your own recall question**. | Fixed |
| F-1-7 | Visitor copy says podcast feed/address and supplies manual entry. | Fixed |
| F-1-8 | Reader copy says this browser; IndexedDB is developer-only. | Fixed |
| F-1-9 | User documentation names installation/offline behavior without PWA jargon. | Fixed |
| F-1-10 | Answer-dependent scheduling is explicit and both paths are covered. | Fixed |
| F-1-11 | **Restore a license** names its result and focuses the input. | Fixed |
| F-1-12 | `/app` exports a tested local daily calendar reminder. | Fixed |
| F-2-1 | Feed requests begin only after the visible Find episodes action. | Fixed |
| F-2-2 | Atom lookup fills podcast, episode, and link from its fixture. | Fixed |
| F-2-3 | Back restores scroll and focuses the destination h1. | Fixed |
| F-3-1 | The exact Restore exit also disposes changed demo data. | Fixed |
| F-4-1 | A daily snapshot stays capped at three and does not refill that day. | Fixed |
| F-4-2 | Fresh demo begins at Question 1 of 3. | Fixed |
| F-4-3 | Privacy request logging covers real save, reload, export, import, and delete. | Fixed |
| F-4-4 | README accurately calls the destination a separate real library. | Fixed |
| F-4-5 | The hero caption states the capture/question/recall task. | Fixed |
| F-4-6 | README/package Node range is precise and release-tested. | Fixed |
| F-5-1 | Footer contains the public version only; no inaccessible design-notes reference remains. | Fixed |
| F-6-1 | Privacy policy names both the stored token and daily verification result; `license-storage` proves the boundary. | Fixed |

## Structure, accessibility, and links

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200; `/missing-page`
  returned a styled 404 with **Return home**. Each had one h1, one main,
  route-specific plain title/description/canonical/OG/Twitter metadata,
  consistent header/footer, and no normal-route console errors.
- `robots.txt`, sitemap, SVG favicon, apple-touch icon, product 1200×630 OG
  art, manifest, theme colour, security headers, and SPA fallback are live.
- Direct-route navigation, Back scroll restoration (1200px), h1 focus,
  visible skip-link focus, dark theme, reduced motion, 44px targets, 390px
  width, and zero serious/critical Axe findings all passed.
- The dynamic link crawl found every normal internal destination at 200,
  Sociobot checkout at its expected 303, and the Param Factory link at 200.
  The missing-page self-fragment is an in-document skip target on the intended
  404 response, not a dead destination.

## Missed leverage and AI check

No omitted feature is required by the brief. Feed/manual capture, timestamp
notes, learner-authored recall questions, daily scheduling, local exports and
backup restore, offline review, and a calendar reminder cover the useful loop.
Sync would change the local-first privacy model. AI-authored questions would
contradict the brief's learner-written retrieval practice. No provider key,
Azure endpoint, Sociobot model call, or decorative AI feature was found.

## What would make this perfect

Make the privacy sentence distinguish automatic daily license rechecks from
explicit verification, and protect that wording with the targeted assertion
described in F-7-1. Then rerun the claim, full test/build suite, and live
privacy smoke check. Nothing else remains open.
