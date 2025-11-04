import React, { useState } from 'react';

const NumberInput = ({ value, onChange, step = 50, min = 0, ...rest }) => (
  <input
    type="number"
    min={min}
    step={step}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full h-12 px-4 rounded-md border border-neutral-200 dark:border-dark-border-subtle bg-white dark:bg-dark-bg-surface text-neutral-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
    {...rest}
  />
);

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
  const Field = ({ label, name, step = 1, min = 0 }) => (
    <div>
      <label className="block text-sm text-neutral-500 mb-2">{label}</label>
      <NumberInput
        value={inputs[name]}
        onChange={(v) => onChange(name, Number(v))}
        step={step}
        min={min}
      />
    </div>
  );

  return (
    <div className="bg-bg-surface rounded-lg shadow-md p-6 card-hover">
      <h2 className="text-xl font-semibold mb-4">Inputs</h2>
      <div className="space-y-6">
        <Field label="Current Age:" name="currentAge" step={1} min={0} />
        <Field label="Retirement Age:" name="retirementAge" step={1} min={0} />
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
        <Field label="Monthly Contribution ($):" name="monthlyContribution" step={50} min={0} />
        <Field label="Annual Return (%):" name="annualReturn" step={0.1} min={0} />
        <Field label="Inflation Rate (%):" name="inflationRate" step={0.1} min={0} />
        <Field label="Withdrawal Rate (%):" name="withdrawalRate" step={0.1} min={0} />

        <div className="pt-2">
          <button onClick={handleReset} className="text-sm text-neutral-500 hover:text-neutral-900 underline">
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}
