-- 1. Enums для строгой типизации
-- Удаляем, если они уже существуют (для чистого наката)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS job_type CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;

CREATE TYPE user_role AS ENUM ('WORKER', 'EMPLOYER', 'ADMIN');
CREATE TYPE job_type AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY');
CREATE TYPE application_status AS ENUM ('PENDING', 'REVIEWING', 'INTERVIEW', 'OFFER', 'REJECTED');

-- 2. Основная таблица профилей (связана с auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'WORKER' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Профиль Соискателя
CREATE TABLE IF NOT EXISTS public.worker_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  profession TEXT,
  experience_years INTEGER DEFAULT 0,
  skills TEXT[], -- Массив навыков
  resume_url TEXT,
  bio TEXT,
  location_country TEXT,
  location_city TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Профиль Работодателя
CREATE TABLE IF NOT EXISTS public.employer_profiles (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  company_name TEXT,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  industry TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Вакансии
CREATE TABLE IF NOT EXISTS public.vacancies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES public.employer_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  salary_min DECIMAL,
  salary_max DECIMAL,
  currency TEXT DEFAULT 'EUR',
  location_country TEXT NOT NULL,
  location_city TEXT NOT NULL,
  job_type job_type DEFAULT 'FULL_TIME',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. Отклики
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vacancy_id UUID REFERENCES public.vacancies(id) ON DELETE CASCADE NOT NULL,
  worker_id UUID REFERENCES public.worker_profiles(id) ON DELETE CASCADE NOT NULL,
  status application_status DEFAULT 'PENDING',
  cover_letter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(vacancy_id, worker_id) -- Один соискатель - один отклик на вакансию
);

-- 7. Автоматическое создание профиля при регистрации (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_role_val public.user_role;
BEGIN
  -- Получаем роль из метаданных пользователя (передаем при регистрации)
  user_role_val := COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'WORKER');

  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, user_role_val);
  
  -- Создаем пустой профиль в зависимости от роли
  IF user_role_val = 'EMPLOYER' THEN
    INSERT INTO public.employer_profiles (id) VALUES (new.id);
  ELSE
    INSERT INTO public.worker_profiles (id) VALUES (new.id);
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Удаляем триггер если он есть и создаем заново
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. Row Level Security (RLS) Policies
-- Включаем RLS (хотя опция в консоли уже может быть включена)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Правила для Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Правила для Worker Profiles
DROP POLICY IF EXISTS "Workers can view/edit own profile" ON public.worker_profiles;
CREATE POLICY "Workers can view/edit own profile" ON public.worker_profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Employers can view worker profiles" ON public.worker_profiles;
CREATE POLICY "Employers can view worker profiles" ON public.worker_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'EMPLOYER')
);

-- Правила для Employer Profiles
DROP POLICY IF EXISTS "Public can view employer profiles" ON public.employer_profiles;
CREATE POLICY "Public can view employer profiles" ON public.employer_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Employers can edit own profile" ON public.employer_profiles;
CREATE POLICY "Employers can edit own profile" ON public.employer_profiles FOR UPDATE USING (auth.uid() = id);

-- Правила для Вакансий
DROP POLICY IF EXISTS "Anyone can view active vacancies" ON public.vacancies;
CREATE POLICY "Anyone can view active vacancies" ON public.vacancies FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Employers can manage own vacancies" ON public.vacancies;
CREATE POLICY "Employers can manage own vacancies" ON public.vacancies FOR ALL USING (auth.uid() = employer_id);

-- Правила для Откликов
DROP POLICY IF EXISTS "Workers can manage own applications" ON public.applications;
CREATE POLICY "Workers can manage own applications" ON public.applications FOR ALL USING (auth.uid() = worker_id);

DROP POLICY IF EXISTS "Employers can view applications to their vacancies" ON public.applications;
CREATE POLICY "Employers can view applications to their vacancies" ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.vacancies WHERE id = public.applications.vacancy_id AND employer_id = auth.uid())
);
