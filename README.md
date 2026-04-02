# Nod - Group Trip Decision Engine

**"Get everyone's nod."** Collapses the 50-message, 2-week trip alignment ordeal into 5 minutes via a shareable link.

**Live prototype:** [nod.sunforged.work](https://nod.sunforged.work)

---

## What it does

Organiser creates a trip in 60 seconds. Shares a link in WhatsApp. Each participant clicks and responds in 30 seconds: when are you free, how much can you spend, where do you want to go. Engine computes overlap. Organiser locks. AI generates a fitted itinerary. Done.

## Key features

- **Trip creation** with holiday long weekend picker (2026 Indian holidays) + custom date input
- **Shareable link** - no app download, no login, no sign-up
- **Participant form** - 30-second interaction: RSVP, destination vote, date vote, budget range
- **Motivation block** - named accountability, deadline with consequence, behavioural nudges
- **Real-time vote results** - destination + date tallies, budget overlap via Supabase Realtime
- **Trip lock** with inline confirmation
- **AI itinerary** - Gemini 2.5 Flash generates day-by-day plan from group context
- **Share plan bar** - copy link + WhatsApp + iMessage for organiser
- **Next steps** - outbound booking links (Booking.com, Airbnb, MakeMyTrip, ixigo, Zoomcar, Klook, Viator)
- **Calendar links** - Google Calendar + .ics download after lock
- **Group insights dashboard** - live analytics at [/insights](https://nod.sunforged.work/insights)

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Database | Supabase (PostgreSQL + Realtime) |
| AI | Gemini 2.5 Flash |
| Styling | Tailwind v4 |
| Deploy | Vercel |

## Project structure

```
app/                  Pages, components, API routes
lib/                  Supabase, holidays, calendar, slug utilities
research/             Competitor analysis, user interviews, surveys
insights/             Personas, synthesis, brainstorms
knowledge/            Session journals, decisions, product principles
```

## PRD and documentation

| Document | Description |
|----------|-------------|
| [PRD.md](PRD.md) | Full product requirements document (markdown) |
| [PRD.html](PRD.html) | Google Docs-friendly version (upload via File > Open) |
| [PRD-diagrams.md](PRD-diagrams.md) | Mermaid diagram source code |
| [PRD-diagrams.html](PRD-diagrams.html) | Rendered diagrams (open in browser) |

## Running locally

```bash
npm install
npm run dev
```

Requires `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
```
