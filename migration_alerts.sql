create table public.job_alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  keywords text,
  location text,
  frequency text default 'daily',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.job_alerts enable row level security;

create policy "Users can CRUD own alerts" on job_alerts
  for all using (auth.uid() = user_id);
