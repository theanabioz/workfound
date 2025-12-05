# 🛠 Developer Handoff & Context Recovery

**Project:** Workfound
**Type:** Hybrid Job Board + ATS (Applicant Tracking System)
**Current State:** Functional MVP (Phase 3 Completed)
**Last Update:** December 3, 2025

---

## 🚀 Quick Start for New AI Instance

If you are a new AI agent taking over this project, **READ THIS FIRST**.

1.  **Infrastructure:** Fully migrated to **Supabase**. Do NOT use `mock-service.ts` or `db.json`. Use `src/lib/supabase-service.ts` for ALL data operations.
2.  **Styling:** **Tailwind CSS v4**. Config is inside `src/app/globals.css` (`@import "tailwindcss";`). No `tailwind.config.ts`.
3.  **Critical Components:**
    *   `KanbanBoard.tsx`: **Vertical** Drag & Drop Accordion. DO NOT change to horizontal columns.
    *   `ApplicationModal.tsx`: Modal for candidate details + internal notes.
    *   `EventModal.tsx`: Modal for creating calendar events.
4.  **Features Implemented:**
    *   **Screening Questions:** Job creation includes Q&A. Applications are auto-rejected if criteria met.
    *   **Candidate Search:** Recruiters can search public resumes.
    *   **Saved Items:** Bookmarking jobs (seekers) and resumes (employers).
    *   **Calendar:** Apple-style monthly grid (`/employer/calendar`).

---

## 🏗 Architecture Overview

### 1. Tech Stack
- **Framework:** Next.js 15 (App Router).
- **Language:** TypeScript.
- **DB/Auth:** Supabase (PostgreSQL, Auth with RLS, Middleware protection).
- **UI:** Tailwind v4 + Lucide React + dnd-kit + react-day-picker (legacy, replaced by custom grid).

### 2. Database Schema (Supabase)
See `supabase_schema.sql`, `migration_saved_items.sql`, `migration_notes.sql`, `migration_screening.sql`, `migration_calendar.sql`.
Key Tables:
- `profiles`, `jobs`, `resumes`, `applications`
- `saved_items` (Polymorphic bookmarks)
- `application_notes` (Internal comments)
- `job_questions`, `application_answers` (Screening)
- `calendar_events` (Schedule)

---

## ✅ What is DONE

1.  **Authentication:** Login/Register/Middleware.
2.  **ATS Core:**
    - Vertical Kanban with filters.
    - Notes on candidates.
    - Screening questions logic.
3.  **Search & Discovery:**
    - Job Search (text).
    - Resume Search (text).
    - Favorites system.
4.  **Planning:**
    - Interactive Monthly Calendar.

---

## 🚧 Immediate Next Steps (The Roadmap)

**Priority: Phase 4 (Communication)**
1.  **Messaging System:** Real-time chat between Employer and Seeker (using Supabase Realtime).
2.  **Notifications:** In-app alerts for new messages or status changes.

**Later:**
- **Email Integration:** SendGrid/Resend.
- **Company Profiles:** Public branding pages.

---

## 🤖 Recovery Prompt (Copy-Paste this to resume)

> "I am continuing development on 'Workfound', a Next.js 15 + Supabase Job Board/ATS.
>
> **Context:**
> The project has completed Phase 3. We have a working ATS with Vertical Kanban, Screening Questions, Resume Search, and Calendar.
> We use Tailwind v4. All data logic is in `src/lib/supabase-service.ts`.
>
> **Current Goal:**
> Please review `DEVELOPER_HANDOFF.md` and `ROADMAP.md`.
> Then, let's proceed with Phase 4: [INSERT NEXT TASK, e.g., 'Real-time Messaging System']."