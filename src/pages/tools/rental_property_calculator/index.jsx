import React from 'react';
import { useCalculatorState, DEFAULTS, BLANKS } from './state/useCalculatorState';
import PropertyInfo from './inputs/PropertyInfo';
import LoanDetails from './inputs/LoanDetails';
import Income from './inputs/Income';
import Expenses from './inputs/Expenses';
import ResultsSummary from './results/ResultsSummary';
import Charts from './results/Charts';
import TuningPanel from './tuning/TuningPanel';
import ExportActions from './export/ExportActions';

export default function RentalPropertyCalculatorPage() {
  const { inputs, setProperty, setLoan, setIncome, setExpenses, analysis, roiSeries, reset } = useCalculatorState();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold">Analyze a Property with our Rental Property Calculator</h1>
          <p className="mt-1 text-white/90">Evaluate cash flow, ROI, and cap rate instantly.</p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => { setProperty(DEFAULTS.property); setLoan(DEFAULTS.loan); setIncome(DEFAULTS.income); setExpenses(DEFAULTS.expenses); }}
            className="uppercase tracking-wide text-[11px] px-3 py-1.5 rounded-full transition-colors border bg-teal-600 text-white border-teal-600 hover:bg-teal-700 shadow"
          >
            Prefill Sample Values
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <PropertyInfo value={inputs.property} onChange={setProperty} />
          <LoanDetails value={inputs.loan} onChange={setLoan} onReset={() => setLoan(BLANKS.loan)} />
          <Income value={inputs.income} onChange={setIncome} onReset={() => setIncome(BLANKS.income)} />
          <Expenses value={inputs.expenses} onChange={setExpenses} onReset={() => setExpenses(BLANKS.expenses)} />
        </div>

        <ResultsSummary analysis={analysis} />

        <Charts roiSeries={roiSeries} analysis={{
          income: { effectiveMonthlyIncome: analysis.income.effectiveMonthlyIncome },
          expenses: { operatingMonthly: analysis.expenses.operatingMonthly },
          monthlyPI: analysis.monthlyPI,
          monthlyCashFlow: analysis.monthlyCashFlow,
        }} />

        <TuningPanel inputs={inputs} setIncome={setIncome} setExpenses={setExpenses} setLoan={setLoan} reset={reset} />

        <div className="flex justify-between items-center">
          <div className="text-slate-500 text-sm">FinWorld Edition • Teal theme • Local-only</div>
          <ExportActions inputs={inputs} analysis={analysis} />
        </div>
      </main>
    </div>
  );
}
