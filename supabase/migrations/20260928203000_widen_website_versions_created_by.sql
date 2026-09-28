-- Website versions are now created by native Supabase Auth users.
-- Supabase user IDs are UUID strings (36 characters), while the legacy
-- column was limited to varchar(20). Widening is backward-compatible with
-- existing short values such as "restore" and "ai_edit".
alter table public.website_versions
alter column created_by type varchar(36);
