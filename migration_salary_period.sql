alter table public.jobs 
add column salary_period text check (salary_period in ('hour', 'month', 'year')) default 'month';
