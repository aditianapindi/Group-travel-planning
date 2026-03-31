# Synthesis Brainstorm — March 30, 2026

## Decisions Reached (Pending Final Lock)

### Product Concept: Agentic Trip Coordinator (Link, Not App)
- AI agent that drives the trip lifecycle — nudges, generates options, recommends experiences
- Organizer creates a trip in 1 minute, shares a link in WhatsApp
- Participants click the link and contribute (vote, submit budget, RSVP) in 30 seconds each
- Agent uses GROUP context (budget, preferences, dates, group size) to generate personalized itineraries — richer than any individual ChatGPT prompt
- Agent generates WhatsApp-ready messages for the organizer to paste (updates, nudges, results)

### Persona Model
| Layer | Who | Role |
|-------|-----|------|
| Acquisition | Friend group organizer (India) | Creates the trip, shares the link |
| Design priority | The participant | 30-second interactions or they bounce |
| Unit of value | The group / trip | Value emerges from collective input |
| Monetization | The group's activity | Experience affiliate commissions |

**Key reframe:** The organizer is the acquisition channel, not the persona. Every dead startup built for the organizer alone. The product must serve the GROUP — the participant experience is what makes or breaks adoption.

### Market: India-First (for PRD), Test with Anyone (for MVP)
- India-first is the right PRD story (WhatsApp thesis, no competitor, interview coverage)
- For testing, share the link with whoever will use it — cohort, India friends, US friends
- A link works everywhere. Market thesis is for PRD framing, not MVP testing.

### Pain Points — Prioritized by Survey + Interview Evidence
| Priority | Pain Point | Survey Signal | Interview Signal | MVP Feature |
|----------|-----------|---------------|-----------------|-------------|
| P0 | Scheduling conflicts | 56% #1 frustration | Ruchi: 6 weeks to agree | Date coordination |
| P0 | Decision paralysis | 33% frustration, 44% want voting | Interviewee 3: "ran polls" | Destination voting with deadline |
| P0 | Expense splitting | 56% most wanted feature | Splitwise friction: 3/day limit, dietary splits | Simple expense tracker |
| P1 | Budget conflict | 0% survey, but 59% tension (secondary research) | Manohar: real financial harm | Anonymous budget alignment |
| P1 | Organizer burnout | 11% frustration | 71% stressful, 10+ hrs/trip | Distributed input via trip page |
| P2 | Passive members | 0% frustration | Vinay problem | 30-second interaction design |
| P2 | Info fragmentation | Not surveyed | Most frequently mentioned in forums | Trip page IS the single source of truth |

### Business Model: Free + Affiliate
- 78% of survey respondents: free only. Subscription is dead for MVP.
- Thesis C+D: WhatsApp-compatible link + monetize during/after trip
- D.1: Experience affiliate commissions (Klook, Viator, GetYourGuide)

---

## Critical Reassessment

### What we're now confident about
1. **Product concept works:** Shareable trip page + AI with group context IS different from 300 dead startups (no download, AI with group context, value to participants not just organizers)
2. **Group context is the real moat:** ChatGPT gets one person's prompt. This agent gets: 6 confirmed, Oct 15-18, budget ₹8K-15K, 4 voted beach, 2 cultural, 1 vegetarian. Richer input → better output.
3. **Compass stack is the right build approach:** Single HTML + Supabase + Gemini API + Vercel. Proven, capable, no Lovable needed.
4. **Thesis C+D holds:** WhatsApp-compatible link (not native) + free planning + monetize via experience affiliate.

### What we're second-guessing
1. **"Agentic" might oversell what MVP actually is.** In practice: forms + AI content generation. That's fine — Compass had hardcoded interview responses. Vision in PRD, working core in MVP.
2. **Anonymous budget has no pull.** Zero survey respondents picked it. 77% are open to it but nobody is excited. Include it in the flow, don't lead with it. The hero is: "Plan your group trip in 5 minutes instead of 50 messages over 2 weeks."
3. **Feature list is too long.** Cut to hard MVP:

### Hard MVP Scope (7 features, 3-4 days)

| Build | Skip for now |
|-------|-------------|
| Trip creation (form → Supabase) | Date coordination grid (just use text) |
| Shareable link (`/trip/[id]`) | AI nudge messages |
| RSVP (yes/maybe/no) | Expense tracking (Splitwise exists) |
| Destination voting (with deadline) | AI WhatsApp message generator |
| Anonymous budget input + range display | |
| AI-generated itinerary (after destination + budget set) | |
| Trip page showing group status | |

### The One Thing Everything Depends On
Will the organizer **share the link** in their WhatsApp group?

The link must offer something they CANNOT do in WhatsApp:
- "Vote on where to go" → weak (WhatsApp polls exist)
- "Submit budget anonymously" → strong (impossible in WhatsApp)
- "AI generates a plan fitted to your group" → strongest (no individual prompt has group context)

