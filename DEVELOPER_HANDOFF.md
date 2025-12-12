# 🛠 Developer Handoff & Context Recovery

**Project:** Workfound
**Type:** Hybrid Job Board + ATS
**Current State:** Beta v1.1 (Admin & Teams added)
**Last Update:** December 3, 2025

---

## 🚀 Quick Start for New AI Instance

If you are a new AI agent taking over this project, **READ THIS FIRST**.

1.  **Infrastructure:** Supabase (PostgreSQL + Auth + Realtime + Storage).
2.  **Logic:** All server actions and DB calls are in `src/lib/supabase-service.ts`.
3.  **Styling:** Tailwind v4 (configured in `globals.css`).
4.  **Admin Client:** We use `createAdminClient` (`src/utils/supabase/admin.ts`) with `service_role` key for:
    *   Sending Job Alerts (reading all alerts).
    *   Processing Invites (adding members).
    *   Admin Dashboard stats.

---

## 🏗 Key Architectures

### 1. Companies & Teams
- **Schema:** `companies` <-> `company_members` (User) -> `jobs`.
- **RLS Complexity:** `company_members` policies use a `security definer` function `get_my_company_ids()` to avoid infinite recursion. **DO NOT CHANGE** RLS policies for `company_members` without understanding this recursion loop.
- **Invites:** Flow: Invite -> Email (Resend) -> Click Link -> `acceptInvitation` (Server Action) -> Add to Team.

### 2. Admin Panel (`/admin`)
- **Security:** Protected by Middleware.
    - If user is NOT admin -> returns **404** (Rewrite), masking existence.
    - Server Layout (`src/app/admin/layout.tsx`) also performs a hard check (`notFound()`).
- **Access:** Only users with `role: 'admin'` in `profiles`.

### 3. Realtime Chat
- Uses Supabase Realtime.
- Listens to `messages` (INSERT) and `conversations` (INSERT/UPDATE).
- Component: `src/components/ChatSystem.tsx`.

### 4. Kanban (ATS)
- **Layout:** **Vertical Accordion** with Drag & Drop (`dnd-kit`).
- **Design:** Compact "Square" cards.
- Supports filtering by Job ID.

---

## ✅ What is DONE

- **Auth:** Login, Register, **Password Reset**, Role-based redirection.
- **ATS:** Kanban, Screening (Auto-reject), Notes, Calendar.
- **Storage:** Avatar uploads (Public bucket `avatars`).
- **Communication:** Chat, Email Alerts (Resend).
- **Admin:** Dashboard, User list.

---

## 🚧 Roadmap (Immediate Next Steps)

1.  **PDF Resumes:** The `resumes` bucket exists (Private). Need to add File Input to `ApplyPage` and link it to `Application`.
2.  **Billing:** Stripe integration.
3.  **Analytics:** Add charts to Admin & Employer dashboards.

---

## 🤖 Recovery Prompt

> "I am continuing development on 'Workfound'.
> The project is in Beta v1.1. We have Companies, Teams, Admin Panel, and Realtime Chat.
> Please review `DEVELOPER_HANDOFF.md` carefully (especially RLS and Admin Client sections).
> Let's proceed with [INSERT NEXT TASK, e.g., 'PDF Resume Upload']."