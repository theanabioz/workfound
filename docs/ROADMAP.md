# Project Roadmap: WorkFound Europe

## Phase 1: Setup & Infrastructure (Environment Initialization)
- [ ] Initialize Next.js 14 Project (App Router, TypeScript).
- [ ] Configure ESLint, Prettier.
- [ ] Install & Configure Chakra UI v2.
- [ ] Set up Supabase Project & Connect via Environment Variables.
- [ ] Configure Supabase Auth (Email/Password, SSR Middleware).
- [ ] Define Database Schema & RLS Policies (Row Level Security).
- [ ] Configure Supabase Storage (Buckets for resumes/logos).

## Phase 2: User Roles & Profiles (MVP Core)
- [ ] Create Registration/Login Pages (UI + Logic).
- [ ] Implement Role-Based Access Control (Middleware to protect /dashboard).
- [ ] **Feature: Worker Profile:**
  - [ ] Profile Edit Form (Personal Info, Upload Resume).
  - [ ] View Profile Page (Public/Private).
- [ ] **Feature: Employer Profile:**
  - [ ] Company Profile Setup (Logo, Description).
  - [ ] Verification Request UI.

## Phase 3: Core Functionality (Vacancies & Search)
- [ ] **Feature: Vacancy Management (Employer):**
  - [ ] Create Vacancy Form (Zod validation).
  - [ ] Edit/Archive Vacancy.
  - [ ] Dashboard: My Vacancies List.
- [ ] **Feature: Search & Filter (Worker):**
  - [ ] Global Search Bar (Keywords, City).
  - [ ] Filter Sidebar (Categories, Salary Range).
  - [ ] Vacancy Details Page.

## Phase 4: Interaction & Applications
- [ ] **Feature: Apply for Job:**
  - [ ] "Apply Now" Button & Modal (Attach Cover Letter).
  - [ ] Database record creation (Application).
- [ ] **Feature: Employer Dashboard (Applications):**
  - [ ] View list of applicants per vacancy.
  - [ ] Change status (Reviewing -> Interview -> Reject/Offer).
- [ ] **Feature: Worker Dashboard (My Applications):**
  - [ ] Status tracking.

## Phase 5: Polish & Pre-Launch
- [ ] **UI/UX Refinement:** Loading skeletons, error boundaries, toast notifications.
- [ ] **SEO Optimization:** Meta tags, OpenGraph, sitemap.xml.
- [ ] **Performance:** Image optimization, bundle analysis.
- [ ] **Testing:** E2E Tests (Playwright/Cypress) for critical flows.
- [ ] **Deployment:** Vercel / Docker Build.
