# Independent verification 10 — PASS

**Candidate:** `0a0979298bf2b61d675d13783e5c503145e8ce0c`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>  
**Verified:** 29 August 2026 UTC from a clean checkout

## Release decision

**PASS.** The deployed JavaScript and service worker are byte-identical to the
fresh production build of the candidate. The mandatory claims suite, local
quality gates, cold-read/demo gate, end-to-end PWA flow, privacy checks,
accessibility checks, performance audit, and license-gateway allowance check
all passed. The earlier deployment-only failure is not reproducible.

## Mandatory claims and local gates

`.factory/claims.json` is present with 27 claims. After `npm ci` (61 packages,
zero audit vulnerabilities), I ran every declared command individually through
the shipped demo entry point. All completed successfully; the final
`test-results/.last-run.json` records `{"status":"passed","failedTests":[]}`.

| Claims | Result |
| --- | --- |
| `offline-reload`, `demo-isolation`, `demo-seed-reset`, `rss-lookup`, `feed-explicit-request`, `atom-lookup`, `daily-three` | PASS |
| `csv-export`, `markdown-export`, `free-limit`, `free-reviews-exports`, `local-privacy`, `no-account`, `browser-persistence` | PASS |
| `metadata-only`, `manual-authorship`, `json-backup`, `invalid-backup-recovery`, `spaced-schedule`, `review-results`, `calendar-reminder` | PASS |
| `installable-pwa`, `existing-license`, `one-time-unlimited`, `license-restore`, `build-coupled-updates`, `sociobot-billing` | PASS |

Additional commands:

```text
npm test             PASS — 86 Playwright tests (desktop and 390px projects)
npm run test:unit    PASS — 15/15 Vitest tests
npm run build        PASS — TypeScript check, Vite production build, SW finalizer
```

There is no separate lint script. The build contains `tsc --noEmit` and
produced `dist/`. Initial assets are 31,480 bytes raw / 10,811 bytes gzip JS
and 14,177 bytes raw / 4,209 bytes gzip CSS, within the static-PWA budgets.

## First-read, demo, and product flow

A storage-free cold visit to the live landing page answers the required three
questions in plain language:

- **What:** “Remember what your podcasts taught you.”
- **Who:** “For curious listeners who save good moments but forget the ideas.”
- **First action:** the visible one-click **Try it with sample data** action,
  explained as opening five fictional sample clips with no setup.

The action opened isolated demo mode with the persistent “Demo — sample data,
nothing is saved to your notes” banner, five clips, three due questions, Reset
demo, and Start for real. The independent live audit completed the 1→2→3
review sequence, reached “You are caught up for today,” survived reload,
reset to the original seed, and confirmed no horizontal overflow at 390px.

On the real `/app` flow, a listener-written podcast, episode, `1:02:03`
timestamp, question, takeaway, and episode URL saved and survived reload.
The boundary value `99:99` was rejected by native pattern validation with
“Please match the requested format.” Passing claims independently cover RSS
and Atom lookup, invalid-backup recovery, free-limit refusal, CSV/Markdown/
JSON export and import, calendar export, scheduling, and offline reload.

## Deployment, PWA, privacy, and security

The live HTML references `assets/index-BkeyvWx-.js`, and direct SHA-256
comparison matched local production output:

| Artifact | SHA-256 |
| --- | --- |
| `assets/index-BkeyvWx-.js` | `aaa4467ec99517d86fc3dff3e510e735d402c9632098ba267d8d85601397fa76` |
| `sw.js` | `fa2f86da9e997d98409d3509dec113cb48c258516672a49caed7f005479bde17` |

The live PWA acquired one controlling `/sw.js` registration. After calling
`registration.update()`, reloading, and setting the browser offline, `/demo`
reloaded with its demo banner, recall heading, and Reveal action intact.

Fresh Playwright request logs for the landing/demo flow and the repository's
full demo-isolation audit recorded only `https://podcast-recall-loop.sociobot.in`.
The seeded real note and license remained byte-identical after demo entry with
a license query, Restore exit, and Start-for-real exit. No tracking, audio,
media, authentication, or note-data request was observed. The app has no
sign-in flow, so the Entra tenant condition is not applicable.

Live headers include HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, restrictive permissions
policy, and a CSP with `frame-ancestors 'none'`. HTML uses 30-second
revalidation, hashed assets are one-year immutable, and `sw.js` is
`no-cache, no-store, must-revalidate`. The designed missing route returns HTTP
404. The Sociobot checkout endpoint returned HTTP 303 to hosted checkout; no
payment-provider URL is embedded in the app.

For the required server allowance check, 40 rapid invalid license-verification
requests from one client returned HTTP 200 for requests 1–30. Request 31 and
subsequent requests returned HTTP 429 with `Retry-After` (initially `0`, then
`4` and `3` seconds). **Observed allowance: 30 verification requests per
client window.**

## Accessibility, keyboard, mobile, and performance

`/opt/fleet/lib/verify-url.sh` passed cold live `/`: HTTP 200, 795 ms load,
zero console errors, `lang=en`, one `<h1>`, one `<main>`, no missing image alt
text, and no unlabeled buttons. The repository's independent live browser
audit passed `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the HTTP 404
route: correct title/canonical/Open Graph metadata, one main/h1, legal links,
Back scroll restoration/focus, and zero serious or critical Axe issues.

At desktop and 390px mobile, keyboard Tab reached the demo controls, home,
navigation, review control, and form controls in order; each inspected target
had a solid visible focus outline. Reduced-motion browser contexts loaded and
completed the recall flow without error. Playwright Axe integration found zero
violations on the demo at both widths; the standalone Selenium-based
`@axe-core/cli` could not start Chromium in this container, but the equivalent
in-browser Axe scan passed and the repository audit uses that supported path.

Fresh mobile Lighthouse: **Performance 99, Accessibility 100, Best Practices
100, SEO 100**; FCP 1.1 s, LCP 1.1 s, CLS 0, TBT 120 ms, and interactive
1.4 s.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

## Reproduction

```sh
npm ci
npm test
npm run test:unit
npm run build
node scripts/verify-live.mjs https://podcast-recall-loop.sociobot.in /tmp/podcast-verify-live
```
