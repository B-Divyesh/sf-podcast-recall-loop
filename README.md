# Podcast Recall Loop

Turn podcast moments into three daily recall questions.

Podcast Recall Loop is for self-learners who want recall without a larger note system. Paste a podcast RSS feed, choose an episode, mark a timestamp, and write one question. The daily queue presents no more than three due questions.

The app stores notes in IndexedDB. It does not store audio or send notes to a server. The demo at `/demo` uses a separate database and never enters the real note library.

## What v1 includes

- RSS metadata lookup with a manual fallback
- Learner-written questions and takeaways tied to timestamps
- A three-question due queue with simple spaced scheduling
- Markdown, CSV, and JSON backup exports
- JSON backup import
- An installable service worker and offline review after the first visit
- A free eight-clip library
- A $9 one-time Sociobot license for unlimited clips

## Try the isolated demo

Open `http://localhost:4173/demo` after starting the app. It contains five realistic sample clips. Use **Reset demo** to restore them. Use **Start for real** to open the separate, empty library.

## Develop

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Vite serves the development site at `http://localhost:4173`.

## Test and build

```sh
npm test
npm run build
```

The Playwright suite checks every claim, the offline reload, keyboard use, mobile width, route structure, and serious accessibility findings. The production command writes `index.html` and static assets to `dist/`.

Run one claim with its command from [.factory/claims.json](.factory/claims.json):

```sh
npm test -- --grep @claim:csv-export
```

## Deploy

Deploy the contents of `dist/` as a static site. `staticwebapp.config.json` provides SPA fallback and security headers for Azure Static Web Apps. The factory owns DNS and deployment.

## Privacy and payments

The privacy policy is at `/privacy`; terms are at `/terms`. RSS URLs are requested only when the listener presses **Find episodes**. Paid checkout and daily license verification use the Sociobot billing API. No product ID or payment-provider code is embedded.

## Project notes

- [.factory/design.md](.factory/design.md) records the visual system and generated-art provenance.
- [.factory/demo.md](.factory/demo.md) documents demo isolation.
- [.factory/claims.json](.factory/claims.json) maps claims to executable tests.
- [.factory/handoff.md](.factory/handoff.md) records final verification.

Licensed under the MIT License.
