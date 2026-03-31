# Decision: Participant Motivation Design (2026-03-31)

## Problem
People don't respond to WhatsApp polls. Why would they click a link and respond to this?

## Root cause
Not a motivation/reward problem. It's friction + no consequence + no feedback loop.
- WhatsApp polls feel optional — organizer figures it out anyway
- No deadline with teeth — poll just sits there
- No feedback — you vote and nothing visibly changes

## What we built (implemented)

### A. Motivation block above the form
- Shows names of people who already responded ("Priya and Rahul are in")
- "Takes 30 seconds — once everyone responds, [organizer] locks the plan"
- Deadline with consequence: "Votes close Thursday — after that, the majority decides without you"
- File: `app/trip/[slug]/trip-view.tsx` — MotivationBlock component

### B. Simplified form
- Core: name, RSVP, destination vote, budget range (4 fields, ~30 seconds)
- Headcount, group type, kids moved behind "More details (optional)" toggle
- File: `app/trip/[slug]/participant-form.tsx`

### C. Better confirmation
- Shows participant count + names after responding
- "[X] people have responded. [Organizer] can lock the plan once everyone's in."
- File: `app/trip/[slug]/trip-view.tsx` — ConfirmationBlock component

### D. Deadline urgency in status bar
- "Votes close Thursday" instead of "3d left"
- Highlights urgently (colored, bold) when under 24h
- File: `app/trip/[slug]/status-bar.tsx`

## Behavioral levers (ranked by evidence)
1. Named accountability — "Waiting on Yash, Priya" (nobody wants to be the blocker)
2. Deadline with consequence — loss aversion > any reward
3. Tiny ask — cost of responding < cost of ignoring
4. Instant visible change — feedback loop closes immediately
5. Organizer nudge ammo — pre-written WhatsApp messages (not built)

## Rejected idea
"Trip probability" meter — showing "you contributed X% to trip happening." Rejected because it can't be calculated honestly and people smell fake gamification.
