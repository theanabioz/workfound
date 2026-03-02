# Design System & UI Guidelines

## 1. Principles
- **Clean & Professional:** Minimalist aesthetics, plenty of whitespace.
- **Trustworthy:** Use reliable, standard colors (blues/grays) with subtle accents.
- **Accessible:** WCAG 2.1 compliance (contrast ratios, keyboard navigation).
- **Responsive:** Mobile-first approach. All components must work on 320px+.

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

## 4. Components Usage

### Buttons
- **Primary:** Solid, `colorScheme='blue'`, rounded-md.
- **Secondary:** Outline, `colorScheme='gray'`, rounded-md.
- **Ghost:** For icons or less important actions.

### Forms
- **Input:** `variant='outline'`, `focusBorderColor='blue.500'`.
- **Labels:** Always present, readable font size (`sm` or `md`).
- **Validation:** Error messages in `red.500` below the input.

### Cards (Vacancies/Profiles)
- `bg='white'`, `shadow='sm'`, `border='1px solid'`, `borderColor='gray.100'`.
- `_hover={{ shadow: 'md' }}` interaction.

## 5. Layouts
- **Dashboard:** Sidebar navigation + Top Bar + Content Area.
- **Public:** Header (Logo + Nav + Login) + Hero Section + Content + Footer.
