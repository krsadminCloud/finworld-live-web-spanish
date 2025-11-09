# Rental Property Calculator (FinWorld Edition)

A self‑contained tool for analyzing rental properties: cash flow, cap rate, cash‑on‑cash return, and projected ROI over time.

## Features

- Property, loan, income, and expense inputs with sensible defaults
- Monthly cash flow, NOI, cap rate, cash‑on‑cash, and 5‑year ROI
- ROI over time chart and monthly cash‑flow breakdown (via `recharts`)
- Fine‑tuning sliders for quick scenario testing
- Copyable summary text; PDF placeholder action

## App Structure

- `index.jsx` — page entry rendering all sections
- `components/` — shared UI primitives for this tool
  - `Card.jsx`, `TooltipInfo.jsx`
- `inputs/` — input sections
  - `PropertyInfo.jsx`, `LoanDetails.jsx`, `Income.jsx`, `Expenses.jsx`
- `results/` — results and charts
  - `ResultsSummary.jsx`, `Charts.jsx`
- `tuning/` — interactive sliders panel
  - `TuningPanel.jsx`
- `export/` — share/export actions
  - `ExportActions.jsx`
- `state/` — local state management hook
  - `useCalculatorState.js`
- `utils/` — pure calculation helpers (no React)
  - `calculations.js`

All code for this app lives inside this folder (no external `src/features/...` dependencies).

## Requirements

- React 18+
- Tailwind CSS (styles/classes assumed by components)
- `recharts` for charts:

```
npm install recharts
```

If your project uses pnpm or yarn:

```
pnpm add recharts
# or
yarn add recharts
```

## Usage

Import or route to the page component at `./index.jsx`. The page composes inputs, results, charts, tuning, and export actions and manages state via `useCalculatorState`.

Key hook exports (from `state/useCalculatorState.js`):
- `inputs` — current input model `{ property, loan, income, expenses }`
- `setProperty`, `setLoan`, `setIncome`, `setExpenses` — update helpers
- `analysis` — computed KPIs (cash flow, NOI, cap rate, CoC, ROI 5y)
- `roiSeries` — data for the ROI‑over‑time chart
- `reset` — restore defaults

## Calculations Overview

- Mortgage P&I, points, total investment
- Income with vacancy, expenses (taxes/insurance annual, others monthly)
- NOI, cap rate, monthly cash flow
- Cash‑on‑cash and 5‑year ROI including principal paydown

See `utils/calculations.js` for exact formulas.

## Theming & Styling

- Tailwind classes assume a `primary` color palette is available.
- Adjust palette in your project Tailwind config if needed.

## Notes

- The charts require `recharts`. If missing, install and rebuild.
- The PDF download is a placeholder; plug in your preferred PDF solution.

## Maintenance

- This app is self‑contained. To evolve it independently, keep additions within this folder and prefer pure functions inside `utils/` for new calculations.

