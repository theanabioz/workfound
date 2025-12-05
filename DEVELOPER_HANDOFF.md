# 🛠 Developer Handoff & Context Recovery

**Project:** Workfound
**Type:** Hybrid Job Board + ATS
**Current State:** Beta v1.0 (Phases 1-5 Completed)
**Last Update:** December 3, 2025

---

## 🚀 Quick Start

1.  **Infrastructure:** Supabase (PostgreSQL + Auth + Realtime). API in `src/lib/supabase-service.ts`.
2.  **Styling:** Tailwind v4 (no config file).
3.  **Critical Architecture:**
    *   **Companies:** Users belong to a Company (`company_members`). Jobs belong to a Company.
    *   **RLS:** Policies are strict. Be careful with recursive policies (e.g. `company_members`).
4.  **Key Components:**
    *   `KanbanBoard.tsx`: Vertical DnD Accordion.
    *   `ChatSystem.tsx`: Realtime messaging.
    *   `EventModal.tsx`: Calendar.

---

## ✅ Completed Features

1.  **Core ATS:**
    - **Companies:** Multi-user architecture ready (currently 1 owner). Public Company Pages (`/company/[slug]`).
    - **Kanban:** Vertical drag & drop.
    - **Screening:** Auto-reject logic.
    - **Notes:** Internal comments.
2.  **Communication:**
    - Realtime Chat (Employer <-> Seeker).
    - Calendar (Apple-style grid).
3.  **Search & Match:**
    - Resume & Job Search.
    - Saved Items.
4.  **UX/UI:**
    - Responsive Sidebar.
    - Settings Page (Profile + Company).

---

## 🚧 Roadmap (Future)

**Priority: Phase 6 (Intelligence & Scaling)**
1.  **Team Management:** UI to invite other members to the company (`company_members`).
2.  **Billing:** Stripe integration for Premium Jobs.
3.  **AI:** Job description generator.
4.  **File Storage:** Real avatars and PDF resumes (Supabase Storage).

---

## 🤖 Recovery Prompt

> "I am continuing development on 'Workfound'.
> We have a fully functional ATS with Companies, Chat, Calendar, and Kanban.
> Please review `DEVELOPER_HANDOFF.md`.
> Note: RLS policies for `company_members` were fixed to avoid recursion.
> Let's proceed with [INSERT NEXT TASK]."
