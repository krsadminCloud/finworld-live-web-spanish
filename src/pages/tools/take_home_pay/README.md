# U.S. Take‑Home Pay Calculator (FinWorld)

This folder contains the Take‑Home Pay calculator used on FinWorld at route `/tools/take_home_pay`. The page is a React + Tailwind view integrated into the main Vite app and shares the site’s white/teal UI system (same feel as Buy vs Lease).

The goal of this README is to give future developers the context and patterns needed to extend or modify features with confidence.

## Quick Start

- Dev server (root of repo):
  - `npm install`
  - `npm run dev` → opens the Vite app; navigate to `/tools/take_home_pay`.
- Production build: `npm run build`
- Preview build: `npm run preview`

Note on Tailwind config selection for CI/CD builds: the root `postcss.config.js` can select a per‑tool Tailwind config via `APP_DIR`. If you need to ensure this tool’s Tailwind file is used, set:

- Windows: `set APP_DIR=take_home_pay && npm run build`
- POSIX: `APP_DIR=take_home_pay npm run build`

## Tech Stack

- React 18, Vite
- Tailwind CSS (site‑wide white/teal theme, shared utilities in `src/index.css`)
- Chart.js via `react-chartjs-2` for the pie chart
- Global MUI ThemeProvider is present for the site, but this page uses Tailwind components (no MUI widgets here)

## File Map (this tool)

- `index.jsx` — Main React view (page component)
- `components/TaxChart.jsx` — Pie chart for breakdown
- `utils/taxData.js` — 2024/2025 tax constants (federal, FICA, state models)
- `utils/taxCalculations.js` — Calculation helpers (federal/state/FICA, formatting)
- `tailwind.config.js` — Tailwind overrides to align with site white/teal palette

Other shared files used:

- `src/components/calculators_shared_files/topBar.jsx` — Standard header bar used across calculators
- `src/index.css` — Global Tailwind layers, including `input-focus` utility used for consistent focus treatment

Route wiring (outside this folder):

- `src/App.jsx` → `<Route path="/tools/take_home_pay" element={<TakeHomePayCalculator />} />`

## Data + Math Overview

All computations are isolated in `utils/`.

- `taxData.js`
  - `FICA_LIMITS` — Year → `{ ss_limit, ss_rate, med_rate, add_med_threshold }`
  - `FED_STD` — Standard deductions per filing status
  - `FED_BRACKETS` — Brackets per filing status
  - `STATE_MODELS` — Flat/progressive models per state (simplified for an estimator)
- `taxCalculations.js`
  - `formatCurrency(n)` — USD currency (0 decimals)
  - `calcFederalTax(year, agi, status)` → `{ tax, taxable, marginalRate, std }`
  - `calcStateTax(agi, state)` → `{ tax, info, marginalRate }`
  - `calcFicaTax(year, income, status)` → Sum of SS + Medicare with 0.9% additional Medicare above thresholds

Important behavior notes:

- FICA is computed on combined household income to match the original legacy tool’s behavior. If you need more accurate per‑earner wage‑base handling, refactor to compute per earner and sum.
- State models are simplified; some states have more nuance by filing status/credits. Use `overrideStateRate` to force a user‑chosen flat effective rate.

## Page Architecture (`index.jsx`)

The page component is self‑contained and uses React state + `useMemo` to compute results as inputs change.

Key state fields:

- Income and filing context: `income`, `spouseIncome`, `year`, `state`, `status`
- Retirement + post‑tax: `k401Percent`, `spouseK401Percent`, `rothAmount`, `spouseRothAmount`
- Pre‑tax deductions: `healthInsurance`, `hsa`, `traditionalIra`, `studentLoanInterest`, `fsaContribution`, `otherPreTaxDeductions`
- Credits + local: `childTaxCredit`, `dependentCareCredit`, `localTaxRate`
- Overrides: `overrideStateRate` (percent string or number)

Compute pipeline (in `useMemo`):

1. `totalIncome = income + spouseIncome`
2. 401(k) contributions derived from percents
3. `preTaxDeductions` = sum of pre‑tax inputs + 401(k)
4. `adjustedIncome = totalIncome - preTaxDeductions`
5. Federal tax via `calcFederalTax`
6. State tax via `calcStateTax` or override
7. FICA via `calcFicaTax(totalIncome)`
8. Local tax = `adjustedIncome * (localTaxRate/100)`
9. `totalTax = federal + state + fica + local`
10. `netPay = totalIncome - preTaxDeductions - totalTax`
11. `finalNet = netPay - rothTotal` (post‑tax reductions)

