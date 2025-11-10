# FinWorld Platform — Web Application Documentation

FinWorld is a comprehensive financial calculator web application built with React, Vite, TailwindCSS, and Material‑UI. It includes multiple calculator modules, SEO support via `react-helmet-async`, optional data persistence via Supabase, and is optimized for deployment on Azure Static Web Apps.

## Project Overview

This project is a modular React app with calculators under `src/pages/tools/`:

- Extra Payment Calculator — loan payoff acceleration
- Take‑Home Pay Calculator — tax and deductions
- Mortgage Calculator — payment and amortization
- Home Affordability — home purchase affordability
- All Rates Comparison — mortgage rate comparison
- Auto Loan Calculator — auto financing payment and schedule
- Compounding Calculator — growth with compounding
- Buy vs Lease (Auto) — cost comparison over term
- Retirement Calculator — savings growth and shortfall
- Rental Property Calculator — cash flow, cap rate, ROI analysis

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
  index.jsx                    # React entry point
  App.jsx                      # Routes and lazy-loaded calculators
  createEmotionCache.js        # Emotion cache for MUI
  theme.js                     # MUI theme + color mode hook
  index.css                    # Global styles (Tailwind + custom)
  /assets/images               # App images
  /components                  # Shared UI components
    ArticlesGrid.jsx
    CalculatorCard.jsx
    FeaturedTools.jsx
    Footer.jsx
    Navbar.jsx
    /calculators_shared_files
      /all_rates               # Rate comparison components + API helpers
  /context
    ColorModeContext.js        # Theme context
  /features/rental             # Rental calculator building blocks
    ...                        # inputs, results, tuning, export, state
  /pages
    Home.jsx                   # Landing page
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
- Routes (lazy-loaded):
  - `/` — Home
  - `/tools` — Calculators hub
  - `/tools/extra_payment`
  - `/tools/take_home_pay`
  - `/tools/mortgage_calculator`
  - `/tools/mortgage_calculator/allrates`
  - `/tools/home_affordability`
  - `/tools/auto_loan_calculator`
  - `/tools/compounding_calculator`
  - `/tools/buy_vs_lease_auto`
  - `/tools/retirement_calculator`
  - `/tools/rental_property_calculator`

### Global Layout & Styling
- BrowserRouter + Suspense fallback
- Material-UI + TailwindCSS
- Theme: `src/theme.js`; color mode: `src/context/ColorModeContext.js`
- Global styles in `src/index.css`

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

## Shared Components & Utilities

- Components: `ArticlesGrid.jsx`, `CalculatorCard.jsx`, `FeaturedTools.jsx`, `Navbar.jsx`, `Footer.jsx`
- Utilities: `formatCurrency.js`, `formatNumber.js`
- Rates: `components/calculators_shared_files/all_rates` (components + API helpers)

## Build & Deployment

### Vite
- Config: `vite.config.js` (React plugin, PostCSS, hashed assets)
- Scripts: `dev`, `build`, `preview`

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

### Documentation Maintenance

- Source of truth: This `README.md` tracks structure, routes, tech stack, and notable UX changes.
- On feature additions or layout changes, update relevant sections (Structure, Routing, Mobile Responsiveness) in the same PR.
- Keep file references current and prefer workspace-relative paths.
