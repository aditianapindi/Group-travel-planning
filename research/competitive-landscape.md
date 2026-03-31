# Competitive Landscape — Group Travel Planning Apps

## Market Overview
No single app handles the full group trip lifecycle. Users combine 2-4 apps per trip. This fragmentation IS the opportunity.

---

## Tier 1: True Group Planning Apps

### Wanderlog (Market Leader)
- **What**: Collaborative itinerary builder + maps + route optimization
- **Group features**: Real-time co-editing (Google Docs-style), shared maps, expense tracking
- **Ratings**: 4.7+ App Store / Google Play (but 1.9/5 Trustpilot — signals deeper frustration)
- **Pricing**: Free / Pro $4.49/mo
- **Market**: Global, strong US
- **Key weakness**: Premium features DON'T extend to group members (only purchaser benefits). Couples treated as individuals — shows partners owing each other money. Weak multi-currency handling.

### Pilot
- **What**: Free trip planner + hotel booking, AI learns group preferences
- **Group features**: Shared trip, co-planning, AI suggestions
- **Pricing**: 100% free (funded via premium services / company retreats)
- **Market**: Global, US
- **Key weakness**: Newer, less mature. Free model sustainability unclear.

### Tripsy
- **What**: All-in-one trip organizer
- **Group features**: Granular permissions (edit/view/create), activity assignment, expense tracking
- **Pricing**: Freemium
- **Key weakness**: More complex interface than competitors

### Frienzy
- **What**: Group planner + photo sharing + scrapbook
- **Group features**: Itinerary sharing, auto expense splitting, in-app group chat, AI itinerary from doc uploads
- **Ratings**: 4.57/5 (334 reviews)
- **Pricing**: Freemium
- **Key weakness**: Leisure-only focus

### AvoSquado
- **What**: Accommodation-focused group planner
- **Group features**: Bedroom assignments (unique!), 400K+ bookable activities via Viator
- **Pricing**: Free
- **Key weakness**: Niche (accommodation-heavy), smaller community

---

## Tier 2: Decision-Making Phase Tools

### Troupe (by JetBlue)
- **What**: Early-stage group planning with ranked-choice voting + RSVP
- **Group features**: Polling, voting, democratic decisions
- **Pricing**: Free
- **Key weakness**: Only handles planning phase — no itinerary building, no expenses

### Howbout
- **What**: Calendar coordination + itinerary planning
- **Group features**: "When is everyone free?" visualization + voting
- **Key weakness**: Narrow use case

### Let's Jetty
- **What**: Collaborative itinerary + survey/polling + RSVP
- **Key weakness**: Less focus on detailed logistics

---

## Tier 3: Expense-Only Tools

### Splitwise (Dominant)
- **What**: Expense tracking + settlement
- **Users**: 17M+
- **Key weakness**: No trip planning. No itinerary. Only useful AFTER spending. Per-trip context lost when creating multiple groups.

### Tricount
- **Ratings**: 4.46/5 (141K reviews)
- **Key weakness**: Recent updates removed features, introduced bugs per user complaints

---

## Tier 4: Individual Travel Apps (No Real Group Features)

### TripIt
- **What**: Itinerary consolidator via email parsing
- **Key weakness**: View-only sharing. No collaborative editing. Solo business traveler focus. Pro $49/yr.

### Google Travel
- No group features at all

### MakeMyTrip / Booking.com
- Individual booking only, no group coordination layer

---

## Tier 5: AI-Powered Newcomers

### Mindtrip — AI trip planning with @mentions for AI suggestions in group chat
### GroupTripper — AI-powered voting + shared memories + expense settle-up (first trip free, then paid)
### iMean AI — Claims to understand multi-person group requests
### FlowTrip (2025 launch) — Event-specific (bachelorette, festivals), screenshot upload feature

---

## Tier 6: Experiences Marketplaces (Integration Partners)

Not competitors — potential affiliate/integration partners. These platforms sell tours, activities, and experiences and offer affiliate programs that could be a monetization layer for a planning tool.

### Klook
- **What**: Asia-Pacific-dominant experiences marketplace (tours, attractions, transport)
- **Revenue**: $417M in 2024 [Source: user-provided — UNVERIFIED against public filings. Klook is private; verify if IPO prospectus becomes public]
- **Funding**: $1B+ raised [Source: Crunchbase lists $720M+ through Series E; total including debt may exceed $1B — treat as directional]
- **IPO**: Filed confidentially for NYSE listing (reported 2024-2025) [Source: Bloomberg, Reuters reporting on confidential IPO filing]
- **Affiliate program**: Yes — commission-based
- **India relevance**: Strong Southeast/East Asia presence, expanding into India

### Viator (TripAdvisor-owned)
- **What**: Largest global experiences marketplace. 300K+ bookable experiences.
- **Affiliate program**: Yes — 8% commission standard. Already integrated by AvoSquado (400K+ activities in their app via Viator API).
- **Key strength**: Deep inventory, trusted brand, well-documented API

