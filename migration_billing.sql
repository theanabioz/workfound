alter table public.jobs 
add column is_highlighted boolean default false,
add column promoted_until timestamp with time zone;
