import React from 'react';
import Card from '../components/Card';

function Slider({ label, min, max, step, value, onChange, suffix = '' }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm text-slate-600">{label}</label>
        <span className="text-sm font-medium text-slate-900">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full" />
    </div>
  );
}

export default function TuningPanel({ inputs, setIncome, setExpenses, setLoan, reset }) {
  return (
    <Card title="Fine-Tuning">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Slider label="Rent" min={500} max={10000} step={25} value={inputs.income.monthlyRent}
          onChange={(v) => setIncome({ ...inputs.income, monthlyRent: v })} />
        <Slider label="Vacancy Rate" min={0} max={20} step={0.5} value={inputs.expenses.vacancyRatePct}
          onChange={(v) => setExpenses({ ...inputs.expenses, vacancyRatePct: v })} suffix="%" />
        <Slider label="Interest Rate" min={0} max={15} step={0.125} value={inputs.loan.interestRatePct}
          onChange={(v) => setLoan({ ...inputs.loan, interestRatePct: v })} suffix="%" />
        <Slider label="Total Expenses" min={0} max={10000} step={25} value={Number(inputs.expenses.overrideOperatingMonthly || 0)}
          onChange={(v) => setExpenses({ ...inputs.expenses, overrideOperatingMonthly: v })} />
      </div>
      {/* Note: No global reset here to ensure per-box resets act independently */}
    </Card>
  );
}
