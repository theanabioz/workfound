create table public.job_questions (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade not null,
  question_text text not null,
  correct_answer text, 
  is_disqualifying boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.job_questions enable row level security;

create policy "Employers can manage questions for own jobs" on job_questions
  for all using (
    exists (select 1 from jobs where jobs.id = job_questions.job_id and jobs.employer_id = auth.uid())
  );

create policy "Everyone can read questions" on job_questions
  for select using (true);

create table public.application_answers (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references public.applications(id) on delete cascade not null,
  question_id uuid references public.job_questions(id) not null,
  answer_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.application_answers enable row level security;

create policy "Seekers can insert answers" on application_answers
  for insert with check (
    exists (select 1 from applications where applications.id = application_answers.application_id and applications.seeker_id = auth.uid())
  );

create policy "Employers can read answers for their jobs" on application_answers
  for select using (
    exists (
      select 1 from applications
      join jobs on jobs.id = applications.job_id
      where applications.id = application_answers.application_id
      and jobs.employer_id = auth.uid()
    )
  );
