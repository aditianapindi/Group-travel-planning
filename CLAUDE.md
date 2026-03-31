# Group Travel Planning Platform

## WHAT — Project Overview

A collaborative travel planning platform that eliminates coordination friction
for groups and families — so everyone participates, not just the organizer.

**Current phase**: Research & Discovery (no building yet)
**Output goal**: Validated product concept with user flows, features, and GTM hypothesis

### Tech Stack (TBD — decided after research phase)

- Frontend: TBD
- Backend: TBD
- Styling: TBD

---

## WHY — Constraints & Principles

### Design Principles

- Mobile-first responsive design — planning happens on phones, not desks
- Async-first — groups span time zones, never require real-time to make progress
- Transparency > control — everyone sees budget, options, votes
- Progressive complexity — weekend trip and 2-week international use the same tool

### Rules

- No premature building — understand the problem before solutioning
- Every feature must tie to a validated user pain point
- No feature creep — solve one workflow end-to-end before expanding
- Track assumptions explicitly — test them, don't assume them true
- Research depth: what competitors get wrong matters more than what they do
- **Source verification**: every quantitative claim must have a [Source: name, year] tag or be flagged as unverified. AI-generated research produces plausible but fabricated stats — we caught 4 in our own secondary research. Never cite a number without tracing it to an original report.
- Never commit API keys or secrets
- All user-facing text must support i18n
- Use server components by default

---

## HOW — Commands & Workflows

### Commands (active after build phase)

- Dev server: `npm run dev`
- Build: `npm run build`
- Tests: `npm test`
- Lint: `npm run lint`

### Feedback Loops

- Always run lint after editing files
- Always run tests after changing logic
- Always run build before committing

### Session Protocol

- **Start**: Read `knowledge/` for past decisions and session journals
- **End**: Write session journal + decision notes to `knowledge/`

### Project Structure

```
research/    — competitor analysis, user interviews, surveys
insights/    — personas, JTBD, synthesized patterns
artifacts/   — wireframes, flows, decks, specs
knowledge/   — decisions, session journals, product principles
```

### Key References

- Case study brief: `research/case-study-brief.md`
- Research questions: `research/key-questions.md`
- Product principles: `knowledge/product-principles.md`
- Category risk analysis: `knowledge/decision-category-risk.md`
- Competitor viability & business models: `research/competitor-viability-and-business-models.md`
- **Deadline**: April 4th, 2026 — PRD + deployed MVP
- **Markets**: India (primary), US (user resides here)
