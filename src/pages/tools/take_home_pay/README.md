# Take-Home Pay Calculator

A comprehensive U.S. paycheck calculator integrated into the Finworld platform.

## Features

- **Federal Tax Calculation**: Supports 2024 and 2025 tax brackets with standard deductions
- **State Tax Calculation**: Comprehensive state tax data for all 50 states + DC
- **FICA Taxes**: Accurate Social Security and Medicare tax calculations including Additional Medicare Tax
- **Pre-Tax Deductions**: 401(k), HSA, FSA, Traditional IRA, student loan interest, health insurance
- **Post-Tax Deductions**: Roth IRA contributions
- **Tax Credits**: Child Tax Credit, Dependent Care Credit
- **State Comparison**: Compare take-home pay across different states
- **What-If Scenarios**: Bonus calculator and job offer comparison tools
- **Visual Breakdown**: Interactive pie chart showing income allocation

## Technology Stack

- **React 18** with hooks
- **Material-UI v7** for components and theming
- **Chart.js** with react-chartjs-2 for data visualization
- **React Router v6** for navigation

## Component Structure

```
take_home_pay/
├── index.jsx                 # Main calculator component
├── components/
│   ├── InputForm.jsx         # User input form with all fields
│   ├── TaxChart.jsx          # Pie chart visualization
│   ├── Tooltip.jsx           # Info tooltip component
│   ├── InfoChip.jsx          # Small info chips
│   └── Accordion.jsx         # Collapsible sections
└── utils/
    ├── taxData.js            # Tax brackets, rates, and state data
    └── taxCalculations.js    # Tax calculation functions
```

## Usage

The calculator is accessible at `/tools/take_home_pay` route.

Users can:
1. Enter income information for themselves and spouse
2. Select tax year (2024 or 2025)
3. Choose state of residence and filing status
4. Configure retirement contributions (401k, Roth IRA)
5. Add pre-tax deductions and tax credits
6. Compare results across multiple states
7. Calculate bonus impact and compare job offers

## Key Functions

### `calculateResults()`
Main calculation function that computes:
- Gross income
- Pre-tax deductions
- Federal tax (with standard deduction)
- State tax
- FICA tax
- Local tax
- Net pay
- Final net (after Roth contributions)

### `calcFederalTax(year, agi, status)`
Calculates federal income tax using progressive brackets.

### `calcStateTax(agi, state)`
Calculates state income tax using state-specific models (flat or progressive).

### `calcFicaTax(year, income, status)`
Calculates Social Security and Medicare taxes including Additional Medicare Tax.

## Tax Data

- **Federal Brackets**: 2024 and 2025 tax brackets for all filing statuses
- **State Models**: All 50 states + DC with flat or progressive tax structures
- **FICA Limits**: Annual Social Security wage base and Additional Medicare Tax thresholds
- **Standard Deductions**: Federal standard deductions by filing status and year

## Integration Notes

- Uses global ColorModeContext for dark/light theme
- Fully responsive with Material-UI Grid system
- No separate build process - integrated into main app
- All calculations are client-side (no API calls)
- No external dependencies beyond main app packages

## Future Enhancements

Potential features for database integration:
- Save calculation history for logged-in users
- Create shareable calculation links
- Save favorite state comparisons
- Track calculation trends over time
- Export calculations to PDF
