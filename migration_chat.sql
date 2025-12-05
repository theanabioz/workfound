create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.profiles(id) not null,
  seeker_id uuid references public.profiles(id) not null,
  job_id uuid references public.jobs(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(employer_id, seeker_id, job_id)
);

alter table public.conversations enable row level security;

create policy "Participants can view conversations" on conversations
  for select using (auth.uid() = employer_id or auth.uid() = seeker_id);

create policy "Participants can insert conversations" on conversations
  for insert with check (auth.uid() = employer_id or auth.uid() = seeker_id);

create table public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

create policy "Participants can view messages" on messages
  for select using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and (conversations.employer_id = auth.uid() or conversations.seeker_id = auth.uid())
    )
  );

create policy "Participants can send messages" on messages
  for insert with check (auth.uid() = sender_id);

alter publication supabase_realtime add table messages;
