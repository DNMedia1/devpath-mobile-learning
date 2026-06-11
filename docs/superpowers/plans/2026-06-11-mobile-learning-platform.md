# Mobile Learning Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Continue DevPath from the current local-first learning PWA into a polished, responsive, content-rich, backend-ready coding learning product.

**Architecture:** Keep the UI routed through React Router, domain behavior in services, and content in typed repositories. Add backend readiness by introducing storage/repository boundaries before wiring Supabase.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Vitest, React Router, Context API, localStorage, PWA manifest/service worker. Planned backend: Supabase Auth/Postgres with local fallback.

---

## Current File Map

- `src/components/AppShell.tsx`: responsive shell with mobile bottom navigation and desktop sidebar.
- `src/components/Header.tsx`, `CourseCard.tsx`, `ProgressBar.tsx`, `StatTile.tsx`: reusable UI primitives.
- `src/pages/*`: routed product screens.
- `src/data/courses.ts`: course seeds plus generated quiz, fill-blank, and coding challenges.
- `src/data/projects.ts`: practice project briefs.
- `src/models/learning.ts`: shared domain types.
- `src/services/progressService.ts`: XP, streak, daily quests, localStorage persistence.
- `src/services/codeFeedbackService.ts`: local code feedback.
- `src/services/badgeService.ts`: badge rules.
- `src/store/ProgressContext.tsx`: React state bridge for progress actions.
- `public/manifest.webmanifest`, `public/sw.js`: PWA foundation.
- `README.md`: setup, architecture, product concept, backend roadmap.

## Completed Milestones

- [x] Build local-first React/Vite/Tailwind PWA.
- [x] Add course, lesson, quiz, project, profile, progress, and settings screens.
- [x] Add local progress persistence, XP, level, streak, theme, and daily goal.
- [x] Add code-writing challenges with local feedback.
- [x] Expand Python to 39 lessons.
- [x] Add AI Automation track and automation projects.
- [x] Add fill-blank tasks, daily quests, badges, and lesson completion modal.
- [x] Add responsive app shell with mobile bottom nav and desktop sidebar.
- [x] Improve desktop course and module layouts.
- [x] Prepare progress persistence boundary with a local repository adapter.
- [x] Add Supabase planning artifacts with `.env.example` and backend roadmap.
- [x] Verify current baseline with `npm test`, `npm run lint`, and `npm run build`.

## Next Backlog

### Story 1: Improve Core Screen Polish

**User Story:** As a learner, I want dashboard, quiz, projects, progress, and profile screens to feel consistent and easy to scan on mobile and desktop.

**Acceptance Criteria:**

- Dashboard sections use responsive layout without cramped cards on desktop.
- Quiz screen has clearer state and result hierarchy.
- Projects screen supports better scanning by difficulty/course.
- Profile and progress screens show badges, streak, and progress without visual clutter.
- Text does not overflow at mobile width.

**Likely Files:**

- Modify: `src/pages/DashboardPage.tsx`
- Modify: `src/pages/QuizPage.tsx`
- Modify: `src/pages/ProjectsPage.tsx`
- Modify: `src/pages/ProfilePage.tsx`
- Modify: `src/pages/ProgressPage.tsx`
- Modify: `src/styles.css` if shared patterns are needed.

**Verification:**

- `npm test`
- `npm run lint`
- `npm run build`
- Browser smoke check on mobile and desktop breakpoints when available.

**Commit:**

```bash
git commit -m "feat: polish core learning screens"
```

### Story 2: Expand Non-Python Curriculum

**User Story:** As a learner, I want JavaScript/TypeScript, React, Git/GitHub, SQL, Backend APIs, Supabase, and AI Automation content that is deep enough to progress beyond basics.

**Acceptance Criteria:**

- Add or expand practical tracks without breaking existing progress IDs unnecessarily.
- Each new lesson includes German theory, English code, quiz, fill-blank, coding challenge, and practice task.
- Content tests enforce minimum module/lesson counts for core tracks.
- README product concept reflects the new curriculum.

**Likely Files:**

- Modify: `src/models/learning.ts` if new language IDs are needed.
- Modify: `src/data/courses.ts`
- Modify: `src/data/courses.test.ts`
- Modify: `src/data/projects.ts`
- Modify: `README.md`

**Verification:**

- `npm test`
- `npm run lint`
- `npm run build`

**Commit:**

```bash
git commit -m "feat: expand fullstack learning curriculum"
```

## Working Agreements

- Keep explanations and UI copy in German.
- Keep code, identifiers, filenames, and examples in English.
- Commit after each larger feature or fix.
- Do not introduce secrets into the repository.
- Prefer small, reviewable changes over broad rewrites.
- If another AI agent changed files, inspect the diff before editing.
