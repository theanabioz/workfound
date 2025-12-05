drop policy if exists "Members can view team" on company_members;
drop policy if exists "Users can view own membership" on company_members;

create policy "Users can view own membership" on company_members
  for select using (user_id = auth.uid());
