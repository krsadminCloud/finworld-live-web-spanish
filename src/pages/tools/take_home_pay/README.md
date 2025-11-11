# U.S. Take‑Home Pay Calculator (FinWorld)

This folder contains the Take‑Home Pay calculator used on FinWorld at route `/tools/take_home_pay`. The page is a React + Tailwind view integrated into the main Vite app and shares the site’s white/teal design system.

The goal of this README is to give future developers the context and patterns needed to extend or modify features with confidence.

## Quick Start

- From the repo root:
  - `npm install`
  - `npm run dev` and navigate to `/tools/take_home_pay`.
- Production build: `npm run build`
- Preview build: `npm run preview`

Tailwind config selection for CI/CD: the root `postcss.config.js` can point to a per‑tool Tailwind config via `APP_DIR`.

- Windows: `set APP_DIR=take_home_pay && npm run build`
- POSIX: `APP_DIR=take_home_pay npm run build`

## Tech Stack

- React 18, Vite
- Tailwind CSS (global utilities in `src/index.css`)
- Chart.js via `react-chartjs-2` (pie chart)
- MUI ThemeProvider is global; this page uses Tailwind for inputs/layout. `TaxChart` uses small MUI pieces (`Box`, `useTheme`).

## File Map (this tool)

- `index.jsx` — Main React page component
- `components/TaxChart.jsx` — Pie chart for breakdown
- `utils/taxData.js` — 2024/2025 tax constants (federal, FICA, state models)
- `utils/taxCalculations.js` — Calculation helpers (federal/state/FICA, formatting)
- `tailwind.config.js` — Local Tailwind tokens to align with site palette

Other shared files used:

- `src/components/calculators_shared_files/topBar.jsx` — Standard calculators header bar
- `src/index.css` — Global Tailwind layers, including the `input-focus` utility

Note: This directory also contains a legacy standalone app skeleton (`index.html`, `package.json`, TS configs). The integrated FinWorld route uses `index.jsx` under the main app’s Vite build.

## Data + Math Overview

All computations are isolated in `utils/`.

- `taxData.js`
  - `FICA_LIMITS` — Year → `{ ss_limit, ss_rate, med_rate, add_med_threshold }`
  - `FED_STD` — Standard deductions per filing status
  - `FED_BRACKETS` — Brackets per filing status
  - `STATE_MODELS` — Flat/progressive models per state (simplified estimator)
- `taxCalculations.js`
  - `formatCurrency(n)` — USD currency (0 decimals)
  - `calcFederalTax(year, agi, status)` → `{ tax, taxable, marginalRate, std }`
- `calcStateTax(agi, state, year, status)` → `{ tax, taxable, info, marginalRate }`
- `calcFicaTax(year, income, status)` → SS + Medicare + Additional Medicare (if above threshold)

State deduction/exemption policies for each state (2024/2025) live in `utils/StateDeductions.js` and feed into `calcStateTax` so the calculator subtracts the appropriate standard deduction (or exemption) before applying the state brackets/flat rate models.

Important behavior notes:

- FICA is computed on combined household income to match prior behavior. For more accuracy, compute per earner and sum.
- State models are simplified; use `overrideStateRate` to force a flat effective rate.

## Page Architecture (`index.jsx`)

The page keeps inputs in local state and uses `useMemo` for derived values.

Key state fields:

- Income and filing: `income`, `spouseIncome`, `year`, `state`, `status`
- Retirement and post‑tax: `k401Percent`, `spouseK401Percent`, `rothAmount`, `spouseRothAmount`
- Pre‑tax deductions: `healthInsurance`, `hsa`, `traditionalIra`, `studentLoanInterest`, `fsaContribution`, `otherPreTaxDeductions`
- Credits + local: `childTaxCredit`, `dependentCareCredit`, `localTaxRate`
- Overrides: `overrideStateRate`

Compute pipeline (in `useMemo`):

1. `totalIncome = income + spouseIncome`
2. 401(k) contributions derived from percents (per earner), then summed
3. `preTaxDeductions = 401(k) + healthInsurance + hsa + traditionalIra + studentLoanInterest + fsaContribution + otherPreTaxDeductions`
4. `adjustedIncome = totalIncome - preTaxDeductions`
5. Federal tax via `calcFederalTax`
6. State tax via `calcStateTax` (or `overrideStateRate`)
7. FICA via `calcFicaTax(totalIncome)`
8. Local tax = `adjustedIncome * (localTaxRate/100)`
9. `totalTax = federal + state + fica + local`
10. `netPay = totalIncome - preTaxDeductions - totalTax`
11. `finalNet = netPay - (rothAmount + spouseRothAmount)`

The memo returns all values consumed by the chips, breakdown list, and chart, including weekly/biweekly/monthly nets.

## UI Structure

- Topbar: shared component
- Left column (inputs): stacked fields for fast entry
  - Your/Spouse income
  - Year + State
  - Filing status
  - Override State Effective Rate (optional)
  - Local Tax Rate (%)
  - 401(k) groups (Your 401(k) above Spouse’s 401(k))
  - Roth IRA groups
  - Advanced options (pre‑tax deductions, credits, etc.)
