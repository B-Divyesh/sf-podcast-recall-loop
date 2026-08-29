# Independent verification 9 — PASS

**Candidate:** `b3e2c6a6a2f72b2b31801feab83ccce04651f7f5`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>  
**Verified:** 29 August 2026 (fresh clone)

## Release decision

**PASS.** The live static artifacts are byte-for-byte the production build from
this candidate. All declared claims, local quality gates, the real capture and
recall flow, PWA offline reload, privacy/request checks, accessibility checks,
and the Sociobot licensing boundary passed. The earlier deployment-only
failure is not reproducible.

## First-read and demo gate

Cold desktop live page, with no storage, clearly states:

- What it does: **“Remember what your podcasts taught you.”**
- Who it is for: **“curious listeners who save good moments but forget the
  ideas.”**
- What to do first: the visible, one-click **“Try it with sample data”**
  action, immediately explained as opening five fictional sample clips with no
  setup.

The click opened `/?demo=1`, showed the persistent **“Demo — sample data,
nothing is saved to your notes”** banner, five sample clips, and three due
questions. Reset restored the original five/three state. This passes the
plain-words and demo-sandbox release gate.

## Mandatory local gates

`npm ci` completed from the clean candidate (61 packages, zero reported
vulnerabilities). `.factory/claims.json` exists and contains 27 unique ids;
each appears exactly once as `@claim:<id>` in the shipped tests. I ran the
declared per-claim commands against the demo entry point. The complete
Playwright run also completed with `test-results/.last-run.json` reporting
`{"status":"passed","failedTests":[]}`.

| Claim | Result |
| --- | --- |
| offline-reload | PASS |
| demo-isolation | PASS |
| demo-seed-reset | PASS |
| rss-lookup | PASS |
| feed-explicit-request | PASS |
| atom-lookup | PASS |
| daily-three | PASS |
| csv-export | PASS |
| markdown-export | PASS |
| free-limit | PASS |
| free-reviews-exports | PASS |
| local-privacy | PASS |
| no-account | PASS |
| browser-persistence | PASS |
| metadata-only | PASS |
| manual-authorship | PASS |
| json-backup | PASS |
| invalid-backup-recovery | PASS |
| spaced-schedule | PASS |
| review-results | PASS |
| calendar-reminder | PASS |
| installable-pwa | PASS |
| existing-license | PASS |
| one-time-unlimited | PASS |
| license-restore | PASS |
| build-coupled-updates | PASS |
| sociobot-billing | PASS |

Additional clean local gates:

```text
npm test             PASS — 82 Playwright tests, desktop + 390px projects
npm run test:unit    PASS — 15/15 Vitest tests
npm run build        PASS — TypeScript check, Vite build, service-worker finalizer
```

There is no separate lint command; `tsc --noEmit` is part of the exact
production build. `dist/` was produced. Initial JavaScript is 31,528 bytes
raw / 10,835 bytes gzip, CSS is 14,177 bytes raw / 4,205 bytes gzip, and the
responsive hero assets are 9,764 and 24,292 bytes. All are within the static
product budgets.

## Independent live product checks

- On desktop, Reveal moved focus to the revealed-answer container; **I
  remembered** reduced the queue from three to two. Reset then restored three
  due questions.
- On `/app`, a normal `1:02:03` timestamp saved a learner-authored question
  and takeaway. `61:99` was blocked by native format validation. Empty feed
  lookup announced **“Enter the podcast feed address, then try again.”**
- The prior release blocker was independently rechecked: after saving **“Does
  a bad backup keep my good note?”**, importing `{"clips":[{}]}` announced
  **“That backup could not be read. Choose a Recall Loop JSON file.”** The
  saved note remained after reload and no page error occurred.
- CSV, Markdown, JSON backup, and the daily calendar download are covered by
  passing observable-download claims. RSS and Atom parsing are covered with
  local fulfilled feed fixtures, avoiding uncontrolled third-party requests.
- The checkout link is the Sociobot endpoint only. Live `HEAD` returned 303
  to the hosted checkout; no payment-provider URL is embedded in the app.

## Privacy, security, and rate limiting

Fresh Playwright request logs for the cold page, demo review/reset, real note
save, invalid import, and reload contained only the product origin. There were
no tracking, authentication, media, or note-data requests. The product has no
sign-in flow, so the Entra tenant requirement is not applicable. Feed requests
are deferred until the user explicitly presses **Find episodes**, as protected
by `feed-explicit-request`.

Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin
referrer policy, restrictive permissions policy, and a CSP with
`frame-ancestors 'none'`. HTML revalidates in 30 seconds; hashed JS is
one-year immutable; `sw.js` is `no-cache, no-store, must-revalidate`; the
manifest is `application/manifest+json`. `/missing-page` returns the designed
document with HTTP 404.

The factory license verifier was probed with one invalid token from one client:
requests 1–30 returned 200, requests 31–35 returned 429, and a further
response included `Retry-After: 2`. Observed allowance: **30 verification
requests per client window**.

## Deployment identity, PWA, accessibility, and performance

The live files exactly matched the fresh production output:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `72b0bbace67d157ecfde4402a616c341cda43f7ac9808c281fcc2a912272a210` |
| `assets/index-CQObdu8s.js` | `c46f5a91af73206778d4b1b285bcf5dac615e2cb07a728f09cce05b9d7e6204a` |
| `assets/index-CB1EBUkx.css` | `0fe67a484500db387d9f8fa012dddb5262beae4480df82037febdbf270d14078` |
| `sw.js` | `adf5c94fa1430d1b954f95da025db791cbc943e487bd9cdb40ae79a7a7e7d526` |
| `manifest.webmanifest` | `ddb62c03a08c126a72cf88baecd1aded25308a2823b4c60c62191d0ad953e05b` |

The manifest is standalone and the live demo acquired a controlling `/sw.js`
with cache `recall-loop-shell-72b0bbace67d`. `registration.update()` found no
waiting worker (the deployment is current). After that first visit, a 390px
browser reloaded the demo offline, displayed the offline notice, and retained
the Reveal action. The build-coupled worker claim passed, proving changed app
asset fingerprints create a new worker/cache identity.

`verify-url.sh` passed on live `/` (621 ms) and `/demo` (723 ms): title,
`lang=en`, one `h1`, one `main`, image alt text, and console errors were all
clean. Fresh live Axe scans of `/`, `/demo`, `/app`, `/privacy`, `/terms`, and
the 404 route found zero serious or critical violations. Keyboard-only smoke:
Tab reaches Skip to main content; Enter moves focus to the recall page heading;
Reveal focuses its answer container. At 390px, `scrollWidth === clientWidth ===
390`; reduced-motion reports 0.00001s durations and `scroll-behavior: auto`.

Mobile Lighthouse produced Performance 98, Accessibility 100, Best Practices
100, and SEO 100 (FCP 1.9 s, LCP 1.9 s, CLS 0, TBT 0 ms, 27 KiB transfer). The
Lighthouse process returned non-zero only after the complete JSON report was
written because its BFCache audit tab crashed (`TARGET_CRASHED`); this was a
tool/browser shutdown issue, not a page error. The reported audit values and
independent Playwright checks are complete.

## Defects and known gaps

No critical, high, medium, or low release defects found. An actual old-build to
new-build production worker replacement cannot be observed while only one live
build is deployed; it is covered by the passing build-coupled update test and
the current worker's `registration.update()` check.
