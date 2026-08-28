# Podcast Recall Loop v1.0.2 independent verification handoff

## Release status

**FAIL — candidate `35723d590f33cd30645f1068d55b291196db9ef8` is not releasable under the factory claims contract.**

The fresh deployment is an exact match for the candidate and all executable functional checks pass. The blocking issue is incomplete executable coverage for visitor-facing promises, documented in `.factory/verification-3.md`.

- Candidate verified: `35723d590f33cd30645f1068d55b291196db9ef8`
- Report: `.factory/verification-3.md`
- Live URL: <https://podcast-recall-loop.sociobot.in>
- Verified: 28 August 2026

## What passed

- `npm ci`, all 19 independently invoked claims, `npm test` (64), `npm run test:unit` (9), `npm run build`, and high-severity audit all passed.
- Production is byte-identical to fresh local output for HTML, JS, CSS, service worker, manifest, and 404 page.
- Live end-to-end save/reload/reveal/review, RSS lookup, invalid-timestamp recovery, demo isolation, offline reload, active service worker, checkout redirect, real 404, headers/caching, and license API rate limiting passed.
- Desktop and 390px mobile Axe serious/critical findings: zero. Keyboard focus, skip link, reduced motion, and no-console-error checks passed. Lighthouse was 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO (LCP 1.317 s, CLS 0, TBT 9 ms).

## Blocking work

Add or remove the three public promises identified in `verification-3.md`: no-account behavior, refund handling, and free access to reviews/exports/accessibility. Each retained promise needs a `.factory/claims.json` entry with exactly one observable tagged test from the appropriate demo entry point. Then rerun the listed quality gates and reverify deployment identity.

## Finding disposition

| Verifier finding | Root-cause repair | Exact regression |
| --- | --- | --- |
| One-time unlock could not be bought or restored | Registered the $9 one-time product in the live Sociobot catalog, restored the hosted-checkout link, added paste-to-restore UI, retained return-token stripping and daily verification, and added revoked-license recovery | `@claim:one-time-unlimited`, `@claim:sociobot-billing`, `@claim:license-restore`, and the expanded `@claim:existing-license` save a ninth clip |
| Unknown live paths returned HTTP 200 | Removed the catch-all navigation fallback, rewrote only the four real SPA routes, generated `404.html`, and used the host's 404 response override | `known routes rewrite to the app while unknown routes keep HTTP 404`; live `/missing-page` and a random path both returned 404 |
| App updates required a manual worker/cache edit | The production finalizer derives the worker bytes, cache name, and precache list from each built HTML shell and its hashed assets. Apply update now messages `registration.waiting` and reloads on `controllerchange` | `@claim:build-coupled-updates`, update-path unit test, and a real installed `v3` browser upgraded to `recall-loop-shell-57db998b83d6` |

## Product and billing behavior

The free library remains useful at eight clips. A $9 one-time purchase removes only that limit; review, export, backup, accessibility, and offline behavior remain free. Checkout uses only `https://api.sociobot.in/api/v1/products/podcast-recall-loop/checkout`. The live endpoint returns 303 to the hosted checkout. The app never embeds a payment-provider link.

Return tokens are stored under `sb_license:podcast-recall-loop`, removed from the address bar, verified with Sociobot at most once per day, and used optimistically from the cached verdict while offline. Buyers can paste a token on the home page. Invalid or revoked tokens restore the free limit with a quiet status message and another purchase/restore path.

No real charge was submitted during QA. The live checkout start and catalog mapping were verified; return, cache, restore, invalid, revoked, and ninth-clip behavior use recorded verification responses in the browser suite.

## Verification evidence

From a clean install:

```sh
npm ci
npm test
npm run test:unit
npm run build
npm audit --audit-level=high
```

- `npm ci`: 61 packages installed; zero vulnerabilities.
- Every one of the 19 commands in `.factory/claims.json` passed independently. Browser claims passed in desktop Chromium and 390×844 mobile Chromium.
- `npm test`: 64 passed across both browser projects.
- `npm run test:unit`: 9 passed.
- Type check and production build: passed; `dist/index.html` and `dist/404.html` exist.
- Production payload: 9.23 KB gzip JavaScript and 4.17 KB gzip CSS.
- Copy audit: no landing sentence exceeds 22 words or uses a banned word.

Browser and accessibility checks covered `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the designed 404. Live checks found one `h1`, one `main`, no horizontal overflow, zero serious/critical Axe findings, visible keyboard focus, working skip/demo/reveal actions, no undersized visible targets, and reduced motion at `0.01ms` with automatic scrolling disabled. `/opt/fleet/lib/verify-url.sh` found no JavaScript/console errors on the live home page.

The live demo review flow made zero cross-origin requests. Offline reload at 390px retained the queue, offline notice, and Reveal action. The previous installed cache showed the update toast and changed from `recall-loop-shell-v3` to `recall-loop-shell-57db998b83d6` after **Apply update**.

Live response checks passed HSTS, `nosniff`, strict-origin referrer policy, CSP, and permissions policy. Hashed assets are one-year immutable; `sw.js` is no-store. A 40-request invalid-license burst returned 30× 200 then 10× 429 with `Retry-After: 3`.

Fresh local and live SHA-256 hashes match exactly for `index.html`, hashed JavaScript, hashed CSS, `sw.js`, and the manifest. Lighthouse live scores are 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; LCP 1.1 s, CLS 0, TBT 20 ms. Lighthouse wrote the complete report before its known browser-tab shutdown crash.

Evidence is in `.factory/evidence/repair-2-local/` and `.factory/evidence/repair-2-live/`.

## Known limits

- Podcast hosts that block browser RSS requests still require manual podcast and episode entry.
- Notes do not sync. JSON backup and import remain the device-transfer path.
- QA did not submit a real production payment; it stopped after the live hosted checkout opened. No product behavior is stubbed, and deterministic return/webhook outcomes are covered with recorded responses.
