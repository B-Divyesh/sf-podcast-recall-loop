# Podcast Recall Loop — repair 3 handoff

## Release status

**PASS — deployed and verified.**

- Independent report repaired: `4ba46a3342be307a21ee15eba5a75fee9c0386ed` (`.factory/verification-3.md`)
- Original candidate: `35723d590f33cd30645f1068d55b291196db9ef8`
- Repair commit: `01ae95e` (`fix: cover public product claims`), pushed to `main`
- Live URL: <https://podcast-recall-loop.sociobot.in>
- Static deployment: `7c0f9c32-884e-429e-a999-443c6bb09432` to the existing Standard Static Web App
- Verified: 28 August 2026

## Release-blocking finding disposition

| Verifier finding | Root-cause repair | Exact regression coverage |
| --- | --- | --- |
| “The app has no account or tracking” had no test proving the no-account portion | Narrowed the public sentence to “You do not need an account.” The existing `local-privacy` claim continues to prove that a demo review flow makes no cross-origin tracking or note-data requests. | New `@claim:no-account` starts from clean `/demo`, proves no credential controls or authentication requests exist, and completes a review without an account. |
| “Sociobot … handles refunds” was not observable from the product | Removed the unprovable refund and merchant-of-record promise from the landing page, README, and terms. The retained, observable statement is “Sociobot handles checkout.” | Existing `@claim:sociobot-billing` verifies the exact Sociobot checkout endpoint and the absence of an embedded payment-provider link. Live checkout returned HTTP 303. |
| “Reviews, exports, and accessibility stay free” lacked a single test of the free real product behavior | Kept the product behavior and narrowed the pricing copy to the observable promise “Reviews and exports stay free.” Accessibility remains ungated product behavior covered by the accessibility suite. | New `@claim:free-reviews-exports` begins in clean `/demo` with no license, completes a review, and downloads CSV. |

Each of the 21 entries in `.factory/claims.json` now has exactly one `@claim:<id>` occurrence in the shipped tests. The original feature set, eight-clip free limit, paid unlimited license, local storage, demo isolation, RSS lookup, exports, PWA, and visual system were preserved.

## Verification

From a clean install:

```sh
npm ci
npm test
npm run test:unit
npm run build
npm audit --audit-level=high
```

- `npm ci`: PASS — 61 packages installed; 0 audit vulnerabilities.
- `npm test`: PASS — 68 Playwright tests across desktop Chromium and 390×844 mobile Chromium.
- `npm run test:unit`: PASS — 9 tests in 2 files.
- `npm run build`: PASS — TypeScript check, Vite build, and service-worker finalizer; `dist/` contains the static app root.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- Every one of the 21 declared claims commands was run independently, in declaration order: PASS. The two new claims each passed in both Chromium projects.
- The bundled initial JavaScript is 9,180 bytes gzip; CSS is 4,174 bytes gzip.

Browser, keyboard, and accessibility checks:

- The shipped suite covers keyboard skip-link and Enter activation, focus, 44px targets, reduced motion, dark theme, desktop, and 390px width.
- `/opt/fleet/lib/verify-url.sh` passed locally and on production: one `h1`, one `main`, `lang=en`, title, image alt text, labeled buttons, and no browser console/page errors.
- Live Axe checks on `/`, `/demo`, `/app`, `/privacy`, and `/terms` passed at desktop and 390px: zero serious/critical findings, zero console errors, and no horizontal overflow.
- Live 390px PWA check installed a controlling service worker, reloaded offline, and retained both the offline notice and **Reveal my takeaway** action.

Privacy, response policy, and identity:

- The new account-free test and existing `@claim:local-privacy` test confirm the clean demo review flow has no authentication or cross-origin tracking/note-data requests.
- Live HTML, 404 shell, worker, manifest, JS, and CSS SHA-256 values exactly match `dist/`. The detailed comparison is in `.factory/evidence/repair-3-live/identity.json`.
- Live response policy passed: HSTS, CSP, `nosniff`, strict-origin referrer policy, and permissions policy are present. Fingerprinted assets are immutable for one year; `sw.js` is no-store; the manifest revalidates hourly; `/missing-page` returns HTTP 404.
- `https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout` returned HTTP 303 to hosted checkout. No payment-provider URL is embedded in the app.
- Forty invalid live license verification requests returned 30× HTTP 200 then 10× HTTP 429; every 429 supplied `Retry-After: 4`. No purchase was submitted.

Mobile Lighthouse on production: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP **983 ms**, CLS **0**, TBT **9 ms**.

Evidence is committed under `.factory/evidence/repair-3-local/` and `.factory/evidence/repair-3-live/`.

## Run and deploy

```sh
npm run dev
npm test
npm run test:unit
npm run build
/opt/fleet/lib/deploy-static.sh podcast-recall-loop dist
```

The app remains a Vite + TypeScript offline PWA deployed as a static site from `dist/`.

## Known limits

- Some podcast hosts block browser RSS fetches; manual podcast and episode entry remains available.
- Notes do not sync between devices. JSON backup/import remains the transfer path.
- QA verified checkout start, return-token behavior, restore, revocation, and rate limiting with live/recorded paths; it did not submit a real production payment.
