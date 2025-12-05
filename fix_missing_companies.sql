do $$
declare
  rec record;
  new_company_id uuid;
begin
  for rec in 
    select * from public.profiles 
    where role = 'employer' 
    and not exists (select 1 from public.company_members where user_id = profiles.id)
  loop
    -- Создаем компанию
    insert into public.companies (name)
    values (coalesce(rec.company_name, rec.full_name || '''s Company', 'My Company'))
    returning id into new_company_id;

    -- Привязываем
    insert into public.company_members (company_id, user_id, role)
    values (new_company_id, rec.id, 'owner');
    
    -- Обновляем вакансии (если есть бесхозные)
    update public.jobs
    set company_id = new_company_id
    where employer_id = rec.id and company_id is null;
  end loop;
end $$;
