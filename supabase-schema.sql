-- Run this in Supabase → SQL Editor → New Query

-- Trips table
create table trips (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  created_by text not null,
  destinations text[] not null default '{}',
  status text not null default 'collecting' check (status in ('collecting', 'locked', 'planned')),
  deadline timestamptz,
  created_at timestamptz default now()
);

-- Participants table
create table participants (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references trips(id) on delete cascade not null,
  name text not null,
  rsvp text not null default 'yes' check (rsvp in ('yes', 'maybe', 'no')),
  budget_min integer,
  budget_max integer,
  destination_votes text[] not null default '{}',
  created_at timestamptz default now()
);

-- Itineraries table
create table itineraries (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references trips(id) on delete cascade not null,
  content jsonb not null,
  created_at timestamptz default now()
);

-- Index for fast slug lookups
create index idx_trips_slug on trips(slug);

-- Index for fast participant lookups by trip
create index idx_participants_trip_id on participants(trip_id);

-- Enable realtime for participants (live updates when someone responds)
alter publication supabase_realtime add table participants;

-- Row Level Security (open for MVP — no auth)
alter table trips enable row level security;
alter table participants enable row level security;
alter table itineraries enable row level security;

-- Allow all operations for MVP (no auth)
create policy "Allow all on trips" on trips for all using (true) with check (true);
create policy "Allow all on participants" on participants for all using (true) with check (true);
create policy "Allow all on itineraries" on itineraries for all using (true) with check (true);
