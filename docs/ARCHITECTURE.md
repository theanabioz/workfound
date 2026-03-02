# Architecture & Technical Specification

## 1. Технологический стек

### Frontend & Backend (Monorepo / Next.js)
Мы будем использовать **Next.js (App Router)** как основной фреймворк для Fullstack-приложения. Это обеспечит лучший SEO (Server-Side Rendering), быструю разработку и отличную производительность.

- **Framework:** Next.js 14+ (TypeScript).
- **UI Library:** Chakra UI (v2) + Framer Motion (для анимаций).
- **State Management:** React Context + Zustand (для глобального состояния, если потребуется сложная логика).
- **Data Fetching:** React Server Components (RSC) + Server Actions (для мутаций) + TanStack Query (для клиентской части, если нужно кэширование).
- **Forms:** React Hook Form + Zod (валидация схем).

### Database & Infrastructure
- **Database:** PostgreSQL (Hosted on Supabase).
- **ORM/Client:** Supabase Client (@supabase/supabase-js) + SSR Helpers (@supabase/ssr).
- **Auth:** Supabase Auth (Built-in). Поддержка Email/Password, Magic Links и OAuth (Google).
- **File Storage:** Supabase Storage (S3-compatible) — для хранения резюме и логотипов.
- **Hosting:** Vercel.
- **Real-time:** Supabase Realtime (для уведомлений и чатов).

## 2. Структура Базы Данных (ERD Overview)

### Основные сущности:

#### `User` (Пользователь)
- `id`: UUID
- `email`: String (Unique)
- `passwordHash`: String
- `role`: Enum (`WORKER`, `EMPLOYER`, `ADMIN`)
- `createdAt`: DateTime

#### `WorkerProfile` (Профиль соискателя)
- `userId`: FK -> User
- `firstName`: String
- `lastName`: String
- `phone`: String
- `country`: String
- `city`: String
- `profession`: String (Основная специальность)
- `skills`: String[] (Массив навыков)
- `resumeFileUrl`: String (Ссылка на файл резюме)
- `experienceYears`: Int
- `bio`: Text (О себе)

#### `EmployerProfile` (Профиль работодателя)
- `userId`: FK -> User
- `companyName`: String
- `website`: String?
- `logoUrl`: String?
- `industry`: String (Отрасль)
- `description`: Text
- `verified`: Boolean (Статус проверки)

#### `Vacancy` (Вакансия)
- `id`: UUID
- `employerId`: FK -> EmployerProfile
- `title`: String
- `description`: Text
- `requirements`: Text
- `salaryMin`: Decimal?
- `salaryMax`: Decimal?
- `currency`: String (EUR, USD, RUB)
- `locationCountry`: String
- `locationCity`: String
- `jobType`: Enum (`FULL_TIME`, `PART_TIME`, `CONTRACT`, `TEMPORARY`)
- `status`: Enum (`OPEN`, `CLOSED`, `ARCHIVED`)
- `createdAt`: DateTime

#### `Application` (Отклик на вакансию)
- `id`: UUID
- `vacancyId`: FK -> Vacancy
- `workerId`: FK -> WorkerProfile
- `status`: Enum (`PENDING`, `REVIEWING`, `INTERVIEW`, `OFFER`, `REJECTED`)
- `coverLetter`: Text?
- `appliedAt`: DateTime

## 3. Архитектура приложения (Folder Structure)

```
/src
  /app          # Next.js App Router
    /(auth)     # Группировка маршрутов авторизации (login, register)
    /dashboard  # Защищенные маршруты (личный кабинет)
      /worker
      /employer
    /api        # API Routes (если нужны отдельные эндпоинты)
  /components   # UI компоненты
    /ui         # Базовые компоненты (Button, Input)
    /features   # Компоненты с бизнес-логикой (VacancyCard, ProfileForm)
  /lib          # Утилиты, настройки (prisma, auth options)
  /services     # Сервисный слой (общение с БД, внешние API)
  /types        # TypeScript типы
```

## 4. Безопасность
- **Role-Based Access Control (RBAC):** Middleware для проверки ролей на защищенных маршрутах.
- **CSRF Protection:** Встроено в Next.js/Auth.js.
- **Input Validation:** Zod на всех уровнях (API + Client Forms).
