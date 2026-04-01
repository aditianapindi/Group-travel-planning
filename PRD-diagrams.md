# Nod PRD - Mermaid Diagrams

Paste each diagram into https://mermaid.live to render as PNG for Google Docs.

---

## 1. Organiser Flow (First-Time User)

```mermaid
flowchart TD
    A["nod.sunforged.work"] --> B["Landing Page\n'Group trips, decided.'"]
    B --> C["Tap 'Plan a Trip'"]
    C --> D["Trip Creation Form\nName, destinations, deadline,\nholiday weekends, budget guidance"]
    D --> E["Submit\nSupabase creates trip + slug"]
    E --> F["Trip Page\n?key=manage_key in URL"]
    F --> G["Organiser votes\nName pre-filled, RSVP hidden"]
    F --> H["Share link\nCopy / WhatsApp / iMessage"]
    H --> I["Wait for responses\nRealtime updates via Supabase"]
    G --> I
    I --> J{"Enough responses?"}
    J -- "Yes" --> K["Review vote tallies\nDestination + date + budget overlap"]
    J -- "No" --> I
    K --> L["Lock Trip\nInline confirmation"]
    L --> M["Generate Itinerary\nGemini 2.5 Flash + group context"]
    M --> N["Review AI plan\nDay-by-day + cost per person"]
    N --> O["Add to Calendar\nGoogle Calendar / .ics download"]

    style A fill:#FAF9F7,stroke:#333
    style M fill:#e8f4e8,stroke:#333
    style O fill:#e8f0fe,stroke:#333
```

---

## 2. Participant Flow (First-Time User)

```mermaid
flowchart TD
    A["Receives link in\nWhatsApp / iMessage"] --> B["Opens link\nNo app download, no login"]
    B --> C["Sees Motivation Block\n'Priya and Rahul are in'\n'Takes 30 seconds'"]
    C --> D["Fills form ~30 seconds\nRSVP, destination vote,\ndate vote, budget range"]
    D --> E{"Optional details?"}
    E -- "Skip" --> F["Submit"]
    E -- "Expand" --> G["Headcount, group type, kids"]
    G --> F
    F --> H["Confirmation\n'3 people responded.\nOrganiser can lock\nonce everyone is in.'"]
    H --> I["Response token saved\nin localStorage"]
    I --> J{"Return later?"}
    J -- "Yes" --> K["Edit link shown\nPre-fills existing data"]
    J -- "No" --> L["Done until notified"]
    L --> M["Trip locked by organiser\nRealtime status update"]
    M --> N["'The plan is ready!\nOrganiser will share it soon.'"]

    style A fill:#25D366,stroke:#333,color:#fff
    style C fill:#fff3e0,stroke:#333
    style H fill:#e8f4e8,stroke:#333
```

---

## 3. System Architecture

```mermaid
flowchart TB
    subgraph Client["Browser (Mobile-first)"]
        LP["Landing Page\npage.tsx"]
        CF["Create Trip Form\ncreate-trip-form.tsx"]
        TV["Trip View\ntrip-view.tsx"]
        PF["Participant Form\nparticipant-form.tsx"]
        VR["Vote Results\nvote-results.tsx"]
        IV["Itinerary View\nitinerary-view.tsx"]
        SB["Share Bar\nshare-bar.tsx"]
    end

    subgraph Server["Next.js 16 App Router (Vercel)"]
        SA["Server Actions\nactions.ts"]
        API["API Route\n/api/generate-itinerary"]
    end

    subgraph Supabase["Supabase"]
        DB[("PostgreSQL\ntrips + participants")]
        RT["Realtime\nINSERT / UPDATE\nsubscriptions"]
    end

    subgraph AI["Gemini 2.5 Flash"]
        GEN["Itinerary Generation\nGroup context prompt\n30s timeout"]
    end

    subgraph Libs["Utility Libraries"]
        HOL["holidays.ts\n2026 Indian holidays"]
        CAL["calendar.ts\nGoogle Cal URL + .ics"]
        SLG["slug.ts\nUnique trip slugs"]
    end

    CF --> SA
    PF --> SA
    SA --> DB
    TV --> RT
    VR --> RT
    API --> GEN
    GEN --> API
    LP --> CF
    TV --> SB

    style Client fill:#FAF9F7,stroke:#333
    style Server fill:#f0f0f0,stroke:#333
    style Supabase fill:#3ECF8E,stroke:#333,color:#fff
    style AI fill:#4285F4,stroke:#333,color:#fff
```

