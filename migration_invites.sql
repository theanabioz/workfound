create table public.company_invitations (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  email text not null,
  role text check (role in ('admin', 'recruiter')) not null default 'recruiter',
  token text not null unique,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.company_invitations enable row level security;

create policy "Admins can manage invitations" on company_invitations
  for all using (
    exists (
      select 1 from company_members
      where company_members.company_id = company_invitations.company_id
      and company_members.user_id = auth.uid()
      and company_members.role in ('owner', 'admin')
    )
  );
