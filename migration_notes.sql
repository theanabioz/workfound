create table public.application_notes (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references public.applications(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.application_notes enable row level security;

create policy "Users can CRUD own notes" on application_notes
  for all using (auth.uid() = author_id);
