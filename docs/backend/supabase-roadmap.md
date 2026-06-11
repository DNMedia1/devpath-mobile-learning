# Supabase Persistence Roadmap

## Goal

Prepare DevPath for cross-device progress sync without breaking the current local-first app. The frontend should keep working with localStorage while a Supabase-backed repository is introduced behind the same progress boundary.

## Scope

This document is planning only. It does not add `@supabase/supabase-js`, migrations, auth UI, or runtime database calls yet.

## Environment

Frontend-safe variables:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

Do not commit service-role keys, secret keys, database passwords, or personal access tokens. Browser code may only use publishable/anon-style keys that are protected by Row Level Security.

## Data Model Draft

### `profiles`

Stores user-owned profile settings.

- `id uuid primary key references auth.users(id) on delete cascade`
- `display_name text not null`
- `avatar_tone text not null`
- `daily_goal integer not null default 2`
- `theme text not null default 'dark'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

RLS:

- Users can select, insert, update, and delete only their own row where `id = auth.uid()`.

### `lesson_progress`

Stores completed lessons per user and course.

- `user_id uuid not null references auth.users(id) on delete cascade`
- `course_id text not null`
- `lesson_id text not null`
- `completed_at timestamptz not null default now()`
- `xp_awarded integer not null`
- primary key: `(user_id, lesson_id)`

RLS:

- Users can read and write only rows where `user_id = auth.uid()`.

### `quiz_attempts`

Stores quiz results and missed question IDs for review.

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `lesson_id text`
- `score integer not null`
- `total integer not null`
- `missed_question_ids text[] not null default '{}'`
- `created_at timestamptz not null default now()`

RLS:

- Users can select and insert only rows where `user_id = auth.uid()`.
- Updates are not required for normal app behavior.

### `daily_activity`

Stores one row per user and day.

- `user_id uuid not null references auth.users(id) on delete cascade`
- `activity_date date not null`
- `lessons_completed integer not null default 0`
- `quiz_correct integer not null default 0`
- `xp_earned integer not null default 0`
- `bonus_awarded boolean not null default false`
- primary key: `(user_id, activity_date)`

RLS:

- Users can select, insert, and update only rows where `user_id = auth.uid()`.

### `user_badges`

Optional denormalized badge history. The current app derives badges from progress, so this table is only needed if badge award timestamps or notifications must sync exactly.

- `user_id uuid not null references auth.users(id) on delete cascade`
- `badge_id text not null`
- `earned_at timestamptz not null default now()`
- primary key: `(user_id, badge_id)`

RLS:

- Users can select only their own rows.
- Inserts can be done by trusted server logic later, or by the client if badge derivation remains deterministic and validated.

## Integration Plan

1. Keep `ProgressRepository` as the frontend persistence boundary.
2. Add a Supabase client factory that reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Implement `supabaseProgressRepository` behind the same `ProgressRepository` interface.
4. Add auth state handling before enabling remote writes.
5. Merge local progress into remote progress after first login.
6. Keep localStorage fallback for offline/demo use.

## Security Notes

- Enable RLS on every table in the exposed `public` schema.
- Policies must use `auth.uid()` against user-owned columns.
- Do not use user-editable metadata for authorization decisions.
- Do not expose `service_role` or secret keys to Vite/browser code.
- Avoid views that bypass RLS unless they are explicitly configured as security-invoker or kept out of exposed schemas.
- For UPDATE policies, remember that PostgreSQL also needs a compatible SELECT policy.

## Verification Before Runtime Integration

- Run `npm test`, `npm run lint`, and `npm run build`.
- Validate generated SQL in a Supabase project before committing migrations.
- Run Supabase database advisors once a real project and CLI/MCP connection exist.
