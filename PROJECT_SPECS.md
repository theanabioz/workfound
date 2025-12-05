# Workfound - Specification & Architecture

## 1. Project Overview
**Goal:** A dual-purpose platform: Job Board for seekers (EU focus) + ATS (Applicant Tracking System) for employers.
**Core Value:** "2 in 1" - Flexible hiring for both small businesses (Direct Contact) and large companies (ATS Pipeline).

## 2. Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Employer / Seeker roles)
- **Icons:** Lucide React

## 3. Core Roles & Workflows

### A. The Employer (Two Modes)
1.  **Direct Hiring (Small Business):**
    - Creates a job post.
    - Selects "Contact Method": Phone call, WhatsApp, Viber.
    - **Result:** No internal applications. Seekers see "Call Now" or "Chat on WhatsApp".
2.  **ATS Hiring (Agencies/Corporations):**
    - Creates a job post.
    - Selects "Contact Method": Platform Application.
    - **Result:** Seekers click "Apply", upload CV. Employer manages pipeline (New -> Screening -> Interview -> Offer).

### B. The Seeker
- Search & Filter jobs.
- **For Direct Jobs:** Click to reveal phone/messenger.
- **For ATS Jobs:** Fill profile, attach CV/Resume, submit application.
- Dashboard to track applied jobs.

## 4. Database Schema (Draft)

### `profiles` (Users)
- `id` (UUID, PK)
- `role`: 'employer' | 'seeker'
- `full_name`: text
- `company_name`: text (for employers)

### `jobs` (Vacancies)
- `id` (UUID, PK)
- `employer_id` (FK -> profiles.id)
- `title`: text
- `description`: text (Rich text)
- `location`: text
- `salary_range`: text
- **`application_method`**: ENUM ('internal_ats', 'external_phone', 'external_whatsapp', 'external_viber')
- `contact_info`: text (The phone number or link, used if method is NOT internal_ats)
- `status`: 'published' | 'draft' | 'closed'
- `created_at`: timestamp

### `applications` (For ATS Mode only)
- `id` (UUID, PK)
- `job_id` (FK -> jobs.id)
- `seeker_id` (FK -> profiles.id)
- `status`: ENUM ('new', 'viewed', 'interview', 'rejected', 'offer')
- `resume_url`: text
- `cover_letter`: text
- `created_at`: timestamp

## 5. Development Phases
1.  **Phase 1: Setup & Data Core.** Initialize Supabase client, Types, and Mock Data generator.
2.  **Phase 2: Employer Studio.** Create Job (with mode selection), My Jobs list.
3.  **Phase 3: Public Job Board.** Search page, Job Card (displaying button based on mode).
4.  **Phase 4: Seeker Actions.** Apply logic vs Reveal Phone logic.
5.  **Phase 5: ATS Dashboard.** Kanban or List view for applications.