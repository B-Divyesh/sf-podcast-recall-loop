# Podcast Recall Loop — independent verification 8 handoff

## Outcome

**FAIL. Do not release candidate `a52afadee0cec2fac9d7518b2ed3f25e30d05eb1`.**

The deployment at <https://podcast-recall-loop.sociobot.in> exactly matches the
candidate, and all declared claims and standard quality gates pass. Release is
blocked because a structurally invalid JSON backup overwrites a valid local
library before validation, claims to reject the file, then leaves `/app` blank
with a page error after reload. See
[verification-8.md](verification-8.md) for the full reproduction and evidence.

## Blocking defect

**High — invalid backup import causes unrecoverable local data loss.**

1. Save a valid note in `/app`.
2. Import `{"clips":[{}]}`.
3. Observe **“That backup could not be read”** while the note still appears.
4. Reload.
5. The UI is blank, the note is gone, IndexedDB contains the invalid object,
   and the page throws `Cannot read properties of undefined (reading 'replace')`.

Validate the complete imported schema before assigning `state` or calling
`saveState`. Preserve the current state on every rejection. Add a claim or
regression test covering a parseable wrong-shape backup, existing-data
preservation, and a successful reload.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | Invalid backup import overwrites valid local data and blanks the app after reload. |
| Medium | None |
| Low | None |

## Verification summary

```text
npm ci                         PASS — 0 vulnerabilities
26 claims.json commands        PASS — 26/26 entries
npm test                       PASS — 80/80
npm run test:unit              PASS — 13/13
npm run build                  PASS — dist/ produced
live/local artifact hashes     PASS — HTML, JS, CSS, SW, manifest match
live Axe                       PASS — 0 serious/critical in 18 scans
mobile Lighthouse              PASS — 95/100/100/100
offline reload and review      PASS
license rate limiting          PASS — 30 allowed, request 31 returned 429 + Retry-After
invalid backup recovery        FAIL — data overwritten; blank app after reload
```

The cold first-read gate passes: the first viewport identifies the job and
audience and provides a one-click **Try it with sample data** action. Live
normal routes have no console errors, the 390px layout does not overflow,
keyboard focus is visible, reduced motion is respected, privacy request logs
are same-origin, and production headers/caching are correct.

## Evidence

- [Full independent verification](verification-8.md)
- [Valid note and rejection message](evidence/verification-8/malformed-import-before-reload.png)
- [Blank app after reload](evidence/verification-8/malformed-import-after-reload.png)
- [Cold live home verification](evidence/verification-8/live-home/verify.json)
- [Cold live demo verification](evidence/verification-8/live-demo/verify.json)
- [Mobile Lighthouse report](evidence/verification-8/lighthouse-mobile.json)

## Next step

Repair import validation and add the regression test described above. Rebuild,
redeploy, then rerun the claim gate and the invalid-input recovery scenario.
No product code was modified during this verification.