### GetYourGuide
- **What**: Berlin-based experiences marketplace. Strong Europe coverage.
- **Funding**: $680M+ raised [Source: Crunchbase]
- **Affiliate program**: Yes — commission-based
- **Key strength**: Curated quality, strong European inventory (complements Klook's Asia strength)

### Why experiences, not hotels/flights
**Experiences bookings have weaker leakage dynamics than hotels and flights.** When someone finds a flight in a planning tool, they open Kayak/Google Flights to comparison-shop — the planning tool loses the transaction. But nobody comparison-shops a "street food walking tour in Jaipur" across 38 sites. The experience is unique to the marketplace, the price is fixed, and the user books where they discover it. This makes experiences affiliate revenue stickier and higher-converting than hotel/flight referrals.

**Implication**: If the product integrates experiences into the itinerary (e.g., "your group voted for Jaipur — here are top-rated tours"), the booking happens in-context. The planning tool becomes the discovery layer, and experiences marketplaces become the fulfillment layer. This is a monetization path that doesn't require becoming an OTA.

---

## India-Specific

### Holidify
- India's largest travel platform, 10M+ monthly sessions
- Agent-based model (3,000+ verified agents)
- NOT peer-to-peer group planning

**Gap**: No India-optimized group coordination app exists. Global apps available but lack India-specific features (festival calendars, budget ranges, family dynamics).

---

## The "Good Enough" Stack: ChatGPT + Google Docs

### What it is
Not an app — a behavior pattern. One person prompts ChatGPT (or Gemini, Copilot) to generate an itinerary, pastes it into a Google Doc or Sheet, shares the link on WhatsApp, and says "edit if you want." No download, no signup, no learning curve.

### Why it matters
- **Zero adoption friction** — everyone already has Google Docs and a chat app
- **Surprisingly capable** — AI-generated itineraries cover flights, hotels, day plans, restaurants, estimated costs in seconds
- **Free** — no subscription, no per-trip fee
- **Already habitual** — Google Docs is the default "shared workspace" for most groups, especially among younger users and Indian diaspora groups coordinating cross-timezone trips

### What it gets wrong
- **No structure** — a doc is a wall of text. No voting, no budget alignment, no task assignment. Decisions happen in a parallel WhatsApp thread and get lost
- **Single-author problem** — one person generates, pastes, and maintains. Others comment at best. The organizer burden isn't reduced, it's just moved
- **No state management** — can't track who's confirmed, who's paid, what's booked vs. tentative. Manual status updates rot fast
- **No trip-phase awareness** — same flat doc from brainstorming through to day-of. No contextual views (what's happening today? what do I owe?)
- **Fragmentation persists** — still need Splitwise for expenses, WhatsApp for chat, Google Maps for navigation. The stack multiplies, it just starts differently

### Strategic implication
This is the real baseline to beat — not Wanderlog or Frienzy. Most groups will never search "group travel app." They'll ask ChatGPT. The product must be **faster to start than prompting ChatGPT** and **immediately more useful than a shared doc** or adoption won't happen. That means: paste a destination + dates → get a structured, interactive plan with voting and budget built in, shareable via a single link — no app install required for participants.

---

## Key Competitive Insights

### What NOBODY does well:
1. **Full lifecycle** — plan → decide → book → travel → settle (always fragmented)
2. **Budget transparency** — anonymous budget collection BEFORE planning starts
3. **Couples/families as units** — every app treats groups as collections of individuals
4. **Passive member activation** — nudges that require action, not just notifications
5. **Bedroom/room coordination** — only AvoSquado attempts this
6. **Organizer burden distribution** — no app assigns tasks to distribute workload
7. **Planning-phase timing** — no app intercepts at the right moment. International trips need 3-6 months; India festival travel has a gap between ideal (2-3 months) and actual (<1 week) planning. See `research/planning-lead-times-and-organizer-patterns.md`

### What users actually combine today:
| Trip Type | Typical Stack |
|-----------|---------------|
| Road trip with friends | Wanderlog + Splitwise |
| Family vacation | Frienzy or AvoSquado + Tripsy |
| Casual group | Pilot (free all-in-one) |
| Decision phase only | Troupe or Howbout → then switch apps |
| "Good enough" default | ChatGPT → Google Doc/Sheet → WhatsApp + Splitwise |

### The real competitor isn't an app:
The emerging "good enough" stack — ChatGPT → Google Doc → WhatsApp — doesn't appear in any app store analysis but is increasingly how groups actually plan. One person prompts an AI, pastes the output into a shared doc, and coordinates in chat. Zero adoption friction, zero cost. It fails at structure, state management, and organizer burden — but most groups will try this before searching for a planning app. Full analysis in the "Good Enough Stack" section above.

### The quote that summarizes the market:
> "The best group planning apps lack voting, the best decision-making app doesn't build itineraries, and the most popular expense tool doesn't plan anything at all."