- Right column (results):
  - Header with Annual Take‑Home and chips: Std Deduction, Federal Taxable, State Taxable, State Deduction, Federal Marginal, 401(k) per paycheck, State Marginal
- Breakdown list with zebra rows, percent‑of‑gross chips for each deduction/tax
- Total Pre‑Tax Deductions row includes a “Show details” toggle that itemizes: Your 401(k), Spouse’s 401(k), Health Insurance, HSA, Traditional IRA, Student Loan Interest, FSA, and Other Pre‑Tax Deductions (only non‑zero rows are shown)
- Final Net (Weekly, Biweekly, Monthly) emphasized in bold
- `TaxChart` pie (federal, state, FICA, local, pre‑tax, Roth, net)
- Compare States mini‑cards

### Styling Notes

- Inputs follow: `w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus`.
- Floating label pattern exists for percent inputs using `data-has-value` + peer selectors.
- Ensure `APP_DIR=take_home_pay` for CI builds that rely on dynamic PostCSS config.

### Theme Separation (Light/Dark)

- This page keeps light and dark styles in separate CSS files loaded at runtime, scoped to this page only.
- Files: `public/thp-themes/light.css` and `public/thp-themes/dark.css` define variables and targeted overrides for the `.thp` wrapper.
- Loader: `src/pages/tools/take_home_pay/themeCssLoader.js` injects a `<link id="thp-theme-css">` and swaps `href` when the global `dark` class toggles.
- Integration: `src/pages/tools/take_home_pay/index.jsx` adds a top-level `.thp` wrapper and a `useEffect` with a `MutationObserver` to stay in sync with the global theme toggle.
- Extend by adding overrides inside those CSS files; prefer variable-driven styles to avoid touching JSX.

## Charts

- `components/TaxChart.jsx` wraps `react-chartjs-2` Pie
- Inputs: `federalTax`, `stateTax`, `ficaTax`, `localTax`, `preTaxDeductions`, `rothContributions`, `netPay`
- Adjust the `backgroundColor` array to match any palette updates.

## Sanity Test Scenario

Use this to verify math after changes to `utils/` or tax tables.

- Year 2025, Status MFJ, State NY
- Incomes: You 120,000; Spouse 80,000 (Gross 200,000)
- 401(k): 5% each (10,000 total)
- Pre‑tax: Health 4,800; HSA 3,850
- Local tax 0%; Roth 7,000 each

Expected key results (given current `taxData.js`):

- Pre‑tax deductions: 18,650
- Adjusted income: 181,350
- Federal taxable: 151,350; Federal marginal: 22.00%
- Federal tax: 23,125
- NY state tax: 10,798.125; State marginal: 6.25%
- FICA tax: 13,743.80
- Net after taxes: 133,683.075
- Final net (after Roth): 119,683.075

If these differ materially after your change, audit `taxData.js` and the calculation steps above.

## Adding Features / Common Tasks

- Add a new input
  1. Extend default state in `index.jsx`
  2. Add the field to the inputs card
  3. Include it in the compute memo
  4. Update breakdown and/or chart labels

- Contribution caps (e.g., 401(k), HSA)
  - Clamp inputs to IRS limits before calculating `preTaxDeductions`.

- Improve FICA accuracy per earner
  - Compute `calcFicaTax` per earner and sum.

- Modify tax tables
  - Update `utils/taxData.js` (FED/STATE/FICA). Keep shapes identical.

## Recent Changes (Nov 2025)

- Reordered inputs: “Your 401(k)” appears above “Spouse’s 401(k)”.
- Removed duplicate state “Marginal” chip; keep “State Marginal”.
- Polished Breakdown list with zebra rows and percent‑of‑gross chips.
- Added Final Net Weekly/Biweekly/Monthly (bold emphasized).
- Added itemized pre‑tax breakdown under “Total Pre‑Tax Deductions” with a Show/Hide details toggle; 401(k) split into Your vs Spouse.
- Added "Your Annual Bonus" and "Spouse’s Annual Bonus" inputs under income; included in gross income.
- Added per‑earner control to apply 401(k)% to Salary only vs Salary + Bonus (default Salary + Bonus).
- Added an “Income details” toggle under Gross Income to itemize base vs bonus per earner.
 - Removed What‑If Scenarios card in favor of core inputs and Compare States.

## Troubleshooting

- Tailwind config not applied → verify `APP_DIR=take_home_pay` during build.
- Odd characters in JSX → ensure proper UTF‑8 content; avoid pasting smart quotes or hidden glyphs.
- Chart colors/labels → edit `components/TaxChart.jsx` dataset and labels.

## License / Headers

This project follows the repository’s license and contribution guidelines. Do not add license headers to individual files unless requested by maintainers.

---

If you extend this page, please update this README with new fields, flows, and any non‑obvious behaviors.
