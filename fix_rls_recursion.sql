create policy "Users can view own membership" on company_members
  for select using (user_id = auth.uid());
