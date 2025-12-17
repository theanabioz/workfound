# 🛠 Developer Handoff & Context Recovery

**Project:** Workfound
**Type:** Hybrid Job Board + ATS
**Current State:** Release 1.0 (Feature Complete)
**Last Update:** December 3, 2025

---

## 🚀 Quick Start

1.  **Infrastructure:** Supabase (PostgreSQL + Auth + Realtime + Storage).
2.  **API:** `src/lib/supabase-service.ts` contains ALL logic (including Billing & Admin).
3.  **Styling:** Tailwind v4. Shadcn-like clean UI.
4.  **Critical Components:**
    - `KanbanBoard.tsx`: Vertical Drag & Drop Accordion.
    - `ChatSystem.tsx`: Realtime messaging.
    - `JobCard.tsx`: Complex component with overlaid Link (be careful with hydration).
    - `FilterBar.tsx` / `MobileFilters.tsx`: URL-based filtering logic.

---

## 🏗 Key Architectures

### 1. Monetization (Billing)
- **Schema:** `companies` has `balance`. `transactions` table tracks history.
- **Payment:** Stripe Checkout -> `/api/stripe/deposit` -> Webhook/Success -> `processDeposit` (Server Action).
- **Spending:** `spendBalance` -> `promoteJob` (sets `is_highlighted` or `promoted_until`).

### 2. ATS & Companies
- **Companies:** Jobs belong to Companies. Users belong to Companies.
- **Invites:** Flow: Invite -> Email -> Link -> `acceptInvitation`.
- **Views:** Realtime view counting with `localStorage` protection (`ViewTracker` component).

### 3. AI & Automation
- **AI:** `/api/ai/generate-job` uses Mock (or Gemini if key provided) to write descriptions.
- **Alerts:** `checkAndSendAlerts` runs after `createJob`.

---

## ✅ What is DONE

- **Full ATS:** Kanban, Screening, Notes, Calendar, Search.
- **Full Job Board:** Advanced Filters, Favorites, Alerts, View Counters.
- **Billing:** Wallet system, Stripe integration.
- **Admin:** Panel with charts.
- **UI:** Polished, responsive, "Apple-style" calendar.

---

## 🚧 Roadmap (Future)

1.  **PDF Resumes:** `resumes` bucket exists. `ApplyModal` supports file selection logic but needs final wiring if `applyMethod === 'file'`.
2.  **Analytics:** Add more complex funnel charts.

---

## 🤖 Recovery Prompt

> "I am continuing development on 'Workfound'.
> The project is in Release 1.0 state. Billing, AI, and Analytics are implemented.
> Please review `DEVELOPER_HANDOFF.md` carefully.
> Let's proceed with [INSERT NEXT TASK]."