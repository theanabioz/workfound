create or replace function get_my_company_ids()
returns setof uuid as $$
  select company_id from public.company_members where user_id = auth.uid();
$$ language sql security definer;

drop policy if exists "Users can view own membership" on company_members;
drop policy if exists "View team members" on company_members;

create policy "View team members" on company_members
  for select using (
    company_id in (select get_my_company_ids())
  );
