# Project memory

## Product intent & audience

- **Mi Dinero**: personal finance management mobile app, entirely in Spanish.
- Target: individual users managing personal money — track expenses, record income, organize savings goals.
- Platform: Android-first (Expo/React Native), responsive across screen sizes.
- No banking integration, no payment services — standalone offline personal finance tool.

## Brand personality & voice

- Professional, modern, clean. Spanish-only UI copy.
- Trustworthy and practical — money management tone, not playful.

## Visual design & UX direction

- Color palette: dark green, black, white. Dark mode supported (toggle in settings).
- Typography: Inter font family.
- Smooth animations throughout (transitions, modals, progress bars).
- Simple, elegant interface — minimal friction for core actions (add income/expense).
- Layout: tab-based navigation (Dashboard, Movements, Savings, History, Settings).
- Components: stat cards, bar charts (6-month trend), donut/pie charts (spending by category), progress bars (savings goals), transaction modal.
- Currency display: MXN (peso mexicano) as default; USD and EUR available as options.

## Decisions, constraints & rationale

- **Framework**: Expo (React Native) — cross-platform, easy Android APK build via EAS.
- **Storage**: AsyncStorage for persistent local data (survives app close). No backend.
- **Categories**: Comida, Transporte, Entretenimiento, Compras, Escuela, Otros (fixed set).
- **Seed data**: App ships with sample transactions and savings goals; user can clear all data from Settings.
- **All buttons functional** — no static prototypes; calculations auto-update on data change.
- **Build verified**: TypeScript typecheck and build pass clean.
- File structure: `/app/` for screens and contexts (ThemeContext, FinanceContext), `/components/` for shared UI.

## Open questions & assumptions

- No `.bolt/prompt` instructions exist yet — context inferred solely from user request.
- Currency conversion between MXN/USD/EUR: assumed display-only (no exchange rates implemented).
- No user authentication or multi-user support — single-user local app.
- Savings goals: assumed manual contributions only (no auto-deduction from balance).