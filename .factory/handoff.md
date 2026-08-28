# Podcast Recall Loop v1 handoff

## What shipped

- A Vite and TypeScript PWA at `/`, with real routes for `/app`, `/demo`, `/privacy`, `/terms`, and a styled 404.
- Direct RSS fetch and XML parsing for podcast and episode metadata, plus a manual fallback for feeds that block browser requests.
- Manual timestamps, learner-written questions and takeaways, and a maximum three-question daily review queue.
- Simple spaced scheduling: remembered questions double their interval up to 30 days; “Review sooner” returns them the next day.
- IndexedDB storage with separate `podcast-recall-loop` and `podcast-recall-loop-demo` databases.
- Markdown, CSV, and JSON backup export, plus JSON backup import.
- An installable manifest and service worker with a versioned shell cache, offline navigation, and an update prompt.
- An eight-clip free tier and $9 one-time unlimited tier using Sociobot checkout, return-token storage, daily verification, and license restore.
- Privacy, terms, metadata, sitemap, robots, CSP/security-header configuration, and a designed 404.
- Original generated ceramic art, source prompt, review note, and optimized WebP variants.

## Verification

Run from `/work/repo`:

```sh
npm install
npm test
npm run build
```

Results on 28 August 2026:

- `npm test`: 36 passed across desktop Chromium and a 390×844 Chromium viewport.
- `npm run build`: passed; output is `dist/` with `dist/index.html` at its root.
- Claim checks: offline reload, demo isolation, RSS lookup, three-question queue, CSV export, Markdown export, eight-clip limit, and local demo privacy passed.
- Axe integration: no serious or critical findings on home, app, demo, privacy, terms, or 404 routes.
- `/opt/fleet/lib/verify-url.sh`: passed with one `h1`, `lang=en`, a main landmark, alt text, and no browser console errors. Evidence is in `.factory/evidence/`.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse lab metrics: LCP 1.3 s, CLS 0, total blocking time 0 ms.
- Production payload: 9.09 KB gzip JavaScript, 4.08 KB gzip CSS, and 24 KB hero WebP.
- `npm audit --audit-level=high`: zero vulnerabilities.
- Keyboard smoke path and 390px horizontal-overflow check passed.

## Known gaps and honest limits

- Some podcast hosts do not allow browser-to-feed requests. The form explains the failure and keeps manual podcast and episode fields available.
- Offline mode covers the installed shell, saved clips, and review flow. New RSS lookups still need a connection.
- The factory must register `podcast-recall-loop` with the Sociobot billing service before checkout can complete in production.
- Notes do not sync between devices. JSON backup and import are the transfer path.

## Next steps

- Register the $9 one-time product and confirm its production return URL.
- Deploy `dist/`, then repeat the claim suite against the production hostname.
- Test a small list of common podcast feeds and document hosts that require manual entry.
