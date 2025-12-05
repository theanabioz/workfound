create table public.companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique,
  logo_url text,
  website text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.companies enable row level security;
create policy "Companies are viewable by everyone" on companies for select using (true);

create table public.company_members (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text check (role in ('owner', 'admin', 'recruiter')) not null default 'recruiter',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(company_id, user_id)
);

alter table public.company_members enable row level security;

create policy "Members can view team" on company_members
  for select using (
    exists (
      select 1 from company_members cm 
      where cm.company_id = company_members.company_id 
      and cm.user_id = auth.uid()
    )
  );

alter table public.jobs add column company_id uuid references public.companies(id);

do $$
declare
  rec record;
  new_company_id uuid;
begin
  for rec in select * from public.profiles where role = 'employer' loop
    insert into public.companies (name)
    values (coalesce(rec.company_name, rec.full_name || '''s Company'))
    returning id into new_company_id;

    insert into public.company_members (company_id, user_id, role)
    values (new_company_id, rec.id, 'owner');

    update public.jobs
    set company_id = new_company_id
    where employer_id = rec.id;
  end loop;
end $$;
