# Demo sandbox

## Entry point

- Local: `http://localhost:4173/demo`
- Production: `https://podcast-recall-loop.sociobot.in/demo`
- Query alias: `/?demo=1`

The first screen links to the demo with **Try it with sample data**.

## Sample data

The demo begins with five authored clips from three fictional educational shows. Three questions are due now. Two have later review dates. Each clip has an episode title, timestamp, learner-written question, and takeaway.

The sample contains metadata and notes only. It contains no audio.

## Isolation and reset

Demo state uses the IndexedDB database `podcast-recall-loop-demo`. Real notes use `podcast-recall-loop`. Code selects one database for the whole route, so demo actions never read or write the real database. Demo mode is decided before license handling: it never reads, accepts, verifies, or writes the real `sb_license:podcast-recall-loop` storage keys, including when a `license` query parameter is present.

**Reset demo** deletes the demo database and seeds the original five clips. **Start for real** first deletes the demo database, then opens `/app` without copying any demo data. Returning to `/demo` always creates the original sample again.

## Verification

Claim tests begin with a fresh browser context. They use only `/demo` and its shipped sample data. The RSS test fulfills a local fixture response and makes no live feed request.