**The hook:** "Share this link in your group. In 5 minutes you'll know where everyone wants to go, what everyone can afford, and get a plan that actually fits. No more 50 messages."

---

## Trip Journey Map — Friction & Value Analysis

| Stage | What Happens Today | Friction | Product Value | Revenue |
|-------|-------------------|----------|---------------|---------|
| 1. Spark | "Let's go somewhere" in WhatsApp | Low | None — don't own this | None |
| 2. Who's in | Organizer asks, 3 reply, 2 never respond | Moderate | RSVP with visible count creates social pressure | None (first click) |
| 3. When | WhatsApp poll, 3/7 vote, expires | High | Availability overlap visualization | None |
| 4. Where | 12 destinations, no resolution, 6 weeks (Ruchi) | Very High | Structured multivote with deadline | First hook: destination → activity recs |
| 5. Budget | Never discussed. Manohar: paid more. 59% tension. | Extreme | Anonymous range collection — impossible in WhatsApp | Strategic data for recommendations |
| 6. Planning | One person makes Google Sheet. ChatGPT itinerary. | High (organizer) | AI itinerary using group context | Experience affiliate |
| 7. Booking | Everyone books separately on OTAs | Moderate | Don't fight this. Accept affiliate on experiences. | Leaky for hotels/flights, sticky for experiences |
| 8. During trip | Organizer = GPS + concierge + accountant | High | Live itinerary + expense tracking | Proven monetization zone (Wanderlog/Splitwise) |
| 9. Post-trip | Messy Splitwise, incomplete, unpaid | High | Settlement view | Future revenue |

**MVP sweet spot: Stages 2-6** (alignment → AI-generated plan)

---

## Survey Results Summary (n=9)

### Key Findings
- **#1 frustration:** Scheduling conflicts (56%), not budget (0%)
- **#1 desired feature:** Expense splitting (56%), then voting (44%). Anonymous budget: 0%.
- **Adoption wall:** 55% won't download an app. 33% say "WhatsApp is fine."
- **WTP:** 78% free only. Subscription is dead.
- **Budget sharing:** 44% yes, 33% depends, 22% no — open to it but not excited

### Implications
- Lead with speed/simplicity ("5 minutes vs 50 messages"), not any single feature
- Budget alignment is a supporting feature, not the hero
- Expense splitting is most wanted → include in MVP if possible, or acknowledge it's V2
- Must be free. Monetize through affiliate, not subscription.
- Link-based (no download) is validated by the adoption data

---

## Technical Stack
- **Frontend:** Single HTML file, vanilla JS, Tailwind CDN, mobile-first (same as Compass)
- **Backend:** Supabase (auth + database + realtime) + Vercel serverless functions
- **AI:** Gemini 2.5 Flash API for itinerary generation, activity recommendations, nudge messages
- **Deploy:** Vercel (auto-deploy from GitHub)

### Supabase Schema (Draft)
- `trips` — id, name, destination_options[], date_options[], status, created_by, created_at
- `participants` — trip_id, name, rsvp (yes/maybe/no), budget_min, budget_max, votes[], created_at
- `expenses` — trip_id, paid_by, amount, description, split_among[], created_at

### AI Serverless Functions (Draft)
- `/api/generate-itinerary` — group context → structured itinerary
- `/api/recommend-activities` — destination + budget → activity suggestions
- `/api/generate-nudge` — trip state → WhatsApp-ready nudge message

---

## Batch 2 Interview Analysis (12 new interviews — Akanksha's batch)

### What changed after 22+ total interviews

**Budget moves back to P0.** Survey said 0% frustration, but 3 new interviews (Yash, Ashik, Eswar) reveal budget is the HIDDEN root cause of destination disagreements. Yash: ₹70k eliminated 5 of 7 people. Ashik: "place and budget are interlinked." Survey measured stated frustration; interviews reveal root cause. They're different layers of the same problem.

**Sabya's "nodes" model.** Organizers aren't just planners — they're 1-2 network nodes who activate interest. The product needs to find 1 node, not 6 users. Key quote: "There is always a push — you need a core knit group with a couple of nodes who can generate interest."

**Omkar validates MVP scope.** "Once dates and location are locked, the rest of the planning becomes straightforward." The alignment phase IS the product.

**Agent distrust pattern (3+ interviews).** Shardul, Yash, Ravi Kaka — agents optimize for their economics. Opens trust angle for an AI that optimizes for the GROUP.

**New pain: dropout financial loss.** Advance payments not refunded when someone drops (Shardul, Ashik). Slot replacement mechanism — unique, but V2.

### Revised priority after 22+ interviews

