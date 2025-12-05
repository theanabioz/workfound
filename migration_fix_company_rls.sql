create policy "Members can update their company" on companies
  for update using (
    exists (
      select 1 from company_members 
      where company_members.company_id = companies.id 
      and company_members.user_id = auth.uid()
      and company_members.role in ('owner', 'admin')
    )
  );
