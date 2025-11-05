import React, { useState } from 'react';

export default function InputPanel({ inputs, onChange, onReset }) {
  const [savingsText, setSavingsText] = useState('');

  const handleSavingsChange = (text) => {
    // Keep only digits
    const digits = (text || '').replace(/[^0-9]/g, '');
    // Format with commas and $ prefix when digits exist
    const formatted = digits ? `$${Number(digits).toLocaleString('en-US')}` : '';
    setSavingsText(formatted);

    // Send numeric value up (0 when empty)
    const numeric = digits ? Number(digits) : 0;
    onChange('currentSavings', numeric);
  };

  const handleReset = () => {
    setSavingsText('');
    onReset?.();
  };
  const baseInputClass = "w-full h-12 px-4 rounded-md border border-neutral-200 dark:border-dark-border-subtle bg-white dark:bg-dark-bg-surface text-neutral-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500";

  return (
    <div className="bg-bg-surface rounded-lg shadow-md p-6 card-hover">
      <h2 className="text-xl font-semibold mb-4">Inputs</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-neutral-500 mb-2">Current Age:</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={String(inputs.currentAge ?? '')}
            onChange={(e) => onChange('currentAge', parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10) || 0)}
            className={baseInputClass}
            aria-label="Current Age"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-500 mb-2">Retirement Age:</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={String(inputs.retirementAge ?? '')}
            onChange={(e) => onChange('retirementAge', parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10) || 0)}
            className={baseInputClass}
            aria-label="Retirement Age"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-500 mb-2">Current Savings ($):</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="$0"
            value={savingsText}
            onChange={(e) => handleSavingsChange(e.target.value)}
            className="w-full h-12 px-4 rounded-md border border-neutral-200 dark:border-dark-border-subtle bg-white dark:bg-dark-bg-surface text-neutral-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            aria-label="Current Savings"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-500 mb-2">Monthly Contribution ($):</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={String(inputs.monthlyContribution ?? '')}
            onChange={(e) => onChange('monthlyContribution', parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10) || 0)}
            className={baseInputClass}
            aria-label="Monthly Contribution"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-500 mb-2">Annual Return (%):</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={String(inputs.annualReturn ?? '')}
            onChange={(e) => onChange('annualReturn', parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)}
            className="w-full h-12 px-4 rounded-md border border-neutral-200 dark:border-dark-border-subtle bg-white dark:bg-dark-bg-surface text-neutral-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            aria-label="Annual Return"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-500 mb-2">Inflation Rate (%):</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={String(inputs.inflationRate ?? '')}
            onChange={(e) => onChange('inflationRate', parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)}
            className="w-full h-12 px-4 rounded-md border border-neutral-200 dark:border-dark-border-subtle bg-white dark:bg-dark-bg-surface text-neutral-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            aria-label="Inflation Rate"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-500 mb-2">Withdrawal Rate (%):</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={String(inputs.withdrawalRate ?? '')}
            onChange={(e) => onChange('withdrawalRate', parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)}
            className="w-full h-12 px-4 rounded-md border border-neutral-200 dark:border-dark-border-subtle bg-white dark:bg-dark-bg-surface text-neutral-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            aria-label="Withdrawal Rate"
          />
        </div>

        <div className="pt-2">
          <button onClick={handleReset} className="text-sm text-neutral-500 hover:text-neutral-900 underline">
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}
