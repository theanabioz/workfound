create table public.saved_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  item_id uuid not null, 
  item_type text check (item_type in ('job', 'resume')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, item_id, item_type)
);

alter table public.saved_items enable row level security;

create policy "Users can view own saved items" on saved_items
  for select using (auth.uid() = user_id);

create policy "Users can insert own saved items" on saved_items
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own saved items" on saved_items
  for delete using (auth.uid() = user_id);
