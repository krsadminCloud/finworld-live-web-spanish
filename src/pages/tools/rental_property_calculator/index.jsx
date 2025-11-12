import React from 'react';
import TopBar from '../../../components/calculators_shared_files/topBar';
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

  return (
    <div className="min-h-screen bg-slate-50">
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

        <div className="flex justify-between items-center">
          <div className="text-slate-500 text-sm">FinWorld Edition • Teal theme • Local-only</div>
          <ExportActions inputs={inputs} analysis={analysis} />
        </div>
      </main>
    </div>
  );
}
