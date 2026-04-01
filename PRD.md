# NOD

### Group Trip Decision Engine

**Product Requirements Document**

Aditi Anapindi  |  April 2026  |  Status: Prototype Live

[nod.sunforged.work](https://nod.sunforged.work)

---

**Table of Contents**

01  Discovery Insights - 2
02  Problem Prioritisation - 4
03  Proposed Solution - 5
04  Implementation Plan - 6
05  Instruction Design - 7

---

## 01  DISCOVERY INSIGHTS

### The Problem Nobody Has Solved

Trip planning is the highest-failure vertical in travel. ~300 startups have tried and died. ~700 have attempted it. PhocusWire published "Why you should never consider a travel planning startup." No standalone group travel planning app has achieved venture-scale success.

The problem is real. **77%** of Americans travel with others [Talker Research, 2025, n=2,000]. **47%** of Airbnb bookings are groups of 3+ [Airbnb/STR analysts, 2024-2025]. India recorded **2.95 billion** domestic tourist visits in 2024 [Ministry of Tourism]. Yet the average person **misses 2 trips per year** because they can't coordinate [Talker Research, Feb 2026, n=2,000].

Discovery drew from **22+ user interviews** across two batches, a **9-person survey**, and **65+ secondary sources** including competitor analyses, academic research, and industry reports. Every quantitative claim in this document cites its source - we caught 4 fabricated stats during research and adopted a zero-tolerance verification policy.

### Why Startups Die Here

| # | Failure Mode | Evidence |
|---|-------------|----------|
| 1 | **Research-to-booking leakage** - users plan on your tool, book on OTAs | Consumers visit ~38 sites before booking [Expedia]. Planning tool is one of 38. |
| 2 | **Planning is perceived as free** - Google Sheets and WhatsApp cost nothing | Revenue lives at booking (commissions) and during-trip. Planning sits in the value chain's dead zone. |
| 3 | **Infrequent use** - 1-2 group trips per year | Can't build daily habit or justify subscription on something used twice a year. |
| 4 | **WhatsApp gravity** - terrible for planning, but everyone is already there | **55%** of our survey respondents won't download a new app. **33%** say "WhatsApp is fine." |
| 5 | **Group adoption is social, not product** - organiser loves it, 5 others didn't choose it | Competing with human inertia, not other apps. |

The three companies that survived this graveyard did so by **not** being group trip planning apps:

| Company | Revenue | Strategy |
|---------|---------|----------|
| **Splitwise** | ~$25M ARR | Solved expense splitting - a *financial* pain, not a planning pain. Recurs during AND after trip. |
| **Wanderlog** | ~$1M ARR, 5 people | Stayed tiny. Monetised during-trip features (offline maps, route optimisation). Affiliate commissions. |
| **Holidify** | ~$400K | Content-first SEO. Agent marketplace. Near-zero burn. |

### What 22+ Interviews Revealed

**Batch 1 (10 interviews)** confirmed the surface-level pain points. **Batch 2 (12 interviews, Akanksha's cohort)** broke our assumptions.

**Finding 1: Scheduling is #1, but budget is the hidden root cause.**
56% of survey respondents ranked scheduling as their top frustration. Budget? 0% stated frustration. But three Batch 2 interviews (Yash, Ashik, Eswar) revealed budget is the *reason* destinations never get agreed on. Yash: *"₹70k budget eliminated 5 of 7 people."* Ashik: *"Place and budget are interlinked."* Survey measured stated frustration; interviews revealed root cause. They're different layers of the same problem.

**Finding 2: Alignment is the product. Everything after is easy.**
Omkar: *"Once dates and location are locked, the rest of the planning becomes straightforward."* This reframed our entire scope. We don't need to solve itinerary planning, expense splitting, or booking. We need to collapse the 50-message, 2-week alignment ordeal into 5 minutes.

**Finding 3: The organiser is a network node, not a user persona.**
Sabya: *"There is always a push - you need a core knit group with a couple of nodes who can generate interest."* Every dead startup built for the organiser alone. The organiser is the *acquisition channel*. The product must serve the GROUP - the participant experience is what makes or breaks adoption.

**Finding 4: Budgets cause real financial harm when hidden.**
Manohar: *"I wish people had talked about budget upfront. I ended up paying more - just to compensate. He didn't pay."* 59% of travellers report tension or arguments over budget [AAA + Bread Financial, Jan 2026, n=1,714]. 37% feel pressured to exceed their budget on friend trips; 52% of millennials [Empower, May 2025, n=1,031]. The data explains why: people are **3.5x more likely to share honest budget limitations** in anonymous surveys than in group discussions [NovaTrek]. Anonymous input isn't a nice-to-have. It's the only way to get truthful numbers.

**Finding 5: People don't respond to group messages - for structural reasons.**
WhatsApp polls fail not because people are lazy, but because: no consequence for ignoring, no feedback when you respond, and no visible accountability. The fix isn't gamification - it's behavioural design: named accountability ("Waiting on Yash, Priya"), deadline with consequence ("majority decides without you"), tiny ask (30 seconds), and instant visible feedback.

### The Group Trip Journey: Where Behaviour Breaks Down

Every group trip follows the same arc. The problem isn't any single stage - it's that each stage has a behavioural failure mode that compounds into the next. **60% of trips die in stages 2-5** before a single booking is made.

| Stage | What Happens Today | Behavioural Failure | Nod's Response |
|-------|-------------------|--------------------|-----------------------|
| 1. "Let's go!" | Excitement spike in WhatsApp | None - momentum is high | We don't own this stage. We enter at Stage 2. |
| 2. Who's in? | Organiser asks, 3 reply, 2 ghost | **Social loafing** - diffusion of responsibility. "Someone else will answer." [Hall & Buzwell, 2013] | Named accountability: "Priya and Rahul are in. Waiting on you." |
| 3. When? | WhatsApp poll, 3/7 vote, poll expires | **Effort threshold** - 40% are overwhelmed by group chats [Mannell, Deakin Univ.]. Scrolling 200 messages to find a poll kills participation. | Holiday long weekend picker: curated dates as tappable pills. One tap, done. |
| 4. Where? | 12 destinations suggested, no resolution for 6 weeks | **Paradox of choice** - 24 options yield 3% action vs. 30% with 6 options [Schwartz/Iyengar]. Each person adds options, nobody removes them. | Organiser proposes 2-3 options. Structured multivote with deadline. Constraint, not chaos. |
| 5. How much? | Never discussed. Tension surfaces mid-trip. | **Financial taboo** - people are 3.5x more honest anonymously than in groups [NovaTrek]. Nobody asks "what can you afford?" because it feels invasive. | Anonymous budget range. System shows overlap zone, not individual numbers. |
| 6. Lock it | Nobody commits. "Let's figure it out later." | **Status quo bias** - doing nothing feels safer than deciding wrong. No commitment device exists. | Deadline with consequence: "Votes close Thursday. After that, majority decides without you." Loss aversion > any reward. |
| 7. Plan it | One person makes a Google Sheet alone. 16-20 hrs. | **Organiser burnout** - invisible emotional labour [Priceline]. The planner has the worst trip experience. | AI generates itinerary from group context. Organiser reviews, doesn't build from scratch. |
| 8. Book it | Everyone books separately on OTAs | **Research-to-booking leakage** - consumers visit ~38 sites before booking [Expedia] | Don't fight this. Monetise experiences (affiliate), not hotels. |

**The insight:** Every failure mode above is behavioural, not informational. The internet solved "where should we go?" - nobody has solved "how do we all agree and actually go?" That is why this is a decision engine, not a planning tool. Information tools (Wanderlog, TripIt, Google Travel) add more data. Nod adds structure, deadlines, and accountability - the behavioural scaffolding that turns group chat into group action.

### Survey Snapshot (n=9)

| Finding | Data |
|---------|------|
| #1 frustration | Scheduling conflicts (56%) |
| #1 desired feature | Expense splitting (56%), then voting (44%) |
| Adoption wall | 55% won't download an app; 33% say "WhatsApp is fine" |
| Willingness to pay | 78% free only |
| Budget sharing | 44% yes, 33% depends, 22% no |

### India-First Thesis

India is the right market for three reasons. First, **WhatsApp dominance** - WhatsApp is the default coordination channel, and our thesis (shareable link, not downloadable app) plays directly into this behaviour. Second, **no competitor** - Wanderlog, TripIt, and Google Travel serve Western solo travellers. No product serves Indian group trips. Third, **long weekend culture** - Indian holidays create natural planning triggers (Diwali week, Independence Day weekends) that a curated calendar can exploit.

**Why now:** Booking Holdings acquired Planapple in February 2025 to add group planning capabilities to Kayak and Booking.com [WiseGuy Reports] - signalling that major players now recognise the group coordination gap. The group travel planning app market is only $245M [Market Report Analytics, 2025] - nascent and fragmented, with no dominant player.

---

## 02  PROBLEM PRIORITISATION

### Validated Problem Statement

**60% of group trips never happen** because planning becomes too overwhelming [NovaTrek]. Groups of friends and families fail to convert trip excitement into trip action because **no tool resolves the multi-person alignment problem** - where, when, and how much - in a format that works asynchronously on mobile. The result: exhausted organisers, suboptimal trips, and an average of 2 missed trips per year per person.

### Priority Matrix

| Priority | Pain Point | Survey Signal | Interview Signal | MVP Feature |
|----------|-----------|---------------|-----------------|-------------|
| **P0** | Date + destination alignment | 56% #1 frustration | Ruchi: 6 weeks to agree. Omkar: "once locked, rest is easy." | Destination voting + holiday long weekend picker + deadline |
| **P0** | Budget as hidden filter | 0% stated, but 59% tension (secondary) | Yash: ₹70k eliminated 5/7. Ashik: "place and budget interlinked." | Anonymous budget range input, visible overlap |
| **P0** | Passive members / no response | 0% stated | Universal across both batches. Vinay problem. | Motivation block: named accountability + deadline consequence + 30-second form |
| **P1** | Expense splitting | 56% most wanted feature | Splitwise friction in 5+ interviews | **Deferred** - Splitwise exists, our wedge is alignment not settlement |
| **P1** | Scattered communication | Not surveyed | Varun: "single container" | Trip page IS the single source of truth |
| **P1** | Organiser burnout | 11% frustration | 71% find arranging stressful [CivicScience, 2024] | Distributed input via trip page reduces organiser's cognitive load |
| **P2** | Agent/review distrust | Not surveyed | 3+ interviews (Shardul, Yash, Ravi Kaka) | AI itinerary optimised for group, not commissions (V2: Anti-Agent) |

### Why Expense Splitting Is P1, Not P0

Expense splitting ranked #1 desired feature (56%). We deliberately did not build it. Splitwise owns this space ($25M ARR, 33M+ downloads) and does it well. Building a worse version of Splitwise is how startups die. Our wedge is the problem *before* Splitwise - getting 6 people to agree on where, when, and how much. Solve alignment, hand off to Splitwise for settlement. Fight one battle at a time.

---

## 03  PROPOSED SOLUTION

### "Get everyone's nod."

Nod is a **group decision engine**, not a planning tool. It collapses the 50-message, 2-week trip alignment ordeal into 5 minutes via a shareable link. Organiser creates a trip in 60 seconds. Shares a link in WhatsApp. Each participant clicks and responds in 30 seconds: when are you free, how much can you spend, where do you want to go. Engine computes overlap. Organiser locks. AI generates a fitted itinerary. Done.

### Three Concepts, One Lifecycle

| Concept | Phase | What It Does | Status |
|---------|-------|-------------|--------|
| **A: The 5-Minute Lock** | MVP (built) | Group constraint resolution - dates, budget, destination - in one async flow | Live at nod.sunforged.work |
| **B: The Trip Trigger** | V2 | Proactively nudges the organiser when group constraints align with a deal or holiday window | Designed, not built |
| **C: The Anti-Agent** | V2 | AI recommendations optimised for group context, not commissions. Experience affiliate revenue. | Designed, not built |

**A is the wedge. B is retention. C is monetisation.** Each builds on the data the previous concept collects.

### Why This Won't Be Failure #301

The 300 dead startups were **planning tools**. Nod is a **decision tool**. The difference:

- **No app download** - a shareable link works inside WhatsApp, not against it. Solves adoption friction (Thesis C).
- **Participant experience is the product** - 30-second form, not a feature-rich dashboard. Every dead startup built for the organiser alone.
- **Group context is the moat** - ChatGPT gets one person's prompt. Nod gets: 6 confirmed, Oct 15-18, budget ₹8K-15K, 4 voted beach, 1 vegetarian. Richer input > better output > higher affiliate conversion.
- **Monetise experiences, not hotels** - Hotels leak to OTAs. Experiences don't - no comparison-shopping habit, lower price sensitivity, discovery is the bottleneck. 8% Viator commission on activities the group already agreed on.
- **Deadline and commitment devices** - We analysed 14 competing tools across group coordination, planning, and financial features. Not one offers deadline-driven convergence or commitment mechanisms [Competitive analysis, March 2026]. Nod's vote-lock-calendar chain is structurally unique.
- **Free planning, always** - 78% of survey respondents pay nothing. Revenue comes from during-trip activity bookings (Thesis D.1), not planning-phase subscriptions.

### Business Model

**Free + Affiliate.** Planning is free forever. Revenue via experience affiliate commissions (Viator 8%, Klook, GetYourGuide) surfaced contextually after itinerary generation. Group intent data (6 people's combined constraints) is a richer lead than individual search on any marketplace.

Modelled revenue per trip: group of 6, 3-4 activities booked, ~$40-75 per trip. Thin - but the tool needs volume, not margins. This follows the Wanderlog pattern, not the "charge for planning" pattern that killed 300 startups.

---

## 04  IMPLEMENTATION PLAN

### What's Built (Live)

A fully functional MVP deployed at **nod.sunforged.work** covering the complete group decision flow:

| Feature | What It Does |
|---------|-------------|
| **Trip creation** | Name, destinations, deadline, holiday long weekend picker (2026 Indian holidays), budget guidance |
| **Shareable link** | Unique slug per trip. Copy, WhatsApp, iMessage share buttons. |
| **Participant form** | Name, RSVP (yes/maybe/no), destination vote, date vote, budget range. 30 seconds. |
| **Motivation block** | Named accountability ("Priya and Rahul are in"), deadline with consequence, "takes 30 seconds" nudge |
| **Vote results** | Destination tally + date tally + budget range overlap. Real-time via Supabase Realtime. |
| **Trip lock** | Organiser locks when ready. Inline confirmation (not browser alert). |
| **AI itinerary** | Gemini 2.5 Flash generates day-by-day plan fitted to group's destination, budget, dates, and size |
| **Calendar links** | Google Calendar URL + .ics download after lock. Trip name, dates, destination, group size, URL included. |
| **Response tokens** | UUID per submission, stored in localStorage. Enables edit without organiser mediation. |
| **Organiser/participant split** | manage_key URL param = organiser. No key = participant. Different UX for each. |

### Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 16 (App Router) | Server components by default. No client JS where unnecessary. |
| Database | Supabase (PostgreSQL + Realtime) | Free tier, real-time subscriptions, RLS-ready. |
| AI | Gemini 2.5 Flash | 1-3s responses, structured JSON, low cost. 30s timeout via AbortController. |
| Styling | Tailwind v4 | Utility-first, mobile-first. Warm off-white (#FAF9F7) base. |
| Deploy | Vercel | Auto-deploy on push. Custom domain via Cloudflare CNAME. |

### Phased Roadmap

| Phase | Key Steps |
|-------|-----------|
| **Now (Validation)** | Share MVP with cohort + real friend groups. Collect: do participants actually respond? Does the organiser share the link? |
| **Next (V1.1)** | Itinerary share flow (organiser > participants). Destination price estimates via Gemini at creation. Experience recommendations with affiliate links (Viator/Klook API). Expense splitting (simple, group-fitted). |
| **Later (V2)** | Trip Trigger (proactive nudges when constraints align). Multi-trip dashboard. Dark mode. WhatsApp Business API integration for native entry. Anti-Agent recommendations. |

### Described But Not Built

| Feature | Why Deferred | PRD Status |
|---------|-------------|------------|
| Itinerary share flow | Organiser reviews first - share is a deliberate action, not auto-visible | Designed |
| Destination price estimates | Needs Gemini API call at trip creation + schema change | Designed |
| Experience affiliate links | Needs Viator/Klook API integration | Thesis validated |
| Multi-trip dashboard | No need until repeat usage proven | Conceptual |
| Dark mode | Tailwind v4 @theme incompatible with @media nesting - needs dark: variants per component | Attempted, reverted |
| AI nudge messages | WhatsApp-ready messages for organiser to paste - "Waiting on Yash, Priya" | Designed |

---

## 05  INSTRUCTION DESIGN

### Prototype Walkthrough

Open **nod.sunforged.work** on mobile (primary) or desktop. The full walkthrough takes ~5 minutes. The AI itinerary is live - generated in real time by Gemini 2.5 Flash, not mocked.

The flow has two personas navigating the same link. The **organiser** (identified via manage_key saved in localStorage - never visible in URL) sees creation controls, vote results, lock button, and AI itinerary. The **participant** sees the motivation block, voting form, and confirmation.

---

**Screen 1: Landing Page** - ~10s

The hero explains the product in one line: *"Group trips, decided."* Below it, a 3-step visual flow: Create > Share > Lock. A single CTA: "Plan a Trip." No sign-up required - the organiser starts immediately.

> Look for: No login wall. The value proposition is action-oriented ("decided"), not feature-oriented ("plan").

---

**Screen 2: Trip Creation** - ~60s

The organiser fills in: trip name (max 80 characters), 2-3 destination options (typed), a response deadline, and optionally selects holiday long weekends from a curated 2026 Indian calendar. Below the holidays, a custom date input (start + end) lets the organiser add any date range. Both share a 3-max limit. Budget guidance label clarifies "total trip budget - include travel, stay, food, and activities."

On submit, Supabase creates the trip record with a unique slug and manage_key. The organiser is redirected to the trip page. The manage_key is immediately saved to localStorage and stripped from the URL via `replaceState` - the address bar always shows the clean participant-safe URL.

> Look for: The holiday long weekend picker AND the custom date input below it. Selected dates appear as removable pills. The address bar should show no `?key=` parameter - the manage_key is never visible in the URL.

---

**Screen 3: Organiser's Trip Page** - ~30s

The organiser sees: a share bar (copy link, WhatsApp, iMessage), their own pre-filled voting form (name auto-filled, RSVP hidden - always "yes", message: "You're the organiser - just vote on your preferences below"), and an empty response section ("No responses yet. Share the link above.").

After submitting their own vote, the organiser sees real-time updates as participants respond - names appear without page refresh via Supabase Realtime.

> Look for: The share bar uses muted outline icons (not filled brand colours) to feel native, not promotional. WhatsApp and iMessage buttons pre-fill the message with trip name + link.

---

**Screen 4: Participant View** - ~30s

A participant opens the shared link (no `?key=` parameter). They see the **motivation block** before the form:

- Names of people who already responded: *"Priya and Rahul are in"*
- Friction reducer: *"Takes 30 seconds"*
- Deadline with consequence: *"Votes close Thursday - after that, the majority decides without you"*

Below: a streamlined form. **Core fields** (name, RSVP, destination vote pills, date vote pills, budget range) take ~30 seconds. **Optional fields** (headcount, group type, kids) are behind a "More details" toggle.

> Look for: The behavioural design - named accountability creates social pressure (nobody wants to be the blocker), the deadline uses loss aversion ("without you"), and the 30-second claim lowers perceived effort. These are the 4 levers from our participant motivation research: named accountability > deadline consequence > tiny ask > instant feedback.

---

**Screen 5: Confirmation + Edit** - ~10s

After submitting, the participant sees: how many people have responded, their names, and guidance: *"[Organiser] can lock the plan once everyone's in."* A response token (UUID) is stored in localStorage - if the participant reloads, they see an "Edit" link to update their response. Edits require the token (server-enforced), preventing impersonation.

> Look for: The edit flow solves multiple edge cases (wrong budget, changed mind on destination) without requiring organiser intervention. This is a deliberate design decision - reduce organiser burden at every interaction.

---

**Screen 6: Vote Results + Lock** - ~30s (organiser only)

Vote results are shown in a 2-column card grid: **Where** (destination tallies with map pin icon) and **When** (date tallies with calendar icon). The leading option is highlighted with bold text and a green bar; others are muted. Below, a compact **Responded** card shows participant name pills with a people icon. Status bar switches from "24h left to vote" to "Trip locked" or "Plan ready" based on trip state.

When ready, a "Lock Trip" button with an **inline confirmation** (not a browser `confirm()` dialog) freezes voting.

> Look for: Real-time updates. Open the organiser view and a participant view side-by-side - submit a vote in one tab and watch it appear in the other without refresh. The leading destination/date is visually distinct from others.

---

**Screen 7: AI Itinerary + Share + Next Steps** - ~5-10s generation

After locking, the organiser taps "Generate Itinerary." Gemini 2.5 Flash receives the full group context: winning destination, locked dates, budget range, group size. It returns a structured day-by-day plan.

The itinerary renders as a **collapsible timeline**: Day 1 expanded by default, Day 2+ collapsed. Each day header shows activity count and estimated cost ("4 activities, ~₹2,500"). Expanded days show a clean timeline: time | activity name | cost on one line, with compact "or [alternative]" text for options the organiser can swap. No descriptions - activity names are sufficient for scanning.

A **cost summary** below shows estimated total per person and whether it falls within the group's budget range. Below that, a **Share Plan** bar (copy link + WhatsApp + iMessage, matching the original share bar's icon pattern) lets the organiser send the plan to the group. The itinerary is visible to everyone once generated.

Finally, a **Next Steps** section provides outbound booking links in a 2x2 grid: Stay (Booking.com, Airbnb), Flights & Trains (MakeMyTrip, ixigo), Car Rental (Zoomcar), Activities (Klook, Viator). Each category has an icon. Stay links are pre-filled with destination, dates, and group size. These demonstrate the affiliate revenue model described in our business thesis.

> Look for: The collapsible days - tap Day 2/3 headers to expand. The timeline layout is ~60% less scroll than a card-per-activity design. Calendar links (Google Calendar + .ics) appear after lock with compact Google logo + download icon. The commitment ratchet: vote > lock > calendar > itinerary > booking links.

---

### How We Built Nod

**From research to working prototype in 4 sessions.**

**Session 1-2: Research.** 22+ interviews, 9-person survey, 65+ secondary sources. Three weeks of discovery before any code. The core insight: this is a decision problem, not a planning problem. The category risk analysis (300 dead startups, 5 failure modes, 3 survivors) shaped every product decision that followed.

**Session 3: Build + verify.** Built the core flow: create > share > respond > lock > generate. Added participant motivation design (named accountability, deadline consequence, 30-second form). Switched from polling to Supabase Realtime. Stress-tested every persona's view. Caught rendering bugs by mentally walking through each screen as organiser AND participant before handoff.

**Session 4: Harden.** Added date voting chain with holiday long weekend picker. Response tokens for edit-without-organiser. Security fixes (manage_key and response_token stripped from client payloads - `select(*)` leaks secrets via Next.js serialisation). Calendar links for commitment. Attempted dark mode, reverted (Tailwind v4 `@theme` is build-time only). Deployed to Vercel with custom domain.

### Key Technical Decisions

**Two personas, one link.** The organiser is identified by a manage_key saved to localStorage on first visit and immediately stripped from the URL via `replaceState`. No key in localStorage = participant. This eliminates authentication entirely - no login, no sign-up, no friction. The manage_key is never visible in the address bar and is stripped from all client-facing payloads.

**Response tokens for dedup + edit.** Each submission generates a UUID stored in localStorage. On reload, the token identifies the user - enabling edits without login. The token is server-enforced (participant ID + token must match) and stripped from client payloads.

**Holiday long weekend picker.** 2026 Indian national holidays are hardcoded in `lib/holidays.ts`. Long weekends are computed (holiday ± adjacent weekend). The organiser taps 2-3 options > they become votable date pills for participants. Curated list > calendar grid - faster on mobile, surfaces the scheduling insight that no competitor offers.

**Supabase Realtime, not polling.** Realtime subscriptions on `participants` (INSERT + UPDATE) and `trips` (UPDATE for lock/plan status). Publication must include ALL columns - after schema migrations, both tables are dropped and re-added to the publication. Learned this the hard way.

**AI itinerary with group context.** The Gemini prompt receives: destination, dates, budget range (validated: min ≤ max, no negatives), group size, and activity preferences. 30-second timeout via AbortController. Unified error message: *"Couldn't generate the plan. Tap to try again."* The group context - not available to any individual ChatGPT prompt - is the quality differentiator.

### What We'd Do Differently

1. **Start with the holiday calendar.** It's the most differentiated feature and should have been P0 from day one. We almost deferred it entirely - building it late in Session 3 was the right call but a close miss.
2. **Test with a real group earlier.** The prototype was stress-tested by walking through personas, not by sharing with an actual friend group during build. Real group behaviour would have surfaced motivation issues sooner.
3. **Security audit earlier.** We found open RLS policies and manage_key URL exposure late in the build. Running a security checklist after the first deploy would have caught these sooner.

---

## 06  APPENDIX

### Security Audit & Mitigations

We conducted a full security audit of the prototype against OWASP top 10. Here is what we found, what we fixed, and what remains as known limitations.

**Fixed in prototype:**

| Issue | Severity | Fix |
|-------|----------|-----|
| manage_key exposed in URL | Critical | Key saved to localStorage on first visit, stripped from URL via `replaceState`. Address bar always shows clean participant URL. |
| Negative/invalid budgets accepted | Medium | Server-side validation: no negatives, min must not exceed max. |
| `JSON.parse` crash on malformed date options | Medium | Try-catch with graceful fallback (no dates). |
| Invalid deadline values (negative, NaN) | Medium | parseInt validation: must be 1-30 days. |
| No input length limits | Medium | Server-side: trip name max 80, participant name max 50, destination max 100 chars, max 6 destinations. |
| Hydration mismatch corrupting component tree | Critical | Moved localStorage reads from useState to useEffect. Replaced Tailwind v4 `break-words` class with inline style. |
| `select(*)` leaks secrets | Critical | Explicit column selection; manage_key and response_token stripped before client serialisation. |
| Duplicate submissions | Medium | localStorage response_token prevents re-submission; edit flow for updates. |

**Known limitations (acceptable for MVP, planned for V1.1):**

| Issue | Severity | Why not fixed | V1.1 plan |
|-------|----------|--------------|-----------|
| RLS policies are fully open | Critical | No user auth = can't write meaningful row-level policies. The public Supabase anon key combined with `using (true)` policies means any browser can query manage_key and response_token directly via DevTools. | Add row-level policies that check manage_key on trip mutations and response_token on participant updates. Evaluate adding lightweight auth (magic link or passkey). |
| Realtime broadcasts response_token | Critical | Supabase publication includes all columns. Changing it requires SQL migration (risky before deadline). | Create a database view excluding secrets, publish the view instead of the raw table. |
| No rate limiting on generate-itinerary | Medium | Needs Vercel Edge middleware. | Add rate limiting per IP (max 5 calls per trip per hour). |
| Prompt injection via names/destinations | Medium | Participant and destination names are interpolated directly into the Gemini prompt. | Strip control characters, enforce max length, and add instruction boundary markers in the prompt. |
| Deadline not enforced server-side | Low | Client hides form after deadline, but a direct API call could still submit. | Add server-side deadline check in participant insert/update. |

**Security architecture note:** Nod deliberately has no user accounts - zero friction is a core product principle (55% of survey respondents won't download an app, let alone create an account). This means traditional auth-based security is unavailable. The manage_key and response_token pattern provides pseudo-auth for MVP. V1.1 should evaluate whether lightweight auth (magic links, passkeys) can be added without breaking the "30-second participation" promise.

### Diagrams

Rendered from Mermaid source at `PRD-diagrams.md`. Includes: Organiser Flow, Participant Flow, System Architecture, Trip Lifecycle, Commitment Ratchet, and Data Flow diagrams.

### First-Time User Flows

**Organiser (creates a trip):**

1. Opens nod.sunforged.work. Sees "Group trips, decided." and taps "Plan a Trip."
2. Fills creation form: trip name, 2-3 destination options, response deadline, optional holiday long weekends. Budget label clarifies "total trip budget."
3. Submits. Supabase creates trip record with unique slug and manage_key. Organiser redirected to `/trip/[slug]`. The manage_key is saved to localStorage and stripped from the URL immediately - address bar always shows the clean link.
4. Votes on own preferences (name pre-filled, RSVP hidden - always "yes").
5. Shares link via copy, WhatsApp, or iMessage. Message pre-fills: "[Trip name] - vote on where and when! [link]"
6. Watches responses arrive in real time (Supabase Realtime, no refresh needed).
7. Reviews vote tallies: destination bars, date bars, budget overlap. Sees guidance: "2 of 4 confirmations needed to lock."
8. Taps "Lock Trip" when ready. Inline confirmation (not browser alert). Voting freezes.
9. Taps "Generate Itinerary." Gemini 2.5 Flash receives group context (destination, dates, budget, group size). Returns day-by-day plan in 5-10 seconds.
10. Reviews TripSummary (estimated total per person vs. group budget range). Adds winning dates to Google Calendar or downloads .ics file.

**Participant (responds to a shared link):**

1. Receives link in WhatsApp or iMessage. Taps it. No app download, no login, no sign-up.
2. Sees motivation block: "Priya and Rahul are in. Takes 30 seconds. Votes close Thursday - after that, the majority decides without you."
3. Fills form (~30 seconds): name, RSVP (yes/maybe/no), taps destination pills, taps date pills, drags budget range.
4. Optionally expands "More details" for headcount, group type, kids.
5. Submits. Response token (UUID) saved to localStorage.
6. Sees confirmation: "3 people have responded. [Organiser] can lock the plan once everyone's in."
7. If they return later, the token identifies them. "Edit" link pre-fills their existing data. Edits require token match (server-enforced).
8. When organiser locks and generates: realtime status update. Participant sees the itinerary + booking links.

### System Architecture

```
Browser (Mobile-first)
  |
  +-- Landing Page (page.tsx)
  +-- Trip Creation Form (create-trip-form.tsx)
  +-- Trip View (trip-view.tsx)
  |     +-- Motivation Block
  |     +-- Participant Form (participant-form.tsx)
  |     +-- Confirmation Block
  |     +-- Share Bar (share-bar.tsx)
  |     +-- Status Bar (status-bar.tsx)
  +-- Vote Results (vote-results.tsx)
  +-- Itinerary View (itinerary-view.tsx)
  |
  +-- Server Actions (actions.ts)
  |     +-- createTrip()
  |     +-- submitParticipant()
  |     +-- updateParticipant()
  |     +-- lockTrip()
  |
  +-- API Route (/api/generate-itinerary/route.ts)
  |     +-- Gemini 2.5 Flash
  |     +-- 30s timeout (AbortController)
  |     +-- Group context prompt
  |
  +-- Supabase
  |     +-- PostgreSQL: trips, participants tables
  |     +-- Realtime: INSERT/UPDATE subscriptions
  |     +-- Publication: ALL columns (drop + re-add after schema changes)
  |
  +-- Utility Libraries
        +-- holidays.ts (2026 Indian national holidays)
        +-- calendar.ts (Google Calendar URL + .ics generation)
        +-- slug.ts (unique trip slug generation)
        +-- supabase.ts (client initialisation)
```

### Trip Lifecycle States

```
CREATED --> OPEN --> LOCKED --> PLANNED
  |           |        |          |
  Trip form   Votes    Freeze     AI itinerary
  submitted   arrive   voting     generated
              via RT              visible to all
```

- **CREATED**: Organiser submits form. Trip exists in Supabase with slug + manage_key. No participants yet.
- **OPEN**: Trip page is live. Participants vote. Organiser sees real-time updates. Status bar shows deadline.
- **LOCKED**: Organiser freezes voting. Results are final. Calendar links appear. No more submissions or edits.
- **PLANNED**: AI itinerary generated from group context. Visible to everyone. TripSummary shows cost vs. budget. Next steps booking links shown.

### How We Built Nod

**Week 1-2: Discovery (no code)**

Started with 10 user interviews across friend groups, families, and trip organisers. Mapped the group trip journey end-to-end. Ran a 9-person survey to quantify pain points. Conducted competitive analysis of 14 tools (Wanderlog, TripIt, Splitwise, Lambus, Tripsy, Layla AI, Mindtrip, and others). Analysed 65+ secondary sources including academic research on social loafing, paradox of choice, and commitment devices.

The critical finding: this is the highest-failure vertical in travel (~300 dead startups). We spent two full days on category risk analysis before writing a single line of product spec. The output: 5 failure modes, 3 survivor strategies, and a clear thesis (C+D: WhatsApp-compatible link + monetise during trip via experience affiliate).

**Week 2: Batch 2 interviews + synthesis**

12 additional interviews (Akanksha's cohort) broke three assumptions: budget IS the root cause (not scheduling), the organiser is a network node (not the persona), and alignment is the entire product (not planning). These findings restructured the MVP scope from 12 features to 7.

**Week 3: Build + deploy**

Built in Next.js 16 (App Router) with Supabase and Gemini 2.5 Flash. Server components by default. The key build decisions:

- **No auth**: manage_key in URL = organiser. No key = participant. Zero friction.
- **Response tokens**: UUID per submission in localStorage. Enables edit without login.
- **Supabase Realtime**: Replaced polling with INSERT/UPDATE subscriptions. Publication must include ALL columns (learned the hard way after schema migration broke realtime).
- **Holiday picker**: Hardcoded 2026 Indian holidays in `lib/holidays.ts`. Computed long weekends. Curated list, not calendar grid.
- **AI itinerary**: Single Gemini endpoint. Group context (destination, dates, budget, size) in prompt. 30-second timeout. Structured JSON response.

Deployed to Vercel with custom domain (nod.sunforged.work via Cloudflare CNAME).

**Week 3-4: Harden + verify**

Comprehensive E2E testing found and fixed: manage_key leaked via `select(*)`, duplicate submissions, budget min > max sent to Gemini, React key collisions, `redirect()` error handling, and a space-concatenation bug ("Aditiwill" instead of "Aditi will"). Added date voting chain, response token edit flow, inline lock confirmation, calendar links (Google Cal + .ics).

Attempted dark mode, reverted (Tailwind v4 `@theme` is build-time only, can't nest in `@media` query). Documented as post-MVP.

**Key iterations that shaped the product:**

1. **Motivation block** - Originally the form was just a form. Testing showed no reason for a participant to fill it out. Added: named accountability ("Priya and Rahul are in"), deadline consequence ("majority decides without you"), tiny ask framing ("takes 30 seconds"). Behavioural levers ranked: named accountability > deadline > tiny ask > instant feedback.

2. **Organiser as participant** - Initially the organiser had a separate admin view. Changed to: organiser votes through the same form (name pre-filled, RSVP hidden). This reduced code complexity and made the organiser a participant, not just a manager.

3. **Calendar as commitment device** - Calendar links were originally at the bottom of the itinerary. Moved them to appear after lock, before itinerary. The commitment ratchet: vote (low commitment) > lock (frozen) > calendar (date blocked in your calendar) > itinerary (concrete plan). Each step makes backing out harder.

4. **Budget label clarity** - "Budget" was ambiguous. Some users entered per-day, others per-person, others total trip. Fixed with explicit label: "Total trip budget (include travel, stay, food, and activities)." One label change, zero confusion.

5. **Itinerary visibility** - Initially organiser-only. Changed back to visible to everyone once generated, with a "Share Plan" bar so the organiser can proactively send the link via WhatsApp/iMessage. Gating added no value - the organiser already reviewed by generating. Next steps booking links (Booking.com, Airbnb, MakeMyTrip, ixigo, Klook, Viator) appear below for the whole group.

### File Structure

```
nod/
  app/
    page.tsx                      Landing page
    create-trip-form.tsx          Trip creation (client component)
    actions.ts                    Server actions (create, submit, lock)
    layout.tsx                    Root layout
    error.tsx                     Error boundary
    loading.tsx                   Loading spinner
    api/
      generate-itinerary/
        route.ts                  Gemini 2.5 Flash endpoint
    trip/
      [slug]/
        page.tsx                  Trip page (server component)
        trip-view.tsx             Main trip view (organiser/participant split)
        participant-form.tsx      Voting form
        vote-results.tsx          Tallies + lock button
        itinerary-view.tsx        AI plan + TripSummary
        share-bar.tsx             Copy/WhatsApp/iMessage
        status-bar.tsx            Deadline display
  lib/
    supabase.ts                   Client initialisation
    holidays.ts                   2026 Indian holidays
    calendar.ts                   Google Cal URL + .ics generation
    slug.ts                       Unique slug generation
  research/                       Interviews, surveys, competitor analysis
  insights/                       Personas, synthesis, brainstorms
  knowledge/                      Session journals, decisions, principles
```
