-- 1. Создаем тип перечисления для способов связи
DO $$ BEGIN
    CREATE TYPE contact_method AS ENUM ('APPLICATIONS', 'PHONE', 'BOTH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Добавляем колонки в таблицу вакансий
-- Мы используем проверку на существование колонок, чтобы скрипт был безопасным
ALTER TABLE public.vacancies 
ADD COLUMN IF NOT EXISTS contact_method contact_method DEFAULT 'APPLICATIONS',
ADD COLUMN IF NOT EXISTS contact_phone TEXT;
