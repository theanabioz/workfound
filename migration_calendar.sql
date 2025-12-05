create table public.calendar_events (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.profiles(id) not null,
  application_id uuid references public.applications(id) on delete set null,
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  event_type text check (event_type in ('interview', 'call', 'task')) default 'interview',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.calendar_events enable row level security;

create policy "Employers can CRUD own events" on calendar_events
  for all using (auth.uid() = employer_id);
