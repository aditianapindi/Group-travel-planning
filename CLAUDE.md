# Nod — Group Trip Decision Engine

## WHAT

"Get everyone's nod." Collapses the 50-message, 2-week trip alignment ordeal into 5 minutes via a shareable link. Not a planning tool — a decision tool.

**Phase**: MVP live at nod.sunforged.work · PRD due end of day April 1
**Stack**: Next.js 16 (App Router) · Supabase (DB + Realtime) · Gemini 2.5 Flash · Tailwind v4 · Vercel
**Repo**: github.com/aditianapindi/Group-travel-planning

---

## WHY — Principles

- Mobile-first — planning happens on phones. 44px touch targets. <2s load.
- Async-first — groups span time zones. Never require real-time to make progress.
- Transparency > control — everyone sees budget, votes, dates. No side channels.
- Organizer relief is the entry point, but product must serve ALL participants.
- Every feature tied to validated pain (22+ interviews, 9-person survey, 65+ sources).
- Source verification: every stat must cite source. We caught 4 fabricated stats.
- Secrets: manage_key + response_token stripped from client payloads. Never commit API keys.
- Server components by default. No console.logs. Handle every state: loading, empty, error, success.

---

## HOW — Commands & Structure

```
npm run dev        npm run build       npm run lint
```

**Session protocol**: Start → read `knowledge/`. End → write session journal + decisions.
**Build before commit. Run build after every change. Verify rendered output for each persona before handoff.**

```
app/              — pages, components, API routes
lib/              — supabase, holidays, calendar, slug utilities
research/         — competitor analysis, user interviews, surveys
insights/         — personas, synthesis, brainstorms
artifacts/        — interview guides, surveys
knowledge/        — session journals, decisions, test checklist, product principles
```

---

## KEY DECISIONS

- **Two personas, one link**: Organizer (has ?key=manage_key) vs participant (no key). Manage key = organizer identity.
- **Response tokens**: UUID per submission. Enables dedup + edit. Stored in localStorage, stripped from client payload.
- **Itinerary is organizer-only** until explicitly shared. Share flow is PRD feature.
- **Date voting**: Holiday long weekend picker → date pills → calendar links after lock. The commitment ratchet.
- **Budget is total trip cost** (travel + stay + food + activities). Label makes this explicit.
- **Realtime**: Supabase Realtime for participant inserts/updates + trip status changes. Publication must include ALL columns.
- **Dark mode deferred**: Tailwind v4 @theme is build-time — can't nest in media query. Needs dark: variants per component.

---

## PAST MISTAKES

- `@theme` inside `@media` breaks Tailwind v4 — tokens get overwritten globally.
- `select("*")` leaks secrets (manage_key, response_token) to client via Next.js serialization. Always strip.
- `redirect()` inside try-catch shows NEXT_REDIRECT error. Check for it before treating as error.
- JSX `{" "}{var} text` can lose spaces. Use template literals: `` {`${var} text`} ``.
- Supabase publication doesn't auto-include new columns. After ALTER TABLE, drop and re-add table to publication.
- Verify rendered output for EACH persona before handoff. Caught "Aditiwill", wrong tone, duplicate names.

---

## REFERENCES

- Product principles: `knowledge/product-principles.md`
- Category risk: `knowledge/decision-category-risk.md`
- Session journals: `knowledge/session-3-2026-03-31.md`, `knowledge/session-4-2026-04-01.md`
- Test checklist: `knowledge/test-checklist.md`
- Decisions: `knowledge/decision-holiday-calendar.md`, `knowledge/decision-participant-motivation.md`
