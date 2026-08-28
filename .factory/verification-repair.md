# Repair verification — PASS

**Base report:** `6766299631909252726c68035af320cb8d57431b`  
**Rejected candidate:** `571773ed0427f222db7847751cf8b3b54cb44edc`  
**Deployed product commit:** `bee9af3`  
**Live URL:** <https://podcast-recall-loop.sociobot.in>  
**Verified:** 2026-08-28

## Finding disposition

| Original finding | Repair | Regression evidence |
| --- | --- | --- |
| Advertised checkout returned 404 | Withheld the unregistered paid offer and removed every checkout link and price claim; retained existing-license verification | `unavailable checkout is not advertised or linked`; `@claim:existing-license` |
| `npm run test:unit` failed on Playwright files | Added explicit, disjoint Vitest and Playwright patterns plus seven unit tests | `npm run test:unit`: 7 passed |
| Claims coverage was incomplete | Added seven missing product claims and observable tests; removed unavailable price claims | all 15 claim commands: 2 passed each |
| Sample episode links returned 404 | Removed fictional URLs from all five samples | `demo has no dead fictional episode links`; unit sample-data regression |
| Footer used a TLS-invalid host | Switched to `https://sociobot.in/` | exact href assertion and live HTTP 200 |
| Static assets had 30-second caching | Content-hashed JS/CSS and added one-year immutable response headers | unit policy test and live response headers |

## Final gate summary

- `npm ci`: pass, zero vulnerabilities.
- `npm test`: 60 passed.
- `npm run test:unit`: 7 passed.
- `npm run build`: pass, including `tsc --noEmit`; output in `dist/`.
- Desktop and 390px mobile: pass, zero horizontal overflow, all visible links/buttons at least 44px.
- Keyboard and route focus: pass.
- Axe on all routes in light and dark: zero serious or critical violations.
- Offline reload and service-worker control: pass on the live `/demo` route.
- Local/live artifact identity: exact SHA-256 match for HTML, JS, CSS, and service worker.
- Live immutable asset caching and security response headers: pass.
- Lighthouse report: 100/100/100/100 with LCP 0.9 s, CLS 0, TBT 0 ms; CLI reported its known post-report browser shutdown crash.

The original `.factory/verification.md` remains unchanged as historical independent evidence.
