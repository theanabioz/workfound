# Workfound - Development Roadmap

## ✅ Phase 1: The Skeleton (Core Logic)
- [x] **Project Setup:** Next.js, TypeScript, Tailwind.
- [x] **Authentication:** Login/Register with Role selection (Seeker/Employer).
- [x] **Database:** Supabase (Profiles, Jobs, Applications, Resumes).
- [x] **Basic Flows:** Create Job, Apply, View Applications.

## ✅ Phase 2: Design & Navigation
- [x] **UI Framework:** Tailwind v4, Clean/Minimal style.
- [x] **Navigation:** Public Navbar & Dedicated Sidebars (Employer/Seeker).
- [x] **Mobile Responsiveness:** Sidebar hamburger menu.
- [x] **Search:** Basic title search.

## ✅ Phase 3: Advanced Tools (ATS Core)
### Seeker Tools
- [x] **Saved Jobs (Favorites):** Bookmark jobs.
- [x] **History Table:** Simple list of applied jobs with status.
- [x] **Job Alerts (Subscriptions):** Email notifications for new jobs (via Resend).

### Employer Tools
- [x] **Kanban Board:** Vertical drag & drop pipeline for applications.
- [x] **Filters:** Filter Kanban by specific Job.
- [x] **Screening Questions (Knock-out):** Custom questions (Yes/No) to auto-reject unqualified candidates.
- [x] **Candidate Search:** Search resumes by skills, location.
- [x] **Saved Candidates:** Bookmark interesting profiles.
- [x] **Internal Notes:** Private notes on candidates (in modal).
- [x] **Calendar:** Schedule interviews (Apple-style grid).

## ✅ Phase 4: Communication & Realtime
- [x] **Messaging System:** Real-time chat between Employer and Seeker.
- [x] **Email Notifications:** Transactional emails via Resend (Alerts implemented).

## ✅ Phase 5: Business & Branding
- [x] **Company Architecture:** Jobs linked to Companies, not Users.
- [x] **Company Profile:** Public page (`/company/[slug]`) with rich media.
- [x] **Settings:** Manage Company Name, Slug, Website.

## 🚧 Phase 6: Scaling & Monetization (NEXT STEPS)
- [ ] **File Storage:** Upload real avatars and PDF resumes (Supabase Storage). Currently using placeholders.
- [ ] **Team Management:** Invite colleagues to manage the company (`company_members`).
- [ ] **Billing & Plans:** Stripe integration for Premium Jobs.
- [ ] **AI:** Job description generator.
- [ ] **Analytics:** Funnel efficiency, time-to-hire.