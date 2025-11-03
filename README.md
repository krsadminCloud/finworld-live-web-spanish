# FinWorld Platform – Web Application Documentation

FinWorld Platform is a comprehensive **financial calculator web application** built with React, Vite, and Material-UI. The application includes multiple financial calculator modules, backend integration with Supabase and Express, and is optimized for deployment on **Azure Static Web Apps**.

## Project Overview

This project is a financial calculator web application built with React, Node.js backend, and modern frontend technologies. It includes multiple financial calculator modules under `src/pages/tools/`, such as:

- **Extra Payment Calculator** - Loan payoff acceleration calculator
- **Take-Home Pay Calculator** - Income tax and deductions calculator  
- **Mortgage Calculator** - Mortgage payment and amortization calculator
- **Home Affordability Calculator** - Home purchase affordability analysis
- **All Rates Comparison** - Mortgage rates comparison tool

## Tech Stack

- **Frontend:** React 18, Vite, TailwindCSS, Material-UI
- **Backend:** Node.js, Express.js
- **Database:** Supabase (via @supabase/supabase-js)
- **Charts:** Chart.js, react-chartjs-2, Recharts
- **UI Animations:** Framer Motion
- **Document Generation:** jsPDF, jsPDF-autotable
- **Icons:** Lucide React
- **Additional:** React Router DOM, CORS, Node-fetch
- **Deployment:** Azure Static Web Apps

## Deployment Target

- Azure Static Web Apps

## High-Level Folder Layout

```
/src
├── main.jsx                    # Application entry point
├── App.jsx                     # Main application component with routing
├── createEmotionCache.js       # Emotion cache setup for MUI
├── theme.js                    # MUI theme configuration
├── index.css                   # Global styles
├── /assets                     # Static assets
│   └── /images                # Application images
├── /components                 # Shared React components
│   ├── ArticlesGrid.jsx
│   ├── CalculatorCard.jsx
│   ├── FeaturedTools.jsx
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   └── /calculators_shared_files # Shared calculator utilities
│       └── /all_rates        # Rate comparison components
├── /context                    # React context providers
│   └── ColorModeContext.js    # Theme context
├── /pages                      # Application pages
│   ├── Home.jsx               # Main landing page
│   └── /tools                 # Financial calculator tools
│       ├── index.jsx          # Tools directory page
│       ├── /extra_payment     # Extra payment calculator
│       ├── /take_home_pay     # Take-home pay calculator
│       ├── /Mortgage_calculator # Mortgage calculator
│       │   └── /allrates      # Rate comparison tool
│       └── /home_affordability # Home affordability calculator
└── /utils                      # Shared utilities
    ├── formatCurrency.js      # Currency formatting
    └── formatNumber.js        # Number formatting
```

## Setup & Run Instructions

### Prerequisites

- Node.js (version 18 or higher)

### Installation Steps

1. Clone the repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies

### Local Development

- Start the development server: `npm run dev`
- Open browser and navigate to: `http://localhost:5173`

### Build

- Build the project: `npm run build`
- Output will be in the `/dist` directory
- Preview build: `npm run preview`

## Global App Architecture

### Routing Configuration
- **File:** `src/App.jsx`
- **Framework:** React Router DOM v6
- **Routes:**
  - `/` - Home page
  - `/tools` - Financial calculators directory
  - `/tools/extra_payment` - Extra payment calculator
  - `/tools/take_home_pay` - Take-home pay calculator
  - `/tools/mortgage_calculator` - Mortgage calculator
  - `/tools/home_affordability` - Home affordability calculator
  - `/tools/mortgage_calculator/allrates` - Rate comparison tool

### Global Layout & Navigation
- **Layout:** Main app wrapper with min-height and background styling
- **Navigation:** React Router with BrowserRouter
- **Consistent Structure:** Header, main content area, and responsive design

### Theming & Styling
- **Framework:** Material-UI + TailwindCSS
- **Theme Configuration:** Custom MUI theme in `src/theme.js`
- **Color Mode:** Context-based theme switching in `src/context/ColorModeContext.js`
- **Styling:** Utility-first CSS with Tailwind + MUI components

## Calculator Modules

### 1. Extra Payment Calculator
**Path:** `/src/pages/tools/extra_payment/`

