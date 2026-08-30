# Podcast Recall Loop — verification work order 13

## Outcome: FAIL

Candidate `205c5a213db6e80b48136039cf6f7eb16ba42cd3` at
<https://podcast-recall-loop.sociobot.in> is **not release-ready**. Production
is byte-identical to the candidate, the core free/offline product works, all
28 declared claims pass after `npm ci`, and the `demo-isolation` flake from
verification 12 is fixed. Two high-severity paid-path defects block release:

1. Live Sociobot checkout and license verification return HTTP 503. Clicking
   **Buy unlimited — $9 once** shows the provider's 503 page. Thirty-five
   single-client verify requests all returned 503 without `Retry-After`, so no
   enforced allowance/429 was observed.
2. License restoration fails open. When verification is unavailable, any new
   string is announced as verified, stored without a verdict, and enables
   **Unlimited clips active.** This reproduces with the live 503 and with a
   deliberately aborted request.

Full evidence and remediation are in
[`verification-13.md`](verification-13.md).

## Verification summary

- Mandatory first-read/demo gate: PASS.
- Every `.factory/claims.json` command after locked install: 28/28 PASS.
- `npm test`: 92/92 PASS.
- `npm run test:unit`: 17/17 PASS.
- Repeated repaired isolation claim: 6/6 PASS.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run build`: PASS; TypeScript checked; `dist/` produced.
- Bundle: JS 10.90 KB gzip; CSS 4.20 KB gzip.
- Live/local identity: exact match for HTML, JS, CSS, service worker, and
  manifest.
- Live Axe: zero serious/critical findings across all routes in desktop light
  and 390 px dark modes.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.2 s, CLS 0, TBT 100 ms.
- PWA: controlling worker, standalone manifest, current cache, and offline
  demo reload PASS.
- Privacy: note/demo flows stayed same-origin; no tracking, media, or sign-in.
- Headers/caching/404: PASS.
- Live checkout, verify, and required 429 allowance: FAIL.

There is no separate lint script. This static PWA has no backend, library/CLI
consumer package, or sign-in flow. No product source was modified during this
verification.

## Reproduce

```sh
npm ci
npm test
npm run test:unit
npm audit --audit-level=high
npm run build
node scripts/verify-live.mjs https://podcast-recall-loop.sociobot.in /tmp/podcast-recall-verification-13
```

To reproduce the product-code blocker, open `/#restore-license`, paste any new
token while the verify request fails, press **Verify license**, then open
`/app`. The invalid token is incorrectly treated as an unlimited license.

## Next steps

1. Restore the Sociobot billing API and recheck checkout plus the documented
   per-client 429/`Retry-After` behavior.
2. Make an absent/unparseable verdict locked by default; retain offline access
   only when a prior valid verdict exists.
3. Add negative browser tests for verify network failure, 5xx/non-JSON
   responses, and `{valid:false}` before rerunning all gates.
