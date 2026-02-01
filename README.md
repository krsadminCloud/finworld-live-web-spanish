# FinWorld Platform — Web Application Documentation

FinWorld is a comprehensive financial calculator web application built with React, Vite, TailwindCSS, and Material‑UI. It includes multiple calculator modules, SEO support via `react-helmet-async`, optional data persistence via Supabase, and is optimized for deployment on Azure Static Web Apps.

## Project Overview

Multilingual React (Vite + MUI + Tailwind) app with language‑prefixed routing (`/:lang/*`, default `en`, also `es-us`). Core experiences:

- Home + Learn pages: `/about`, `/guides`, `/comparisons`, `/articles`, `/articles/:slug`
- Tools hub plus calculators under `/:lang/tools/*`:
  - Extra Payment — loan payoff acceleration
  - Take‑Home Pay — tax and deductions
  - Mortgage — payment, amortization, all‑rates view
  - Home Affordability — price + payment guardrails
  - Auto Loan — auto financing payment and schedule
  - Compounding — growth with flexible cadence
  - Buy vs Lease (Auto) — cost comparison
  - Retirement — savings growth and shortfall
  - Rental Property — cash flow, cap rate, ROI

## Tech Stack

- Frontend: React 18, Vite, TailwindCSS, Material‑UI
- SEO: `react-helmet-async`
- Backend (optional): Node.js, Express.js
- Database (optional): Supabase (`@supabase/supabase-js`)
- Charts: Chart.js, `react-chartjs-2`, Recharts
- UI animations: Framer Motion
- Document generation: `jspdf`, `jspdf-autotable`
- Icons: `lucide-react`
- Routing: React Router v6
- Deployment: Azure Static Web Apps

## High-Level Folder Layout

```
/src
  index.jsx                    # React entry point (bootstraps theme + i18n)
  App.jsx                      # Language-prefixed routes and lazy-loaded calculators
  createEmotionCache.js        # Emotion cache for MUI
  theme.js                     # MUI theme + color mode hook
  index.css                    # Global styles (Tailwind + custom)
  /assets/images               # App images
  /components                  # Shared UI components (ArticlesGrid, CalculatorCard, FeaturedTools, Footer, Navbar)
    /calculators_shared_files
      /all_rates               # Rate comparison components + API helpers
  /context
    ColorModeContext.js        # Theme context
  /data
    articles.js                # Article metadata (slugs, CTAs, summaries)
  /features/rental             # Rental calculator building blocks
    ...                        # inputs, results, tuning, export, state
  /pages
    Home.jsx                   # Landing page
    About.jsx | Guides.jsx | Comparisons.jsx
    ArticlesIndex.jsx | ArticlePage.jsx
    /tools                     # Calculator pages
      index.jsx                # Tools directory page
      /extra_payment
      /take_home_pay
      /Mortgage_calculator
        /allrates
      /home_affordability
      /auto_loan_calculator
      /compounding_calculator
      /buy_vs_lease_auto
      /retirement_calculator
      /rental_property_calculator
  /utils
    formatCurrency.js          # Currency formatting
    formatNumber.js            # Number formatting
    langRouting.js             # Helpers for language-aware navigation
```

Additional public assets used by calculators:

```
/public
  /thp-themes                  # Take-Home Pay page-scoped theme styles
    light.css                  # Light theme overrides (emerald outline)
    dark.css                   # Dark theme overrides (deep navy + emerald outline)
```

## Setup & Run

- Prerequisite: Node.js 18+

