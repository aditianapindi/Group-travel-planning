-- Run this in Supabase → SQL Editor → New Query
-- Adds manage_key column for organizer-only actions

alter table trips add column manage_key text not null default gen_random_uuid()::text;