**Folder Structure:**
```
/extra_payment/
├── index.jsx                    # Main component
├── /components/
│   ├── AmortizationTable.jsx    # Payment schedule table
│   ├── Layout.jsx               # Calculator layout
│   ├── PayoffChart.jsx          # Payoff visualization
│   ├── Sidebar.jsx              # Input sidebar
│   └── SummaryPanel.jsx         # Results summary
└── /utils/
    └── calculateLoanDetails.js  # Loan calculation logic
```

**Features:**
- Loan amount, APR, term, and extra payment inputs
- Amortization schedule generation
- Visual payoff chart using Recharts
- Export functionality (PDF/CSV)
- Payment frequency options (monthly, bi-weekly)

### 2. Take-Home Pay Calculator  
**Path:** `/src/pages/tools/take_home_pay/`

**Folder Structure:**
```
/take_home_pay/
├── index.jsx                    # Main component
├── index.html                   # Standalone HTML
├── package.json                 # Separate dependencies
├── eslint.config.js
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.*.json             # TypeScript configuration
├── vite.config.ts              # Vite config
├── /components/
│   ├── Accordion.jsx           # Collapsible sections
│   ├── InfoChip.jsx            # Information chips
│   ├── InputForm.jsx           # Input form
│   ├── Layout.jsx              # Calculator layout
│   ├── Sidebar.jsx             # Input sidebar
│   ├── TaxChart.jsx            # Tax breakdown chart
│   └── Tooltip.jsx             # Help tooltips
├── /utils/
│   ├── taxCalculations.js      # Tax calculation logic
│   └── taxData.js             # Tax rate data
└── README.md                   # Module documentation
```

**Features:**
- Federal, state, and FICA tax calculations
- Filing status options (single, married, etc.)
- Deduction and contribution inputs
- Tax bracket visualization
- Export capabilities
- **Note:** This module appears to be a standalone TypeScript project within the main application

### 3. Mortgage Calculator
**Path:** `/src/pages/tools/Mortgage_calculator/`

**Folder Structure:**
```
/Mortgage_calculator/
├── index.jsx                    # Main component
├── /allrates/
│   └── index.jsx               # Rate comparison tool
├── /components/
│   ├── Layout.jsx              # Calculator layout
│   ├── LenderPartners.jsx      # Lender information
│   ├── PaymentBreakdown.jsx    # Payment analysis
│   ├── RateCards.jsx           # Rate display cards
│   ├── Sidebar.jsx             # Input sidebar
│   └── Side (partial)          # Incomplete file
└── /utils/
    └── mortgageCalculations.js # Mortgage calculation logic
```

**Features:**
- Mortgage payment calculations
- Lender partner integration
- Payment breakdown analysis
- Rate comparison functionality
- Refinancing options

### 4. Home Affordability Calculator
**Path:** `/src/pages/tools/home_affordability/`

**Folder Structure:**
```
/home_affordability/
├── index.jsx                    # Main component
├── /components/
│   ├── BreakdownChart.jsx       # Income breakdown chart
│   ├── ComparisonChart.jsx      # Scenario comparison
│   ├── InputCard.jsx            # Input form card
│   ├── InputField.jsx           # Individual input fields
│   ├── ResultsCard.jsx          # Results display
│   └── StickySummary.jsx        # Persistent summary
└── /utils/
    ├── calculations.js          # Affordability calculations
    └── formatCurrency.js        # Currency formatting
```

**Features:**
- Income and expense analysis
- Debt-to-income ratio calculations
- Affordability scenario comparison
- Interactive charts and visualizations
- Export and sharing capabilities

### 5. All Rates Comparison
**Path:** `/src/pages/tools/Mortgage_calculator/allrates/`

**Folder Structure:**
```
/Mortgage_calculator/allrates/
└── index.jsx                    # Rate comparison component
```

**Features:**
- Real-time mortgage rate comparison
- Rate trend visualization
- Lender comparison tool
- Historical rate data

## Shared Components & Utilities

### Shared Components
- **CalculatorCard.jsx** - Reusable calculator display cards
- **FeaturedTools.jsx** - Homepage featured tools section
- **ArticlesGrid.jsx** - Content grid for blog/articles
- **Navbar.jsx** - Global navigation component
- **Footer.jsx** - Global footer component

