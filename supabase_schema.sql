-- 1. Profiles (Users)
-- Эта таблица расширяет стандартную таблицу auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  role text check (role in ('employer', 'seeker', 'admin')) not null default 'seeker',
  full_name text,
  company_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Включаем безопасность (Row Level Security)
alter table public.profiles enable row level security;

-- Политики доступа:
-- 1. Читать профили могут все (нужно для отображения работодателя в вакансии)
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

-- 2. Создавать/Обновлять профиль может только сам владелец
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- 2. Jobs (Вакансии)
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.profiles(id) not null,
  title text not null,
  description text not null,
  location text not null,
  salary_range text not null,
  application_method text check (application_method in ('internal_ats', 'phone', 'whatsapp', 'viber')) not null,
  contact_info text,
  status text check (status in ('draft', 'published', 'closed')) default 'published',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.jobs enable row level security;

-- Политики:
-- 1. Читать вакансии могут все
create policy "Jobs are viewable by everyone" on jobs for select using (true);

-- 2. Создавать/Править может только работодатель (владелец)
create policy "Employers can insert jobs" on jobs
  for insert with check (auth.uid() = employer_id);

create policy "Employers can update own jobs" on jobs
  for update using (auth.uid() = employer_id);

-- 3. Resumes (Резюме)
create table public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  about text,
  skills text,
  experience text,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.resumes enable row level security;

-- Политики:
-- 1. Владелец видит и правит свои резюме
create policy "Users can CRUD own resumes" on resumes
  for all using (auth.uid() = user_id);

-- 2. Работодатели могут видеть публичные резюме (на будущее)
create policy "Public resumes are viewable by everyone" on resumes
  for select using (is_public = true);

-- 4. Applications (Отклики)
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) not null,
  seeker_id uuid references public.profiles(id) not null,
  resume_id uuid references public.resumes(id), -- Ссылка на резюме
  status text check (status in ('new', 'viewed', 'interview', 'offer', 'rejected')) default 'new',
  cover_letter text,
  resume_url text, -- Для обратной совместимости или внешних файлов
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.applications enable row level security;

-- Политики (Сложные!):
-- 1. Соискатель видит свои отклики
create policy "Seekers can see own applications" on applications
  for select using (auth.uid() = seeker_id);

-- 2. Соискатель может создать отклик
create policy "Seekers can create applications" on applications
  for insert with check (auth.uid() = seeker_id);

-- 3. Работодатель видит отклики НА СВОИ вакансии
create policy "Employers can see applications for their jobs" on applications
  for select using (
    exists (
      select 1 from jobs
      where jobs.id = applications.job_id
      and jobs.employer_id = auth.uid()
    )
  );

-- Функция авто-создания профиля при регистрации
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (new.id, new.email, 'seeker', new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Триггер (срабатывает когда юзер регистрируется через Supabase Auth)
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
