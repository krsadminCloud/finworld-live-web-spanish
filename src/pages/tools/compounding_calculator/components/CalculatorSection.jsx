import React from 'react';
import { motion } from 'framer-motion';
import { calculateAll } from '../utils/calc';
import formatCurrency from '../../../../utils/formatCurrency';

const inputCls = 'w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white';
const labelCls = 'block text-sm font-medium text-neutral-700 mb-1';

export default function CalculatorSection({ inputs, onChange, onReset, results, granularity, setGranularity }) {
  if (!results) return null;
  const { outputs } = results;

  // Insights calculations
  const baselineRate = 0.03; // 3% typical savings baseline
  const tenYearCurrent = calculateAll({
    ...results.inputs,
    years: 10,
    months: 0,
  });
  const tenYearBaseline = (() => {
    const i = results.inputs;
    // override by providing annual rate unit baseline
    return calculateAll({
      initialInvestment: i.initialInvestment,
      ratePercent: baselineRate * 100,
      rateUnit: 'annual',
      compoundingFrequency: i.compoundingFrequency,
      years: 10,
      months: 0,
      contribution: i.contribution,
      contributionFrequency: i.contributionFrequency,
      timing: i.timing,
      chartGranularity: 'yearly',
    });
  })();

  const tenYearAdvantage = tenYearCurrent.outputs.futureValue - tenYearBaseline.outputs.futureValue;
  const performanceFactor = outputs.effectiveAnnualYield > 0 ? (outputs.effectiveAnnualYield / baselineRate) : 1;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-gray-100 rounded-lg boxShadow-md p-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Investment Parameters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Initial Investment ($)</label>
            <input type="number" className={inputCls} value={inputs.initialInvestment}
              onChange={(e)=>onChange('initialInvestment', e.target.value === '' ? '' : Number(e.target.value))} min="0" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Interest Rate (%)</label>
              <input type="number" className={inputCls} step="0.01" value={inputs.ratePercent}
                onChange={(e)=>onChange('ratePercent', e.target.value === '' ? '' : Number(e.target.value))} min="0" />
            </div>
            <div>
              <label className={labelCls}>Unit</label>
              <select className={inputCls} value={inputs.rateUnit} onChange={(e)=>onChange('rateUnit', e.target.value)}>
                <option value="annual">Annual</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Compounding Frequency</label>
            <select className={inputCls} value={inputs.compoundingFrequency} onChange={(e)=>onChange('compoundingFrequency', e.target.value)}>
              <option value="yearly">Yearly (1/yr)</option>
              <option value="semiannual">Semi-Annual (2/yr)</option>
              <option value="quarterly">Quarterly (4/yr)</option>
              <option value="monthly">Monthly (12/yr)</option>
              <option value="weekly">Weekly (52/yr)</option>
              <option value="daily">Daily (365/yr)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Years</label>
              <input type="number" className={inputCls} value={inputs.years}
                onChange={(e)=>onChange('years', e.target.value === '' ? '' : Number(e.target.value))} min="0" />
            </div>
            <div>
              <label className={labelCls}>Months</label>
              <input type="number" className={inputCls} value={inputs.months}
                onChange={(e)=>onChange('months', e.target.value === '' ? '' : Number(e.target.value))} min="0" max="11" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Regular Contribution ($)</label>
            <input type="number" className={inputCls} value={inputs.contribution}
              onChange={(e)=>onChange('contribution', e.target.value === '' ? '' : Number(e.target.value))} min="0" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Frequency</label>
              <select className={inputCls} value={inputs.contributionFrequency}
                onChange={(e)=>onChange('contributionFrequency', e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="semiannual">Semi-Annual</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Timing</label>
              <select className={inputCls} value={inputs.timing} onChange={(e)=>onChange('timing', e.target.value)}>
                <option value="end">End of Period</option>
                <option value="begin">Beginning (Annuity Due)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={onReset} className="px-4 py-2 bg-teal-500 text-white rounded-md">Reset</button>
        </div>
      </div>

      {/* Analytics & Insights with badges */}
      <div className="bg-bg-surface rounded-lg boxShadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Analytics & Insights</h3>
          <div className="flex gap-2 text-sm">
            <button onClick={() => setGranularity('yearly')} className={`px-3 py-1 rounded-md ${granularity==='yearly'?'bg-neutral-900 text-white':'bg-neutral-100'}`}>Yearly</button>
            <button onClick={() => setGranularity('monthly')} className={`px-3 py-1 rounded-md ${granularity==='monthly'?'bg-neutral-900 text-white':'bg-neutral-100'}`}>Monthly</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <InsightCard title="Performance vs Savings" desc={`Beats a typical 3% savings by about ${performanceFactor.toFixed(1)}× at your current settings.`} color="border-sky-200 bg-sky-50" />
          <InsightCard title="10-Year Advantage" desc={`In 10 years, you’d have ${formatCurrency(tenYearAdvantage)} more than a 3% baseline.`} color="border-amber-200 bg-amber-50" />
          <InsightCard title="Smart Summary" desc={`At ${(results.inputs.ratePercent).toFixed(2)}% ${results.inputs.rateUnit} with ${results.inputs.compoundingFrequency} compounding, ${formatCurrency(outputs.initialInvestment)} grows to ${formatCurrency(tenYearCurrent.outputs.futureValue)} in 10 years${results.inputs.contribution>0 ? ' with contributions' : ''}.`} color="border-fuchsia-200 bg-fuchsia-50" />
        </div>

        <div className="text-neutral-500 text-sm">Contributions are treated as {results.inputs.timing==='begin'?'beginning-of-period (annuity due)':'end-of-period (ordinary annuity)'}.</div>
      </div>
    </motion.div>
  );
}

function InsightCard({ title, desc, color }) {
  return (
    <div className={`p-4 rounded-md border ${color}`}>
      <div className="text-sm font-semibold text-neutral-900 mb-1">{title}</div>
      <div className="text-sm text-neutral-700">{desc}</div>
    </div>
  );
}
