create or replace function increment_job_views(row_id uuid)
returns void as $$
  update public.jobs
  set views = views + 1
  where id = row_id;
$$ language sql security definer;
