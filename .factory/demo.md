# Demo sandbox

## Entry point

- Local: `http://localhost:4173/?demo=1`
- Production: `https://podcast-recall-loop.sociobot.in/?demo=1`
- Canonical route: `/demo`

The first screen links to the demo with **Try it with sample data**.

## Sample data

The demo begins with five authored clips from three fictional educational shows. Its first local-day queue contains three questions, so it opens at **Question 1 of 3 today**. Two clips have later review dates. Each clip has an episode title, timestamp, learner-written question, and takeaway.

The sample contains metadata and notes only. It contains no audio.

## Isolation and reset

Demo state uses the IndexedDB database `podcast-recall-loop-demo`. Real notes use `podcast-recall-loop`. Code selects one database for the whole route, so demo actions never read or write the real database. Demo mode is decided before license handling: it never reads, accepts, verifies, or writes the real `sb_license:podcast-recall-loop` storage keys, including when a `license` query parameter is present.

**Reset demo** deletes the demo database and seeds the original five clips. Every link that leaves demo first deletes that database. This includes **Start for real**, **Restore a license**, checkout, legal pages, and external links. After an exit, returning to `?demo=1` or `/demo` creates the original sample again.

The app saves a dated local-day queue with at most three clip IDs and completed IDs. It never refills that queue on the same day, even when more clips are overdue. After three answers, the demo says **You are caught up for today**. The next local day selects the next overdue clips.

## Verification

Claim tests begin with a fresh browser context. They use only `?demo=1` or `/demo` and the shipped sample data. Feed tests fulfill recorded RSS and Atom responses and make no uncontrolled request.