Commands:
- Install: `npm install`
- Dev: `npm run dev` (http://localhost:5173)
- Build: `npm run build` (outputs to `dist/`)
- Preview: `npm run preview`

## App Architecture

### Routing
- File: `src/App.jsx`
- Framework: React Router v6
- Language prefix: all pages live under `/:lang/*` where `lang` is `en` or `es-us`; root `/` redirects to `/en`.
- Routes (lazy-loaded under `/:lang/`):
  - `` — Home
  - `tools` — Calculators hub
  - `tools/extra-payment`
  - `tools/take-home-pay`
  - `tools/mortgage-calculator`
  - `tools/mortgage-calculator/allrates`
  - `tools/home-affordability`
  - `tools/auto-loan-calculator`
  - `tools/compounding-calculator`
  - `tools/buy-vs-lease-auto`
  - `tools/retirement-calculator`
  - `tools/rental-property-calculator`
  - Learn pages: `about`, `guides`, `comparisons`, `articles`, `articles/:slug`
- Legacy underscore/kebab paths are client-redirected to the canonical hyphenated versions to preserve inbound links.

### Global Layout & Styling
- BrowserRouter + Suspense fallback
- Material-UI + TailwindCSS
- Theme: `src/theme.js`; color mode: `src/context/ColorModeContext.js`
- Global styles in `src/index.css`
- Language-aware navigation helpers: `src/utils/langRouting.js` ensure links include the active `/:lang` prefix

#### Per-Tool Theme Overrides (Take-Home Pay)
- The Take-Home Pay calculator uses page-scoped light/dark CSS files loaded at runtime so its styles can diverge slightly from the global palette without affecting other pages.
- Loader: `src/pages/tools/take_home_pay/themeCssLoader.js` injects `<link id="thp-theme-css">` and swaps `href` when the global `dark` class toggles.
- Theme files: `public/thp-themes/light.css`, `public/thp-themes/dark.css`.
- Page wrapper: the route root element has a `.thp` class so overrides are limited to this page.
- Dark mode styling is tuned to match the FinCalc dark aesthetic (deep navy surfaces, soft blue-gray borders, emerald accent `#34D399`). Both light and dark modes add a subtle emerald outline on card-like containers.

### Mobile Responsiveness

- Calculators Hub (`src/pages/tools/index.jsx`): Mobile-only alignment and spacing tuned (Nov 2025).
  - AppBar: actions wrap on `xs` with `useFlexGap` row spacing; Toolbar `minHeight` raised on `xs`; dark-mode icon styled with subtle border/bg; "Rental Calculator" button removed (leaving only "My Account"); remaining button `size="small"`, responsive `px/py`, and `whiteSpace: 'nowrap'`.
  - Hero: responsive `fontSize`/`lineHeight`; hero container adds `px` on `xs`.
  - Search: centers with side margins on `xs` via `mx={{ xs: 2, sm: 'auto' }}`.
  - “Popular” pills and category chips: responsive font size/padding; containers use `useFlexGap` so wrapped rows have vertical spacing (`rowGap`).
  - Card grid: reduced `gap` on `xs`; slightly reduced card height to avoid crowding.
- Principle: keep desktop unchanged. All changes are gated behind MUI responsive `sx` props (`xs` overrides; `md+` preserves existing styles).

### SEO
- `index.html` includes base meta tags
- Per‑page SEO available via `react-helmet-async`
- Helmet usage is language-aware via `i18n` and route prefixes; ensure canonical/hreflang tags use the prefixed URLs.

## Calculator Modules (Highlights)

### Extra Payment Calculator
Path: `src/pages/tools/extra_payment/`
- Inputs for principal, APR, term, extra payments
- Amortization schedule, Recharts visuals, PDF/CSV export

### Take‑Home Pay Calculator
Path: `src/pages/tools/take_home_pay/`
- Federal/state/FICA calculations, filing statuses, deductions
- Charts and UI components; has its own configs but integrates with the main app

### Mortgage Calculator
Path: `src/pages/tools/Mortgage_calculator/`
- Payment breakdown, lender info, rate cards
- All rates comparison at `.../allrates`

### Home Affordability
Path: `src/pages/tools/home_affordability/`
- Income/expense inputs, DTI, scenario comparisons, charts

### Auto Loan, Compounding, Buy vs Lease, Retirement
Paths: `src/pages/tools/{auto_loan_calculator|compounding_calculator|buy_vs_lease_auto|retirement_calculator}`
- Auto loan amortization, compounding growth, lease vs buy comparison, retirement growth/shortfall

### Rental Property Calculator
Path: `src/pages/tools/rental_property_calculator/`
- Built using shared `src/features/rental/*`
- Inputs: Property, Loan, Income, Expenses
- Outputs: Results summary, ROI charts, export actions

## Articles
- Data source: `src/data/articles.js` (slug, excerpt, sections, CTAs)
- Routes: `/:lang/articles` (index) and `/:lang/articles/:slug` (detail)
- Components: `ArticlesIndex.jsx`, `ArticlePage.jsx`, `ArticlesGrid.jsx`

## Shared Components & Utilities

- Components: `ArticlesGrid.jsx`, `CalculatorCard.jsx`, `FeaturedTools.jsx`, `Navbar.jsx`, `Footer.jsx`
- Utilities: `formatCurrency.js`, `formatNumber.js`
- Rates: `components/calculators_shared_files/all_rates` (components + API helpers)

## Build & Deployment

### Vite
- Config: `vite.config.js` (React plugin, PostCSS, hashed assets)
- Scripts: `dev`, `build`, `preview`

### Sitemap & Robots
- Scripts: `scripts/generate-sitemap.js` (scans routes) and `scripts/copy-static.js` (moves assets to dist).
- Execution: Runs automatically as part of the `npm run build` command.
- Output: Generates `sitemap.xml` and copies `robots.txt` to the build output.
- TODO: `generate-sitemap.js` currently emits unprefixed URLs; update it to emit `/:lang/*` variants (or hreflang entries) to match the i18n routing scheme before shipping multilingual sitemaps.

### TailwindCSS
- Config: `tailwind.config.js`; works alongside Material‑UI components

### Azure Static Web Apps
- Config: `staticwebapp.config.json`
- SPA routing fallback to `index.html` with asset exclusions

## Integrations (Optional)

### Supabase
- Package: `@supabase/supabase-js`
- Use cases: saving user preferences, history, etc.
- Environment variables and actual wiring are not included in this repo

### Express / Server
- Dependencies (`express`, `cors`, `node-fetch`) are present for optional APIs
- No server folder is included; production target is static hosting

## Notes, Gaps, and Next Steps

- Mortgage calculator: remove any leftover incomplete/temporary files and finalize views
- Normalize per‑tool configs (e.g., `take_home_pay`) or document exceptions
- Add unit tests for calculation utilities under `src/pages/tools/**/utils`
- Wire optional Supabase integration if persisting scenarios is desired
- Continue performance tuning (charts, lazy loading, code splitting)
- Housekeeping: `src/App.js` is legacy; keep `src/App.jsx` as the active entry or remove the JS file to avoid confusion.

Data checks (Take-Home Pay):
- 2024 federal standard deduction values are correct in `src/pages/tools/take_home_pay/utils/taxData.js`.
- 2025 values have been updated to Single $15,750; MFJ $31,500; MFS $15,750; HOH $23,600.
- State-level deductions/exemptions are now tracked in `src/pages/tools/take_home_pay/utils/StateDeductions.js`, which mirrors the full table in `src/pages/tools/take_home_pay/utils/State Standard Deductions (2024-2025) – Amounts and Phase-Outs.docx`; use it when adjusting `calcStateTax` for more accurate deductions or phase-outs.

### Documentation Maintenance

- Source of truth: This `README.md` tracks structure, routes, tech stack, and notable UX changes.
- On feature additions or layout changes, update relevant sections (Structure, Routing, Mobile Responsiveness) in the same PR.
- Keep file references current and prefer workspace-relative paths.
 - For Take-Home Pay styling changes, prefer editing `public/thp-themes/*.css` to keep overrides page-scoped.



### Internationalization (i18n) Strategy (SEO-first)

FinWorld uses language-prefixed routes for all pages:

English: /en/...

Spanish (US): /es-us/...

Future languages follow the same pattern (e.g., /fr/..., /bn/...).

Language is global and persistent:

Selecting a language updates the entire site going forward.

Preference is stored in localStorage.
Storage key: `finworld.lang`; changes also update `<html lang>` at runtime.

Switching language preserves the current page path when possible:

Example: /en/tools/mortgage ⇄ /es-us/tools/mortgage.

Translation system

Use i18next + react-i18next.

Translations stored under src/locales/{lang}/...json.

English is the source language; other languages map to the same keys.

SEO requirements

Each language page must have:

Correct <html lang="..."> attribute (en, es-US, etc.)

Self-referencing canonical for that language URL

hreflang alternates linking all available language versions

Sitemaps:

A single combined sitemap.xml includes all language-prefixed URLs (English + all translations).

Hosting / Routing

Azure Static Web Apps must rewrite /en/* and /es-us/* routes to index.html to support SPA routing.
