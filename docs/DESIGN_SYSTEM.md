# Design System & UI Guidelines

## 1. Principles
- **Mobile First:** Все компоненты сначала проектируются для мобильных экранов (320px+), затем расширяются для планшетов и ПК.
- **Clean & Professional:** Minimalist aesthetics, plenty of whitespace.
- **Trustworthy:** Use reliable, standard colors (blues/grays) with subtle accents.
- **Responsive:** Использование Chakra UI breakpoints (base, md, lg, xl).
- **Accessible:** WCAG 2.1 compliance.

## 2. Typography
- **Primary Font:** `Inter` or `Manrope` (Google Fonts). Excellent readability for dashboards.
- **Headings:** Bold weights (700/800).
- **Body:** Regular (400) or Medium (500).

## 3. Color Palette (Chakra UI Theme)

### Primary (Brand)
- `blue.500`: Primary buttons, links, active states.
- `blue.600`: Hover states.
- `blue.50`: Backgrounds for selected items.

### Secondary / Accent
- `teal.400`: Success messages, verified badges.
- `orange.400`: Warnings, "hot" vacancies.

### Neutrals
- `gray.50`: Main background (light mode).
- `gray.800`: Main text.
- `gray.500`: Secondary text (metadata).

## 4. Components Usage (Responsive Focus)

### Navigation
- **Mobile:** Bottom Navigation Bar (иконки: Поиск, Отклики, Профиль).
- **Desktop:** Top Header Navigation.

### Interactions
- **Touch-Friendly:** Кнопки и ссылки имеют минимальную область нажатия 44x44px.
- **Modals:** На мобильных приоритет отдается `Drawer` (Bottom Sheet), на ПК — `Modal` (центрированное окно).

### Cards (Vacancies/Profiles)
- **Mobile:** Одна колонка, акцент на ключевой информации (зарплата, город).
- **Desktop:** Сетка или список с расширенными метаданными.
- `bg='white'`, `shadow='sm'`, `border='1px solid'`, `borderColor='gray.100'`.
- `_hover={{ shadow: 'md' }}` interaction.

## 5. Layouts
- **Dashboard:** Sidebar navigation + Top Bar + Content Area.
- **Public:** Header (Logo + Nav + Login) + Hero Section + Content + Footer.
