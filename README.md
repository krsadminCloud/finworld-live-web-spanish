# Finworld Homepage Package (React + MUI + Router)

This package provides a production-ready homepage and layout for **Finworld** with:
- React 18 + Vite
- MUI 6 (Material UI) + custom theme (primary `#119ad4`) with dark/light toggle
- React Router v6 routes:
  - `/` (Home)
  - `/tools/extra_payment`
  - `/tools/paycheck`
- Azure Static Web Apps routing via `staticwebapp.config.json`

## Quick Start (Local)

```bash
npm install
npm run start
# open http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Azure Static Web Apps (SWA)

- **App location**: `/`
- **Output location**: `dist`
- Ensure your SWA workflow uses `npm ci` and `npm run build`.
- `staticwebapp.config.json` ensures client-side routing falls back to `index.html`.

## Integrating Existing Calculators

- Replace placeholder pages:
  - `src/pages/tools/extra_payment/index.jsx`
  - `src/pages/tools/paycheck/index.jsx`
- Import your existing components and render them inside those files.

## Structure

```
src/
  components/
    Navbar.jsx
    Footer.jsx
    FeaturedTools.jsx
    ArticlesGrid.jsx
  pages/
    Home.jsx
    tools/
      extra_payment/index.jsx
      paycheck/index.jsx
  App.jsx
  theme.js
  index.js
```
