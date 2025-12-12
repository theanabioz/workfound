# 🛠 Developer Handoff & Context Recovery

**Project:** Workfound
**Type:** Hybrid Job Board + ATS
**Current State:** Release Candidate (UI/UX Polished)
**Last Update:** December 3, 2025

---

## 🚀 Quick Start

1.  **Infrastructure:** Supabase (PostgreSQL + Auth + Realtime + Storage).
2.  **API:** `src/lib/supabase-service.ts` contains ALL logic.
3.  **Styling:** Tailwind v4. Shadcn-like clean UI.
4.  **Critical UX:**
    - **Filters:** Sidebar on Homepage updates URL params. `getJobs` filters by country, city, salary (min/max/period).
    - **Job Creation:** Form supports new fields: `salaryPeriod` ('month'/'hour'), `benefits`, `country`.
    - **Apply Flow:** Modal window (`ApplyModal`), not a separate page.

---

## 🏗 Key Architectures

### 1. Data Model (Jobs)
- `jobs` table has extended fields:
    - `country` (text), `city` (text).
    - `salary_min` (int), `salary_max` (int), `salary_period` ('month'|'hour').
    - `benefits` (text[]).
- **Migration:** Ensure `migration_salary_period.sql`, `migration_salary_max.sql`, `migration_filters.sql` are run.

### 2. ATS & Companies
- **Companies:** Jobs belong to Companies. Users belong to Companies (`company_members`).
- **Kanban:** Vertical Drag & Drop (`KanbanBoard.tsx`).
- **Screening:** Auto-reject logic in `submitApplication`.

### 3. Communication
- **Chat:** Realtime.
- **Alerts:** Transactional emails via Resend (`checkAndSendAlerts` in `createJob`).

---

## ✅ What is DONE

- **Full ATS:** Kanban, Screening, Notes, Calendar, Search.
- **Full Job Board:** Advanced Filters, Favorites, Alerts.
- **UI:** Redesigned Cards, Sticky Headers, Mobile Menu.
- **Admin:** Basic Panel.

---

## 🚧 Roadmap (Future)

1.  **PDF Resumes:** Upload file in `ApplyModal`.
2.  **Billing:** Stripe.
3.  **Analytics:** Charts.

---

## 🤖 Recovery Prompt

> "I am continuing development on 'Workfound'.
> The project is in Release Candidate state. UI is polished, Filters are working.
> Please review `DEVELOPER_HANDOFF.md` carefully.
> Let's proceed with [INSERT NEXT TASK, e.g., 'PDF Resume Upload']."
