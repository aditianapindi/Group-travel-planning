-- Run this in Supabase → SQL Editor → New Query
-- Adds headcount and group composition fields to participants

alter table participants add column headcount integer not null default 1;
alter table participants add column has_kids boolean not null default false;
alter table participants add column group_type text not null default 'mixed' check (group_type in ('mixed', 'all-men', 'all-women', 'couples', 'family'));