Derived display values (for chips, table, and chart) are returned together from the memo and consumed by the JSX.

## UI Structure

- Topbar: `components/calculators_shared_files/topBar.jsx`
- Left column (inputs): a single card composed of stacked fields to reduce friction
  - Income fields (full‑width inputs with white background and teal focus via `input-focus`)
  - Year + State selects (same style)
  - Filing status select
  - Override State Effective Rate (optional)
  - Local Tax Rate (%)
  - 401(k) groups — static cards with a floating label input reading “Percent of your income”
  - Roth IRA groups — static cards with standard inputs
  - Remaining pre‑tax and credit fields — standard inputs
- Right column (results):
  - Header with Annual Take‑Home + chips (std deduction, taxable, marginal rates)
  - Breakdown grid
  - `TaxChart` pie (federal, state, FICA, local, pre‑tax, Roth, net)
  - Compare States mini‑cards
  - What‑If scenarios (bonus + offer comparison)

### Styling Notes

- Inputs follow the same class pattern used in Buy vs Lease: `w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus`.
- Floating label pattern (used for 401(k) percent inputs):
  - Input: add `peer placeholder-transparent pt-5` and `data-has-value` when value is set
  - Sibling label: absolutely positioned with peer focus/placeholder rules to “float”
- The page adopts the site’s white/teal palette. Calculator‑specific Tailwind tokens live in `tailwind.config.js` in this folder. For CI, ensure `APP_DIR=take_home_pay` so classes get scanned when using the dynamic postcss config.

## Charts

- `components/TaxChart.jsx` wraps `react-chartjs-2` Pie
- Inputs: `federalTax`, `stateTax`, `ficaTax`, `localTax`, `preTaxDeductions`, `rothContributions`, `netPay`
- If you want to align the pie colors to teal accents, adjust the `backgroundColor` array.

## Adding Features / Common Tasks

- Add a new input
  1. Extend default state in `index.jsx`
  2. Add the field to the inputs card (left column)
  3. Include it in the compute memo where applicable
  4. Update the breakdown grid and/or chart labels if needed

- Add contribution caps (e.g., 401(k) or HSA)
  - Implement a helper to clamp inputs to current IRS limits and call it before computing `preTaxDeductions`.

- Improve FICA accuracy per earner
  - Call `calcFicaTax` separately for each earner’s income and sum the results; remove the combined‑income call.

- Modify tax tables
  - Update `utils/taxData.js` (FED/STATE/FICA). Keep the shapes identical and ensure numeric values are floats.

- State overrides
  - `overrideStateRate` supports a typed percent; when present it bypasses `STATE_MODELS` and shows an info chip indicating the override.

## Known Limitations / Tips

- Unicode in JSX: use valid JSX (`className="…"`) and avoid raw `\` escapes in string literals. If you paste content from other editors, verify glyphs render in JSX (we use the `ⓘ` info marker consistently).
- The tool includes an old standalone app skeleton under this directory (e.g., `index.html`, `package.json`, TS configs). The integrated FinWorld page uses the main app router and bundler. Treat those standalone files as legacy unless you need a separate build.
- Do not mix MUI inputs into this page unless necessary—consistency is maintained with Tailwind components.

## Code Style & Conventions

- Keep components small and focused; business logic in `utils/`.
- Prefer `useMemo`/`useCallback` for derived values and event handlers.
- Use `input-focus` utility for teal focus rings; keep borders neutral and backgrounds white for inputs.
- Maintain the route and topbar pattern for consistency with other tools.

## Where to Look When Something Breaks

- Build issues selecting Tailwind config → check `postcss.config.js` + `APP_DIR`.
- Strange glyphs/escape errors in JSX → check for non‑ASCII or wrong escaping; use `className`, not raw HTML `class`.
- Incorrect tax numbers → confirm `utils/taxData.js` and the chosen `year`, `status` path through `calcFederalTax`.
- Chart not updating on theme change → `TaxChart` re‑keys on palette mode; ensure theme context is available globally.

## License / Headers

This project follows the repository’s license and contribution guidelines. Do not add license headers to individual files unless required by the repo maintainers.

---

If you extend this page, please update this README with new fields, flows, and any non‑obvious behaviors.
