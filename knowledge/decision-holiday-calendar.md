# Decision: Holiday Calendar — Designed, Not Built (2026-03-31)

## What
A curated long weekend picker in the trip creation flow showing upcoming Indian holidays and long weekends as tappable date options. Participants vote on dates the same way they vote on destinations.

## Why it matters
- Scheduling is #1 validated pain point (56% survey, Ruchi: 6 weeks to agree)
- Current prototype solves WHERE and HOW MUCH but not WHEN
- Curated long weekend list is genuinely differentiated — no competitor does this
- Completes the "5-Minute Lock" story: align on WHEN + WHERE + BUDGET in one flow

## Designed interaction
- Trip creation form gets a "When?" section after destinations
- Shows list of upcoming long weekends with holiday names:
  - Apr 10–13 (4 days) Mahavir Jayanti + Good Friday
  - May 1–4 (4 days) May Day long weekend
  - Aug 14–17 (4 days) Independence Day
  - Oct 2–5 (4 days) Gandhi Jayanti + Dussehra
  - Nov 1–5 (5 days) Diwali week
  - Dec 25–Jan 1 (8 days) Christmas → New Year
- Organizer taps 2-3 options → become votable date options
- Participants see "Vote for when" alongside "Vote for where"
- Curated list > calendar grid (faster on mobile, surfaces the insight)

## What it touches
- `trips` table: add `date_options` column (array of date ranges)
- `participants` table: add `date_votes` column
- Trip creation form: new "When?" section
- Participant form: new date voting pills
- Vote results: date vote tally alongside destination tally
- Holiday data: hardcoded 2026 Indian national holidays + computed long weekends

## Why not built for MVP
- 3-4 hours of work touching schema, creation, participation, and results
- Core flow (create → share → respond → lock → generate) not yet stress-tested
- Risk of half-built feature breaking the demo with 1.5 days to deadline
- Better PM signal: describe it in PRD as designed V1.1 feature with clear rationale — shows prioritization judgment

## Status
Parked. Build after core flow is verified end-to-end and deployed.