### Shared Utilities
- **formatCurrency.js** - Consistent currency formatting across calculators
- **formatNumber.js** - Number formatting utilities
- **calculators_shared_files/all_rates/** - Rate comparison API and components

### Context Providers
- **ColorModeContext.js** - Theme management and dark/light mode toggle

## External Integrations

### Supabase Integration
- **Purpose:** Backend data storage and user management
- **Usage:** User preferences, calculator history, and data persistence
- **Package:** @supabase/supabase-js

### Backend Services (Express.js)
- **Purpose:** API endpoints and server-side processing
- **Features:** CORS handling, data processing, external API integration
- **Package:** express, cors, node-fetch

### Chart Libraries
- **Chart.js & react-chartjs-2** - Advanced charting capabilities
- **Recharts** - React-specific charting library
- **Purpose:** Data visualization for all calculators

### Document Generation
- **jsPDF** - PDF generation for reports and schedules
- **jsPDF-autotable** - Table generation in PDFs
- **Usage:** Export calculator results, amortization schedules, tax reports

## Build Configuration

### Vite Configuration
- **File:** `vite.config.js`
- **Features:** React plugin, development/production builds
- **Development:** `npm run dev` starts Vite dev server
- **Build:** `npm run build` creates production bundle

### TailwindCSS Configuration  
- **File:** `tailwind.config.js`
- **Features:** Custom theme, responsive design, utility classes
- **Integration:** Works alongside Material-UI components

### TypeScript Support
- Available in take_home_pay module with full tsconfig setup
- Type safety for complex tax calculations

## Deployment Configuration

### Azure Static Web Apps
- **File:** `staticwebapp.config.json` (if exists)
- **Configuration:** SPA routing, API proxy settings
- **Optimization:** Build optimization for static hosting

### Package Scripts
- **Development:** `npm run dev` - Vite dev server
- **Production Build:** `npm run build` - Optimized production build
- **Preview:** `npm run preview` - Preview production build locally

## Current Application State

### Calculator Coverage
✅ **Completed Calculators:**
- Extra Payment Calculator (fully implemented)
- Take-Home Pay Calculator (standalone TypeScript module)
- Mortgage Calculator (partially implemented - some files incomplete)
- Home Affordability Calculator (fully implemented)
- All Rates Comparison (basic implementation)

⚠️ **Known Issues:**
- Some component files appear incomplete (e.g., `Side` file in Mortgage_calculator)
- Take-home pay module uses different build system (separate package.json)
- Integration between main app and standalone modules needs clarification

### Integration Notes
- All calculators share common styling and theme
- Consistent navigation and layout patterns
- Mixed build systems (main app Vite + take_home_pay standalone)
- Shared utility functions for formatting and calculations

## Development Status

### Recent Updates
- Added Home Affordability Calculator
- Integrated Supabase for data persistence
- Enhanced chart libraries and visualization
- Added PDF export capabilities

### Pending Improvements
- Complete mortgage calculator implementation
- Standardize build system across all modules
- Add unit tests for calculation functions
- Implement user authentication and data saving
- Add more calculator tools (auto loans, retirement planning)

### Known Gaps / TODOs
- Complete implementation of incomplete mortgage calculator files
- Integrate take_home_pay module into main build system
- Add comprehensive error handling and input validation
- Implement loading states and user feedback
- Add keyboard navigation and accessibility features
- Optimize bundle size and lazy loading
- Add offline capabilities with service workers

## Future Expansion

### Planned Features
- **Additional Calculators:** Auto loans, retirement planning, investment returns
- **User Accounts:** Login/register, save calculations, history tracking
- **Advanced Analytics:** Trend analysis, forecasting, comparison tools
- **API Integration:** Real-time data feeds (rates, market data)
- **Mobile App:** React Native version for mobile users
- **International Support:** Multi-currency, tax system variations

### Technical Improvements
- **Testing:** Unit tests, integration tests, e2e testing
- **Performance:** Code splitting, lazy loading, caching strategies
- **Accessibility:** WCAG compliance, screen reader support
- **PWA Features:** Offline functionality, push notifications
- **Documentation:** API documentation, developer guides
