# Independent verification 11 — Podcast Recall Loop

## Verdict: PASS

- Candidate commit: `aa70a8fa3f68e8d84ec3d15f57df2d6a0571f841`
- Live URL: <https://podcast-recall-loop.sociobot.in>
- Verification date: 2026-08-29 UTC
- Scope: clean local install/build/test plus independent production checks. No product code was modified.

## First-read gate

**Passed.** On a cold production load, the first screen says **“Remember what your podcasts taught you”**, then “For curious listeners who save good moments but forget the ideas.” It says what the product does, who it is for, and presents the primary one-click action **“Try it with sample data”** (`/?demo=1`). The three plain facts are visible at 390×844: notes stay in the browser, reviews work offline after the first visit, and the free library holds eight clips.

The live demo opened in one click with five realistic sample clips, three due questions, a persistent “Demo — sample data, nothing is saved to your notes” banner, Reset demo, and Start for real.

## Claims gate

`.factory/claims.json` exists and defines 28 claims. From the clean candidate checkout after `npm ci`, I executed every listed command individually, using the shipped demo entry point where specified. All 28 passed; Playwright’s final result was `{"status":"passed","failedTests":[]}`.

This included offline reload, demo isolation/reset, RSS and Atom lookup, explicit feed-request timing, three-question daily limit, CSV/Markdown/JSON exports, import recovery, free-limit boundary, local privacy, no-account flow, persistence, no-audio storage, manual authorship, calendar file, PWA installability, billing/restore/storage, and build-coupled service-worker updates.

## Local quality gates

| Check | Result |
| --- | --- |
| `npm ci` | passed; 0 audited vulnerabilities |
| `npm test` | passed, 88/88 Playwright tests |
| `npm run test:unit` | passed, 16/16 Vitest tests |
| `npm run build` | passed; TypeScript check and production `dist/` build succeeded |
| Lint | no lint script is defined in `package.json` |
| Initial JS/CSS gzip | 10,819 B / 4,205 B (within 200 KB / 50 KB budgets) |

## Production verification

- The live JS, CSS, `sw.js`, and manifest SHA-256 hashes exactly matched the fresh `dist/` build. The production asset names also match (`index-DzFamtYO.js`, `index-CB1EBUkx.css`), so the deployment is this candidate’s product build, not merely a previous build.
- Independent live-browser run passed with zero errors. `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200; `/missing-page` returned 404. Each had the expected route title, one `h1`, one `main`, canonical/OG metadata, and no serious or critical axe findings.
- Desktop and 390px mobile passed without horizontal overflow. The keyboard smoke test found the skip link first, with a visible `rgb(138, 88, 20) solid 3px` focus outline; Enter moved focus to `main`. Interactive controls inspected on the landing page were at least 44px high. Reduced-motion media is honored (`scroll-behavior: auto`; transitions/animations reduced to 0.01ms).
- Production demo completed 1 → 2 → 3 → caught up, persisted after reload, Reset restored the sample, and offline reload left the review usable. Service-worker update behavior is additionally covered by the passing build-coupled claim test.
- Request logs during the cold home/demo and demo-isolation flows contained no off-origin requests. The local `local-privacy` claim also passed while saving, reloading, exporting, importing, and deleting a real note. RSS addresses are contacted only after the explicit Find episodes action. No audio/video elements or media requests were observed in the metadata-only claim.
- Headers: HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, permissions policy, and CSP with `frame-ancestors 'none'` are present. Hashed assets are `max-age=31536000, immutable`; `sw.js` is `no-cache, no-store, must-revalidate`; the manifest is revalidated hourly.
- Mobile Lighthouse against production: Performance 91, Accessibility 100, Best Practices 100, SEO 100; LCP 1.6 s, CLS 0, TBT 360 ms.
- All discovered internal links (`/`, `/?demo=1`, `/app`, `/demo`, `/privacy`, `/terms`) returned 200.
- The Sociobot checkout endpoint returned a 303 with a Location header. The product has no server-side API of its own (static PWA); product-side rate-limit testing is therefore not applicable. No sign-in flow is present.

## Defects

None found. No release-blocking claim, functional, privacy, accessibility, performance, deployment-identity, or documentation defect was reproduced.

