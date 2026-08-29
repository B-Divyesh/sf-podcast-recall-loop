# Podcast Recall Loop

Turn podcast moments into three daily recall questions.

Podcast Recall Loop is for self-learners who want recall without a larger note system. Add a podcast feed, choose an episode, mark a timestamp, and write one question. The daily queue presents no more than three due questions.

The app stores written notes in this browser. It stores no audio. The demo at `?demo=1` uses separate browser storage and never reads or writes your notes or license. Every exit discards sample changes.

## What v1 includes

- Fill podcast and episode details from a feed, or enter them yourself
- Learner-written questions and takeaways tied to timestamps
- Up to three due questions, with the next review based on your answer
- Markdown, CSV, and JSON backup exports
- JSON backup import that rejects invalid files without changing saved clips
- Install the app and review offline after your first visit
- A daily calendar reminder download for the recall queue
- A free eight-clip library
- A $9 one-time license for unlimited clips through Sociobot checkout

## Try the isolated demo

Open `http://localhost:4173/?demo=1` after starting the app. It contains five sample clips from fictional educational shows. Use **Reset demo** to restore them. Every link that leaves the demo discards its changes. **Start for real** discards demo changes and opens your separate real library.

## Develop

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Vite serves the development site at `http://localhost:4173`.

## Test and build

```sh
npm test
npm run test:unit
npm run build
```

The Playwright suite checks every claim, offline reload, keyboard use, mobile width, route structure, and serious accessibility findings. Vitest covers data and release configuration. The production command writes `index.html` and fingerprinted static assets to `dist/`.

The production build also stamps the service worker from those asset fingerprints. Installed copies therefore receive every new app build without a manual cache-version edit.

Run one claim with its command from [.factory/claims.json](.factory/claims.json):

```sh
npm test -- --grep @claim:csv-export
```

## Deploy

Deploy the contents of `dist/` as a static site. `staticwebapp.config.json` provides SPA fallback and security headers for Azure Static Web Apps. The factory owns DNS and deployment.

## Privacy

The privacy policy is at `/privacy`; terms are at `/terms`. The app contacts the feed address only after you press **Find episodes**. Saved note flows send no note data or tracking requests to another origin.

## One-time license

The free library holds eight clips. A $9 one-time license removes that limit. Sociobot handles checkout. Buyers can paste their license on the home page to restore it on another device.

## Developer notes

The browser storage implementation uses IndexedDB. The app reads RSS and Atom feeds only after you press **Find episodes**.

## Project notes

- [.factory/design.md](.factory/design.md) records the visual system and generated-art provenance.
- [.factory/demo.md](.factory/demo.md) documents demo isolation.
- [.factory/claims.json](.factory/claims.json) maps claims to executable tests.
- [.factory/handoff.md](.factory/handoff.md) records final verification.

Licensed under the MIT License.
