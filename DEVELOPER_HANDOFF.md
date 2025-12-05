# 🛠 Developer Handoff & Context Recovery

**Project:** Workfound
**Type:** Hybrid Job Board + ATS (Applicant Tracking System)
**Current State:** Feature-Complete MVP (Phases 1-4 Completed)
**Last Update:** December 3, 2025

---

## 🚀 Quick Start for New AI Instance

If you are a new AI agent taking over this project, **READ THIS FIRST**.

1.  **Infrastructure:** Fully migrated to **Supabase**. Do NOT use `mock-service.ts` or `db.json`. Use `src/lib/supabase-service.ts` for ALL data operations.
2.  **Styling:** **Tailwind CSS v4**. Config is inside `src/app/globals.css` (`@import "tailwindcss";`). No `tailwind.config.ts`.
3.  **Critical Components:**
    *   `KanbanBoard.tsx`: **Vertical** Drag & Drop Accordion.
    *   `ChatSystem.tsx`: Realtime messaging using Supabase Channels.
    *   `EventModal.tsx`: Calendar scheduling modal.
4.  **Features Implemented:**
    *   **ATS:** Kanban with drag & drop, Screening Questions (Auto-reject).
    *   **Communication:** Real-time Chat (`/employer/messages`).
    *   **Planning:** Apple-style Monthly Calendar (`/employer/calendar`).
    *   **Search:** Resume & Job search with Favorites.

---

## 🏗 Architecture Overview

### 1. Tech Stack
- **Framework:** Next.js 15 (App Router).
- **Language:** TypeScript.
- **DB/Auth:** Supabase (PostgreSQL, Auth, Realtime).
- **UI:** Tailwind v4 + Lucide React + dnd-kit.

### 2. Database Schema (Supabase)
See `migration_*.sql` files for history.
- `profiles`, `jobs`, `resumes`, `applications`
- `conversations`, `messages` (Chat)
- `calendar_events` (Schedule)
- `job_questions`, `application_answers` (Screening)
- `application_notes` (Internal comments)

---

## ✅ What is DONE

1.  **Core:** Auth, DB, Middleware Protection.
2.  **ATS:** Vertical Kanban, Screening, Notes.
3.  **Search:** Resumes & Jobs + Favorites.
4.  **Planning:** Interactive Calendar.
5.  **Communication:** Realtime Chat.

---

## 🚧 Immediate Next Steps (The Roadmap)

**Priority: Phase 5 (Business & Branding)**
1.  **Team Management:** Allow multiple users per company.
2.  **Company Profiles:** Public pages (`/company/[slug]`) with reviews.
3.  **Billing:** Stripe integration.

**Cleanup / Tech Debt:**
- **File Storage:** Upload real avatars and PDF resumes (Supabase Storage). Currently using placeholders.
- **Email Notifications:** SendGrid/Resend integration for offline alerts.

---

## 🤖 Recovery Prompt (Copy-Paste this to resume)

> "I am continuing development on 'Workfound', a Next.js 15 + Supabase Job Board/ATS.
>
> **Context:**
> The project has completed Phases 1-4. We have a fully working ATS with Chat, Calendar, and Kanban.
> We use Tailwind v4. All data logic is in `src/lib/supabase-service.ts`.
>
> **Current Goal:**
> Please review `DEVELOPER_HANDOFF.md` and `ROADMAP.md`.
> Then, let's proceed with [INSERT NEXT TASK, e.g., 'File Uploads for Avatars']."