---

## 4. Trip Lifecycle (State Machine)

```mermaid
stateDiagram-v2
    [*] --> Created: Organiser submits form
    Created --> Open: Trip page live
    Open --> Open: Participants vote\n(Realtime updates)
    Open --> Locked: Organiser taps Lock\n(inline confirmation)
    Locked --> Planned: Generate Itinerary\n(Gemini 2.5 Flash)
    Planned --> Planned: Organiser reviews\n+ adds to calendar

    note right of Open
        Votes collected:
        - Destination (multivote)
        - Dates (pill select)
        - Budget (range input)
        - RSVP (yes/maybe/no)
    end note

    note right of Locked
        Voting frozen.
        Results visible.
        Calendar links appear.
    end note

    note right of Planned
        Itinerary is organiser-only
        until explicitly shared.
        Participants see:
        "The plan is ready!"
    end note
```

---

## 5. Commitment Ratchet

```mermaid
flowchart LR
    A["Share link\nin WhatsApp"] --> B["Vote\n30 seconds"]
    B --> C["See others' votes\nNamed accountability"]
    C --> D["Deadline hits\n'Majority decides\nwithout you'"]
    D --> E["Organiser locks\nNo more changes"]
    E --> F["Add to calendar\nGoogle Cal / .ics"]

    A -.- A1["Low commitment\nJust a tap"]
    B -.- B1["Small investment\nStated preferences"]
    D -.- D1["Loss aversion\nFear of missing out"]
    E -.- E1["Sunk cost\nAlready voted"]
    F -.- F1["Calendar = real\nDate is blocked"]

    style A fill:#fff3e0
    style B fill:#fff3e0
    style C fill:#ffe0b2
    style D fill:#ffcc80
    style E fill:#ffb74d
    style F fill:#ff9800,color:#fff
```

---

## 6. Data Flow: Organiser Creates Trip

```mermaid
sequenceDiagram
    participant O as Organiser
    participant App as Next.js
    participant DB as Supabase
    participant WA as WhatsApp

    O->>App: Fill creation form
    App->>App: Generate slug + manage_key
    App->>DB: INSERT trip (name, destinations,<br>date_options, deadline, manage_key)
    DB-->>App: Return trip record
    App->>App: Redirect to /trip/[slug]?key=manage_key
    App-->>O: Show trip page + share bar
    O->>WA: Tap share button
    WA-->>WA: Pre-filled message:<br>"Vote on our trip! [link]"
```

---

## 7. Data Flow: Participant Responds

```mermaid
sequenceDiagram
    participant P as Participant
    participant App as Next.js
    participant DB as Supabase
    participant RT as Supabase Realtime
    participant O as Organiser View

    P->>App: Open trip link (no ?key=)
    App->>DB: SELECT trip + participants
    DB-->>App: Trip data + existing responses
    App-->>P: Show motivation block + form
    P->>App: Submit vote (name, RSVP,<br>destinations, dates, budget)
    App->>App: Generate response_token (UUID)
    App->>DB: INSERT participant<br>(strip manage_key, response_token from client)
    App-->>P: Save response_token to localStorage
    App-->>P: Show confirmation + names
    DB->>RT: Broadcast INSERT event
    RT-->>O: New participant appears<br>(no refresh needed)
```
