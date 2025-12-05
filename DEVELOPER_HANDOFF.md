# 🛠 Developer Handoff & Context Recovery

**Project:** Workfound
**Type:** Hybrid Job Board + ATS
**Current State:** Beta (Phases 1-4 Completed)
**Last Update:** December 3, 2025

---

## 🚀 Quick Start

1.  **Infrastructure:** Supabase (PostgreSQL + Auth + Realtime). API in `src/lib/supabase-service.ts`.
2.  **Styling:** Tailwind v4 (no config file).
3.  **Key Components:**
    - `DashboardSidebar.tsx`: Grouped menu sections, mobile responsive.
    - `ChatSystem.tsx`: Realtime messaging (listens to `messages` and `conversations`).
    - `KanbanBoard.tsx`: Vertical DnD with filters.
    - `EventModal.tsx` & `/calendar`: Apple-style planning.

---

## ✅ Completed Features

1.  **Core ATS:**
    - Create Job (ATS vs Direct mode).
    - **Screening Questions:** Auto-reject logic implemented.
    - **Kanban:** Vertical accordion with drag & drop.
    - **Notes:** Internal comments on candidates.
2.  **Search & Match:**
    - Job Search & Resume Search.
    - **Favorites:** Bookmark jobs/candidates.
3.  **Communication:**
    - **Realtime Chat:** 1-on-1 messaging between Employer and Seeker.
    - **Calendar:** Schedule interviews (Monthly grid).
4.  **UX/UI:**
    - Responsive Sidebar with categories.
    - Compact "Square" Cards in Kanban.
    - Modal-based details view.

---

## 🚧 Roadmap (What's Next)

**Priority: Phase 5 (Business)**
1.  **Company Profiles:** Public page for employer brand.
2.  **Team:** Invite colleagues.
3.  **Billing:** Stripe.

**Priority: Phase 6 (Intelligence)**
1.  **AI:** Job description generator.
2.  **Analytics:** Funnel charts.

---

## 🤖 Recovery Prompt

> "I am working on Workfound (Next.js 15 + Supabase).
> We have a fully functional ATS with Chat, Calendar, Screening, and Kanban.
> Please review `DEVELOPER_HANDOFF.md` to understand the architecture.
> Let's proceed with [INSERT NEXT TASK]."