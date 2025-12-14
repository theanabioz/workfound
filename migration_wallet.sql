alter table public.companies 
add column balance integer default 0 not null;

create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  amount integer not null,
  type text not null,
  description text,
  stripe_session_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

create policy "Company members view transactions" on transactions
  for select using (
    exists (
      select 1 from company_members 
      where company_members.company_id = transactions.company_id 
      and company_members.user_id = auth.uid()
    )
  );
