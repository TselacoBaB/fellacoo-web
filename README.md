# Fellacoo Web

A clean Next.js + TypeScript website builder and conversion engine.

## Product
- Visual website builder with a large live design canvas
- Responsive desktop/tablet/mobile editing
- AI website generation and editing
- Conversion-focused website architecture
- Leads and analytics
- Publishing and domains

## Local development
1. Copy .env.example to .env.local.
2. Fill only values needed for the current task.
3. Run npm install.
4. Run npm run dev.

Never commit credentials or provider secrets.

## Existing Supabase data boundary

Fellacoo Web is an application layer over the existing Fellacoo Supabase project.

**Hard rule: do not delete, reset, rename, or recreate existing tables or production data.**

The current builder uses the existing `build_requests` table for draft persistence:
- `build_requests.assembly` stores the structured builder document.
- `build_requests.preview` stores the current preview snapshot.
- `build_requests.owner_id` links the draft to the existing Fellacoo `users` record.
- `felacoo_auth_links` maps the Supabase Auth user to that existing Fellacoo user.

The builder does **not** create a new website/project table at this stage. Future website features should first map onto existing website tables such as `website_versions`, `site_versions`, `site_assets`, `site_domains`, `templates`, `template_sections`, and `published_assets`.

Only additive schema changes are allowed when the existing schema genuinely cannot represent a required feature.

### Local Supabase setup

Copy `.env.example` to `.env.local` and provide the Supabase publishable key. Server-only secrets such as `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to browser code or committed to Git.

The builder route is:

`http://localhost:3000/builder/new/site`

When a signed-in user has a matching `felacoo_auth_links` row, builder autosave syncs to the existing `build_requests` data. Without that auth link, the editor remains usable with local draft storage.
