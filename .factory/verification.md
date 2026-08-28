# Independent verification — FAIL

**Candidate:** `571773ed0427f222db7847751cf8b3b54cb44edc`  
**Live URL:** https://podcast-recall-loop.sociobot.in  
**Verified:** 2026-08-28

## Decision

**FAIL — do not release this candidate.** The free, local-first recall loop is substantially functional, and the live files exactly match this commit. However, the advertised paid checkout is a live 404; `npm run test:unit` fails; and the site exposes dead links. Those fail the factory's end-to-end, quality-gate, and no-dead-links requirements.

## Mandatory preflight

`.factory/claims.json` exists and every declared command was run from this checkout against the demo entry point. Each passed in both configured projects (desktop Chromium and 390×844 mobile Chromium):

| Claim | Command result |
| --- | --- |
| `offline-reload` | PASS — 2 tests |
| `demo-isolation` | PASS — 2 tests |
| `rss-lookup` | PASS — 2 tests |
| `daily-three` | PASS — 2 tests |
| `csv-export` | PASS — 2 tests |
| `markdown-export` | PASS — 2 tests |
| `free-limit` | PASS — 2 tests |
| `local-privacy` | PASS — 2 tests |

Cold first-read of production passed: it says it helps “curious listeners who save good moments but forget the ideas” remember podcast ideas, and the first action is **Try it with sample data**, with “Loads five podcast clips. No setup.” immediately beside it. The one-click demo opens at `/demo` with the required persistent demo banner, reset, and start-for-real actions.

## Local checks

- `npm ci`: PASS, 0 reported vulnerabilities.
- `npm test`: PASS, **36 passed** in 1.2 minutes.
- `npm run build`: PASS. `tsc --noEmit` and Vite completed; `dist/` was produced.
- No separate lint script is declared.
- `npm run test:unit`: **FAIL**. Vitest scans `tests/claims.spec.ts` and `tests/quality.spec.ts`, then fails with `Playwright Test did not expect test() to be called here`; 2 suites fail and 0 tests run.

The tested normal and recovery paths behaved correctly in a clean browser profile: RSS fixture lookup fills fields; a normal clip saves and survives reload; an unreadable but syntactically valid RSS URL says to check the address or enter fields manually; invalid timestamp input is rejected by native validation; malformed JSON import shows its recovery toast; delete can be cancelled or confirmed; CSV/Markdown export, eight-clip limit, three-due review queue, demo reset, and real/demo isolation all passed.

## Live deployment, privacy, and PWA

- Fresh local production build and live `index.html`, `assets/app-v1.js`, `assets/app-v1.css`, and `sw.js` have identical SHA-256 hashes. The deployment concern is not reproducible.
- Production route checks returned 200 for `/`, `/demo`, `/app`, `/privacy`, `/terms`, `/missing-page`, manifest, service worker, robots, sitemap, and static config.
- Fresh production first load requested only same-origin HTML, JS, CSS, and hero art. The demo recall flow made no third-party request. There is no sign-in flow.
- The service worker became active and controlled the page after reload. The explicit offline claim passed in both browser projects: after first visit and reload, `/demo` reloads offline with saved queue controls. The update toast/`SKIP_WAITING` path is present in code; an update was not available during this verification.
- `prefers-reduced-motion: reduce` yielded `0.01ms` transition and animation durations. At 390px there was no horizontal overflow.
- Live Axe checks on `/`, `/demo` at 390px, `/app`, `/privacy`, `/terms`, and `/missing-page` found no serious or critical violations. Each had exactly one `h1`, one `main`, the expected route title, and no console or page errors. Keyboard smoke checks (skip link, demo activation, reveal) passed in the full suite.
- Live response headers include HSTS, `nosniff`, strict-origin referrer policy, a restrictive CSP, and permissions policy. Manifest is served as `application/manifest+json`.
- Initial payload is 9.09 KB gzip JS, 4.08 KB gzip CSS, and 24.3 KB hero WebP, within the stated asset budgets. A Lighthouse report was generated with 97 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.3 s, CLS 0, TBT 30 ms. The Lighthouse CLI then reported a post-audit browser-tab crash while closing, so the report is supporting rather than sole evidence.
- Production applies `cache-control: public, must-revalidate, max-age=30` even to JS/CSS. This does not meet the stated long-lived immutable caching policy for static assets.

## API and rate limit

The only product API used by the browser is Sociobot license verification. A single invalid-license verification returned 200 with `{ "valid": false }` and correct production-origin CORS. A burst of 40 invalid verification requests returned **29× 200 and 11× 429**; 429 responses carried `Retry-After: 4`. The observed threshold was approximately 30 requests in the active rate-limit window (including a preceding single request). This requirement passes.

## Defects

### High — paid feature is advertised but cannot be bought

`GET https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout` returns **404** with `{"error":"enabled factory product","status":404}`. The landing page offers “Buy unlimited — $9 once”, but checkout cannot start. Register/enable the product and verify the complete checkout → return-license → verification path before release.

### High — declared unit-test command fails

`package.json` exposes `test:unit`, but `npm run test:unit` fails because Vitest includes Playwright spec files. Configure Vitest to exclude Playwright tests or remove the unusable script, then run it successfully from a clean install.

### High — claim coverage is incomplete under the supplied claims contract

The landing/README make additional user-reliance claims not listed in `.factory/claims.json` with an observable demo test. Examples include “Notes stay in this browser”, “Unlimited is $9 once”, “It does not copy or host audio”, and “There is no transcription, generated quiz, account, analytics, or social feed.” The supplied claims rule requires every such claim to be listed and tested or removed. Add isolated tests (or remove/reword the claims) before release.

### Medium — dead sample episode links

The demo’s visible “Open episode” links point to:

- `https://example.com/episodes/retrieval` — 404
- `https://example.com/episodes/small-habits` — 404
- `https://example.com/episodes/public-trust` — 404

Use working sample URLs or omit the link from fictional sample data. This violates the no-dead-links requirement.

### Medium — footer link has an invalid TLS hostname

The visible external footer link is `https://www.sociobot.in/`. Its certificate does not cover `www.sociobot.in`, so a standards-compliant client rejects the connection. Point it to the valid canonical factory URL and verify it returns 200.

### Medium — static assets are not long-lived cached

Live JS, CSS, manifest, and service-worker responses use only `max-age=30`, not long-lived immutable caching. Adopt fingerprinted asset names and immutable cache headers while retaining versioned service-worker updates.

## Required re-verification

After repairs, re-run every claims command, `npm test`, the repaired unit command, `npm run build`, the checkout flow, all visible links, offline reload, and live artifact/hash/header checks. Re-run this verification as a new report rather than changing this evidence.
