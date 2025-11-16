import React from 'react';
import TopBar from '../../../components/calculators_shared_files/topBar';
import { Helmet } from 'react-helmet-async';
import { trackEvent } from '../../../utils/analytics';
import { useCalculatorState, DEFAULTS, BLANKS } from './state/useCalculatorState';
import PropertyInfo from './inputs/PropertyInfo';
import LoanDetails from './inputs/LoanDetails';
import Income from './inputs/Income';
import Expenses from './inputs/Expenses';
import ResultsSummary from './results/ResultsSummary';
import { incomeCalcs, expenseCalcs } from './utils/calculations';
import Charts from './results/Charts';
import TuningPanel from './tuning/TuningPanel';
import ExportActions from './export/ExportActions';

export default function RentalPropertyCalculatorPage() {
  const { inputs, setProperty, setLoan, setIncome, setExpenses, analysis, roiSeries, reset } = useCalculatorState();
  const [uiOption, setUiOption] = React.useState(() => {
    try { return localStorage.getItem('rpc_ui_option') || 'A'; } catch { return 'A'; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('rpc_ui_option', uiOption); } catch {}
    if (uiOption === 'A') {
      // Default layout placeholder: ensures selecting A always keeps current configuration
    }
  }, [uiOption]);

  const canonical =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/rental-property-calculator`
      : 'https://www.finworld.live/tools/rental-property-calculator';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does this rental property calculator show?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The calculator estimates monthly cash flow, operating expenses, cap rate, and cash-on-cash return based on your purchase price, rent, financing, and ongoing costs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I customize expenses and vacancy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. You can enter detailed property taxes, insurance, maintenance, management, HOA, utilities, and vacancy assumptions or override the total operating expenses with a single number.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does this work for cash and financed deals?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can model an all-cash purchase or a financed purchase by adjusting the down payment, loan term, rate, and points. Monthly cash flow and returns update instantly.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Rental Property Calculator | FinWorld</title>
        <meta
          name="description"
          content="Analyze a rental property in minutes. Estimate cash flow, cap rate, and cash-on-cash returns with detailed income and expense assumptions."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Rental Property Calculator | FinWorld"
        />
        <meta
          property="og:description"
          content="Model rental income, operating expenses, and financing to see projected cash flow and ROI on your investment property."
        />
        <meta property="og:url" content={canonical} />
        <meta
          property="og:image"
          content="https://www.finworld.live/assets/finworld-preview.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Rental Property Calculator | FinWorld"
        />
        <meta
          name="twitter:description"
          content="Evaluate rental deals with cash flow and ROI metrics before you make an offer."
        />
        <meta
          name="twitter:image"
          content="https://www.finworld.live/assets/finworld-preview.png"
        />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      <TopBar />
      <header className="bg-transparent">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Analyze a Property with our Rental Property Calculator</h1>
          <p className="mt-2 text-slate-600">Evaluate cash flow, ROI, and cap rate instantly.</p>
          <div className="mt-3 flex justify-center">
            <span className="h-1 w-16 rounded-full bg-primary-500"></span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <div className="flex justify-end items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="ui-option" className="text-sm text-slate-600">UI Options</label>
            <select
              id="ui-option"
              value={uiOption}
              onChange={(e) => setUiOption(e.target.value)}
              className="text-sm rounded-full border border-slate-300 bg-white px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setProperty(DEFAULTS.property);
              setLoan(DEFAULTS.loan);
              setIncome(DEFAULTS.income);
              // compute standard total expenses from DEFAULTS and prefill overrideOperatingMonthly
              try {
                const inc = incomeCalcs({
                  monthlyRent: DEFAULTS.income.monthlyRent,
                  otherIncome: DEFAULTS.income.otherIncome,
                  vacancyRatePct: DEFAULTS.expenses.vacancyRatePct,
                  customIncome: DEFAULTS.income.custom,
                });
                const exp = expenseCalcs({
                  propertyTaxesAnnual: DEFAULTS.expenses.propertyTaxes,
                  insuranceAnnual: DEFAULTS.expenses.insurance,
                  maintenanceMonthly: DEFAULTS.expenses.maintenance,
                  capexMonthly: DEFAULTS.expenses.capex,
                  managementPct: DEFAULTS.expenses.managementPct,
                  hoaMonthly: DEFAULTS.expenses.hoa,
                  utilitiesMonthly: DEFAULTS.expenses.utilities,
                  garbageSewerMonthly: DEFAULTS.expenses.garbageSewer,
                  grossMonthlyIncome: inc.grossMonthlyIncome,
                  overrideOperatingMonthly: DEFAULTS.expenses.overrideOperatingMonthly,
                  customMonthly: 0,
                });
                const rounded = Math.round(exp.operatingMonthly);
                setExpenses({ ...DEFAULTS.expenses, overrideOperatingMonthly: rounded });
              } catch {
                setExpenses(DEFAULTS.expenses);
              }
              trackEvent('rental_prefill_clicked', { calculator: 'rental_property' });
            }}
            className="uppercase tracking-wide text-[11px] px-3 py-1.5 rounded-full transition-colors border bg-primary-500 text-white border-primary-500 hover:bg-primary-500/90 shadow"
          >
            Prefill Sample Values
          </button>
        </div>
        {uiOption === 'C' && (
          <ResultsSummary
            analysis={analysis}
            inputs={inputs}
            insightsTealHeader
            hideInsights
            onGlobalReset={() => {
              setProperty({ address: '', purchasePrice: 0, closingCosts: 0, closingIsDollar: false, allCash: false });
              setLoan({ downPaymentPct: 0, interestRatePct: 0, termYears: 0, points: 0 });
              setIncome({ monthlyRent: 0, otherIncome: 0, custom: [] });
              setExpenses({
                propertyTaxes: 0,
                insurance: 0,
                maintenance: 0,
                capex: 0,
                managementPct: 0,
                hoa: 0,
                utilities: 0,
                garbageSewer: 0,
                vacancyRatePct: 0,
                overrideOperatingMonthly: '',
                custom: [],
              });
            }}
          />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <PropertyInfo value={inputs.property} onChange={setProperty} />
          <LoanDetails value={inputs.loan} onChange={setLoan} onReset={() => setLoan(BLANKS.loan)} disabled={!!inputs.property.allCash} />
          {uiOption === 'B' ? (
            <>
              <div className="space-y-6">
                <Income value={inputs.income} onChange={setIncome} onReset={() => setIncome(BLANKS.income)} />
                <Expenses value={inputs.expenses} onChange={setExpenses} onReset={() => setExpenses(BLANKS.expenses)} />
              </div>
              <Charts show="cash" roiSeries={roiSeries} analysis={{
                income: {
                  effectiveMonthlyIncome: analysis.income.effectiveMonthlyIncome,
                  grossMonthlyIncome: analysis.income.grossMonthlyIncome,
                  vacancyMonthly: analysis.income.vacancyMonthly,
                },
                expenses: { operatingMonthly: analysis.expenses.operatingMonthly },
                monthlyPI: analysis.monthlyPI,
                monthlyCashFlow: analysis.monthlyCashFlow,
              }} />
            </>
          ) : (
            <>
              <Income value={inputs.income} onChange={setIncome} onReset={() => setIncome(BLANKS.income)} />
              <Expenses value={inputs.expenses} onChange={setExpenses} onReset={() => setExpenses(BLANKS.expenses)} />
            </>
          )}
        </div>

        {uiOption !== 'C' && (
          <ResultsSummary
            analysis={analysis}
            inputs={inputs}
            onGlobalReset={() => {
              setProperty({ address: '', purchasePrice: 0, closingCosts: 0, closingIsDollar: false, allCash: false });
              setLoan({ downPaymentPct: 0, interestRatePct: 0, termYears: 0, points: 0 });
              setIncome({ monthlyRent: 0, otherIncome: 0, custom: [] });
              setExpenses({
                propertyTaxes: 0,
                insurance: 0,
                maintenance: 0,
                capex: 0,
                managementPct: 0,
                hoa: 0,
                utilities: 0,
                garbageSewer: 0,
                vacancyRatePct: 0,
                overrideOperatingMonthly: '',
                custom: [],
              });
            }}
          />
        )}

        

        <Charts show={uiOption === 'B' ? 'roi' : 'both'} roiSeries={roiSeries} analysis={{
          income: {
            effectiveMonthlyIncome: analysis.income.effectiveMonthlyIncome,
            grossMonthlyIncome: analysis.income.grossMonthlyIncome,
            vacancyMonthly: analysis.income.vacancyMonthly,
          },
          expenses: { operatingMonthly: analysis.expenses.operatingMonthly },
          monthlyPI: analysis.monthlyPI,
          monthlyCashFlow: analysis.monthlyCashFlow,
        }} />

        {uiOption === 'C' && (
          <ResultsSummary onlyInsights analysis={analysis} inputs={inputs} />
        )}

        <TuningPanel inputs={inputs} setIncome={setIncome} setExpenses={setExpenses} setLoan={setLoan} reset={reset} />

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-semibold text-slate-900">
            How to use this rental property calculator
          </h2>
          <p className="text-sm text-slate-600">
            Enter your purchase price, closing costs, and loan details, then add rent, vacancy, and operating expenses. The analysis and charts update as you tweak assumptions so you can see whether a deal meets your cash flow and return targets.
          </p>
          <p className="text-sm text-slate-600">
            Use the tuning panel to run quick sensitivities on rent, expenses, or interest rates so you understand the range of outcomes before you make an offer.
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mt-4">
            Related tools
          </h3>
          <p className="text-sm text-slate-600">
            Planning a real estate portfolio? Explore the{" "}
            <a href="/tools/mortgage-calculator" className="underline">
              Mortgage Calculator
            </a>
            ,{" "}
            <a href="/tools/home-affordability" className="underline">
              Home Affordability Calculator
            </a>
            , and{" "}
            <a href="/tools/compounding-calculator" className="underline">
              Compounding Calculator
            </a>{" "}
            to project long-term wealth from your investments.
          </p>
        </section>

        <div className="flex justify-between items-center">
          <div className="text-slate-500 text-sm">FinWorld Edition • Teal theme • Local-only</div>
          <ExportActions inputs={inputs} analysis={analysis} />
        </div>
      </main>
    </div>
  );
}