| Priority | Pain Point | Evidence |
|----------|-----------|----------|
| P0 | Date + destination alignment | Universal. Both batches + survey. Omkar: "once locked, rest is easy." |
| P0 | Budget as hidden filter | Survey 0%, but root cause per interviews (Yash, Ashik, Eswar). Reconciled. |
| P0 | Expense splitting | Survey #1 desired feature (56%). Splitwise friction in 5+ interviews. |
| P1 | Passive members / dropouts | Both batches. NEW: dropout = financial loss. |
| P1 | Scattered communication | Varun: "single container." Universal. |
| P1 | Agent/review distrust | 3+ interviews. Agents optimize for themselves. |
| P2 | Organizer burnout | Symptom, not root cause. Solve alignment → burnout drops. |

---

## Product Direction: A + B

### What we rejected: The generic "trip planning app with AI"
The 90% answer any AI would give. Shared trip page + voting + AI itinerary. Not differentiated enough.

### What we're building instead:

**Concept A: "The 5-Minute Lock" (MVP)**
A GROUP DECISION ENGINE, not a planning tool. Does ONE thing: collapses the 50-message, 2-week alignment ordeal into 5 minutes.

Each person gets a link. 60 seconds each: when are you free? Budget range? Beach/mountain/city? Engine computes overlap: "You can all do Oct 15-18. Budget overlap: ₹8-12k. 4/6 prefer beach → Goa fits. Lock it?"

After alignment, hand off. ChatGPT for itinerary. Splitwise for expenses. This product solves ONLY the problem nobody else solves.

**Why different:** No competitor does group constraint resolution. ChatGPT can't (needs simultaneous inputs from 6 people). WhatsApp can't (unstructured). Doodle does dates only. Nobody combines dates + budget + preferences into overlap computation.

**Concept B: "The Trip Trigger" (PRD vision / V2)**
After first trip, the product has group constraint data. Quietly watches for moments when everything aligns. Nudges the NODE only (not 6 people) when: dates overlap + deal fits budget + preferences match.

Design rules to avoid spam:
1. Only the node gets notified, not the group
2. Only fire on FULL overlap (all constraints match)
3. User-initiated triggers (opt-in, like Google Flights alerts but for groups)
4. Max 1 trigger/month per group

**Why different:** No travel product is proactive. Everything waits for users to search. This comes to the user when conditions align.

**Concept C: "The Anti-Agent" (V2 / expansion)**
Three interviews confirmed agents optimize for their own economics — wrong season for activities (Ravi Kaka), rigid scheduling with no breathing room (Shardul), optimized for agent costs not traveler experience (Yash). Position the AI explicitly as the anti-agent:

*"Agents optimize for their commissions. This optimizes for your group."*

The AI knows what 6 people agreed on (budget, dates, preferences) and recommends stays, activities, restaurants optimized for the GROUP's constraints — not for affiliate commissions or agent convenience. Full transparency about why each recommendation is made: "Suggesting this spice tour because 4/6 voted cultural + it's ₹750/person (within your ₹8-12k range) + 4.6★ rating from 800+ reviews."

**Why different:** The group context (6 people's combined constraints) produces recommendations no individual search can match. An individual searching "things to do in Goa" gets generic results. The Anti-Agent knows: 6 people, Oct 15-18, ₹8-12k budget, 4 prefer cultural, 1 vegetarian, 2 want nightlife — and recommends accordingly. This is the data moat.

**Revenue model:** Still affiliate commissions (Klook, Viator, GetYourGuide), but recommendations are genuinely group-optimized, not commission-optimized. Trust is the differentiator — users book through the tool because they trust the recommendations aren't self-serving. This is the opposite of agent economics and the opposite of how OTAs rank results (by commission tier).

**How C connects to A + B:**
- A (5-Minute Lock) collects the constraints → creates the group context
- B (Trip Trigger) uses that context to find opportunities proactively
- C (Anti-Agent) uses that context to make group-fitted recommendations that earn trust + revenue

A is the wedge. B is retention. C is monetization. Each builds on the data the previous concept collects.

**Risks:**
- Must prove recommendations are ACTUALLY better than generic search. If AI just generates the same Goa itinerary regardless of group context, there's no moat.
- Affiliate revenue depends on volume. Need enough bookings per trip to matter (~$40-75/trip for a group of 6, per Thesis D.1 analysis).
- Akshay and Varun explicitly distrust AI-generated content. The Anti-Agent must feel human-curated, not auto-generated. Consider: verified reviews only, sources cited, "why this recommendation" transparency.

**A + B + C solves the full lifecycle:** A earns trust on Trip 1 (alignment). B keeps the relationship alive between trips (trigger). C monetizes during the trip (recommendations). This is the "why different" the 300 dead startups didn't have.

---

## Still to Discuss Before Build Phase
- Screens and interaction design
- Non-AI styling direction
- Hosting and domain
- Detailed technical architecture

## Open Questions for Interviews
- Do serial organizers plan for 2-3 distinct groups/year?
- Would your group click a link to vote/submit budget, or ignore it?
- What triggers planning — a date, a conversation, a festival, a deal?
- Would AI-generated itinerary suggestions feel helpful or generic?
