# Project Roadmap: WorkFound Europe

## Phase 1: Setup & Infrastructure (Environment Initialization) ✅
- [x] Initialize Next.js 14 Project (App Router, TypeScript).
- [x] Configure ESLint, Prettier.
- [x] Install & Configure Chakra UI v2.
- [x] Set up Supabase Project & Connect via Environment Variables.
- [x] Configure Supabase Auth (Email/Password, SSR Middleware).
- [x] Define Database Schema & RLS Policies (Row Level Security).
- [x] Configure Supabase Storage (Buckets for resumes/logos).

## Phase 2: User Roles & Profiles (MVP Core) ✅
- [x] Create Registration/Login Pages (UI + Logic).
- [x] Implement Role-Based Access Control (Middleware to protect /dashboard).
- [x] **Feature: Worker Profile:**
  - [x] Profile Edit Form (Personal Info).
  - [ ] Upload Resume (Next step for Storage).
- [x] **Feature: Employer Profile:**
  - [x] Company Profile Setup (Description, Website).
  - [x] Verification Status UI.

## Phase 3: Core Functionality (Vacancies & Search) 🚧
- [x] **Feature: Vacancy Management (Employer):**
  - [x] Create Vacancy Form (Zod/Manual validation).
  - [x] Dashboard: My Vacancies List.
  - [x] Toggle Vacancy Status (Active/Archive).
- [ ] **Feature: Search & Filter (Worker):**
  - [ ] Global Search Page (`/vacancies`).
  - [ ] Filter Sidebar (Country, Job Type).
  - [ ] Vacancy Details Page.

## Phase 4: Interaction & Applications ⏳
- [ ] **Feature: Apply for Job:**
  - [ ] "Apply Now" Button & Modal.
- [ ] **Feature: Employer Dashboard (Applications):**
  - [ ] View list of applicants per vacancy.
  - [ ] Change status (Reviewing -> Interview -> Reject/Offer).
- [ ] **Feature: Worker Dashboard (My Applications):**
  - [ ] Status tracking.

## Phase 5: Polish & Pre-Launch ⏳
- [ ] UI/UX Refinement (Loading skeletons, Toasts).
- [ ] SEO Optimization.
- [ ] Deployment to Vercel.
