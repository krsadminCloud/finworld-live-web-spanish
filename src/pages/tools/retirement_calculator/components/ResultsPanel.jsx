import React from 'react';

export default function ResultsPanel({ yearsToRetirement, finalBalanceNominal, finalBalanceReal, annualWithdrawal, monthlyWithdrawal, formatCurrency }) {
  return (
    <div className="bg-bg-surface rounded-lg shadow-md p-6 card-hover">
      <h2 className="text-xl font-semibold mb-2">Results</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-primary-500 text-white shadow-md">
          <p className="text-sm font-semibold text-white/90">Years to Retirement</p>
          <p className="text-2xl font-extrabold">{yearsToRetirement}</p>
        </div>
        <div className="p-4 rounded-lg bg-primary-500 text-white shadow-md">
          <p className="text-sm font-semibold text-white/90">Projected Balance (Nominal)</p>
          <p className="text-2xl font-extrabold">{formatCurrency(finalBalanceNominal)}</p>
        </div>
        <div className="p-4 rounded-lg bg-primary-500 text-white shadow-md">
          <p className="text-sm font-semibold text-white/90">Projected Balance (Real)</p>
          <p className="text-2xl font-extrabold">{formatCurrency(finalBalanceReal)}</p>
        </div>
        <div className="p-4 rounded-lg bg-primary-500 text-white shadow-md">
          <p className="text-sm font-semibold text-white/90">Safe Withdrawal (Annual)</p>
          <p className="text-2xl font-extrabold">{formatCurrency(annualWithdrawal)}</p>
        </div>
        <div className="p-4 rounded-lg bg-teal-100 border border-teal-500/20 text-neutral-900 shadow-md">
          <p className="text-sm font-semibold text-neutral-700">Safe Withdrawal (Monthly)</p>
          <p className="text-2xl font-extrabold text-semantic-success">{formatCurrency(monthlyWithdrawal)}</p>
        </div>
      </div>
    </div>
  );
}
