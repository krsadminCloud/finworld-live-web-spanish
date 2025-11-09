import React from 'react';
import Card from '../components/Card';
import TooltipInfo from '../components/TooltipInfo';

export default function LoanDetails({ value, onChange, onReset }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          Loan Details <TooltipInfo text="Down payment, interest rate, term length, and optional points." />
        </span>
      }
      right={onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center rounded-md bg-primary-700 px-4 py-2 text-white hover:bg-primary-700/90"
        >
          Reset
        </button>
      ) : null}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-slate-600">Down Payment (%)</label>
          <input inputMode="decimal" className="mt-1 w-full rounded-md border border-slate-300 p-2 text-right" placeholder="20" value={value.downPaymentPct}
            onChange={(e) => set('downPaymentPct', Number(e.target.value) || 0)} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Interest Rate (%)</label>
          <input inputMode="decimal" className="mt-1 w-full rounded-md border border-slate-300 p-2 text-right" placeholder="6.5" value={value.interestRatePct}
            onChange={(e) => set('interestRatePct', Number(e.target.value) || 0)} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Loan Term (Years)</label>
          <input inputMode="numeric" className="mt-1 w-full rounded-md border border-slate-300 p-2 text-right" placeholder="30" value={value.termYears}
            onChange={(e) => set('termYears', Number(e.target.value) || 0)} />
        </div>
        <div>
          <label className="text-sm text-slate-600">
            <span>Points</span>
            <span className="block text-xs text-slate-500">(%)</span>
          </label>
          <input inputMode="decimal" className="mt-1 w-full rounded-md border border-slate-300 p-2 text-right" placeholder="0" value={value.points}
            onChange={(e) => set('points', Number(e.target.value) || 0)} />
        </div>
      </div>
    </Card>
  );
}
