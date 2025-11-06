import React, { useEffect, useMemo, useState } from 'react';
import Topbar from '../../../components/calculators_shared_files/topBar';
import { STATES_LIST } from './utils/taxData';
import { calcFederalTax, calcStateTax, calcFicaTax, formatCurrency } from './utils/taxCalculations';
import { TaxChart } from './components/TaxChart';

export default function TakeHomePayCalculator() {
  const [inputs, setInputs] = useState({
    income: '',
    spouseIncome: '',
    year: 2025,
    state: '',
    status: 'single',
    k401Percent: '',
    spouseK401Percent: '',
    rothAmount: '',
    spouseRothAmount: '',
    healthInsurance: '',
    hsa: '',
    traditionalIra: '',
    studentLoanInterest: '',
    fsaContribution: '',
    otherPreTaxDeductions: '',
    childTaxCredit: '',
    dependentCareCredit: '',
    localTaxRate: '',
    overrideStateRate: undefined,
  });

  const [compareStates, setCompareStates] = useState(['', '']);
  const [bonusAmount, setBonusAmount] = useState('');
  const [offer1Income, setOffer1Income] = useState('');
  const [offer2Income, setOffer2Income] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const result = useMemo(() => {
    const totalIncome = (Number(inputs.income) || 0) + (Number(inputs.spouseIncome) || 0);
    if (!totalIncome) return null;

    const k401_1 = Math.max(0, (Number(inputs.income) || 0) * ((Number(inputs.k401Percent) || 0) / 100));
    const k401_2 = Math.max(0, (Number(inputs.spouseIncome) || 0) * ((Number(inputs.spouseK401Percent) || 0) / 100));
    const k401Total = k401_1 + k401_2;

    const preTaxDeductions =
      k401Total +
      (Number(inputs.healthInsurance) || 0) +
      (Number(inputs.hsa) || 0) +
      (Number(inputs.traditionalIra) || 0) +
      (Number(inputs.studentLoanInterest) || 0) +
      (Number(inputs.fsaContribution) || 0) +
      (Number(inputs.otherPreTaxDeductions) || 0);

    const adjustedIncome = Math.max(0, totalIncome - preTaxDeductions);
    const rothTotal = (Number(inputs.rothAmount) || 0) + (Number(inputs.spouseRothAmount) || 0);

    const fedResult = calcFederalTax(inputs.year, adjustedIncome, inputs.status);
    const federalTax = Math.max(0, fedResult.tax - (Number(inputs.childTaxCredit) || 0) - (Number(inputs.dependentCareCredit) || 0));

    let stateTax, stateInfo, stateMarginalRate;
    if (inputs.overrideStateRate !== undefined && inputs.overrideStateRate !== null && inputs.overrideStateRate !== '') {
      const rate = Number(inputs.overrideStateRate) / 100;
      stateTax = adjustedIncome * rate;
      stateInfo = `Override ${Number(inputs.overrideStateRate).toFixed(2)}%`;
      stateMarginalRate = rate;
    } else {
      const sres = calcStateTax(adjustedIncome, inputs.state);
      stateTax = sres.tax;
      stateInfo = sres.info;
      stateMarginalRate = sres.marginalRate;
    }

    const ficaTax = calcFicaTax(inputs.year, totalIncome, inputs.status);
    const localTax = adjustedIncome * ((Number(inputs.localTaxRate) || 0) / 100);
    const totalTax = federalTax + stateTax + ficaTax + localTax;
    const netPay = totalIncome - totalTax - preTaxDeductions;
    const finalNet = Math.max(0, netPay - rothTotal);

    return {
      grossIncome: totalIncome,
      preTaxDeductions,
      adjustedIncome,
      federalTax,
      stateTax,
      ficaTax,
      localTax,
      totalTax,
      netPay,
      finalNet,
      rothContributions: rothTotal,
      federalTaxable: fedResult.taxable,
      federalMarginalRate: fedResult.marginalRate,
      federalStdDeduction: fedResult.std,
      stateMarginalRate,
      stateInfo,
      k401Total,
      netMonthly: netPay / 12,
      netBiweekly: netPay / 26,
      netWeekly: netPay / 52,
      finalNetMonthly: finalNet / 12,
      finalNetBiweekly: finalNet / 26,
      finalNetWeekly: finalNet / 52,
    };
  }, [inputs]);

  const handleReset = () => {
    setInputs({
      income: '',
      spouseIncome: '',
      year: 2025,
      state: '',
      status: 'single',
      k401Percent: '',
      spouseK401Percent: '',
      rothAmount: '',
      spouseRothAmount: '',
      healthInsurance: '',
      hsa: '',
      traditionalIra: '',
      studentLoanInterest: '',
      fsaContribution: '',
      otherPreTaxDeductions: '',
      childTaxCredit: '',
      dependentCareCredit: '',
      localTaxRate: '',
      overrideStateRate: undefined,
    });
    setCompareStates(['', '']);
    setBonusAmount('');
    setOffer1Income('');
    setOffer2Income('');
  };

  const comparisonResults = useMemo(() => {
    if (!result) return [];
    return compareStates
      .filter(Boolean)
      .map((code) => {
        const stRes = (inputs.overrideStateRate !== undefined && inputs.overrideStateRate !== null && inputs.overrideStateRate !== '')
          ? { tax: result.adjustedIncome * (Number(inputs.overrideStateRate) / 100), info: `Override ${Number(inputs.overrideStateRate).toFixed(2)}%` }
          : calcStateTax(result.adjustedIncome, code);
        const netS = result.grossIncome - result.federalTax - stRes.tax - result.ficaTax - result.localTax - result.k401Total;
        const finalS = Math.max(0, netS - result.rothContributions);
        return { code, stateTax: stRes.tax, netAnnual: netS, finalAnnual: finalS, monthly: finalS/12, biweekly: finalS/26, weekly: finalS/52, info: stRes.info };
      });
  }, [compareStates, inputs.overrideStateRate, result]);

  const bonusSummary = useMemo(() => {
    if (!result || !bonusAmount) return '';
    const totalIncomeWithBonus = result.grossIncome + Number(bonusAmount || 0);
    const adjIncomeWithBonus = Math.max(0, totalIncomeWithBonus - result.preTaxDeductions);
    const fedResultWithBonus = calcFederalTax(inputs.year, adjIncomeWithBonus, inputs.status);
    const fedTaxWithBonus = Math.max(0, fedResultWithBonus.tax - (Number(inputs.childTaxCredit)||0) - (Number(inputs.dependentCareCredit)||0));
    const stateTaxWithBonus = (inputs.overrideStateRate !== undefined && inputs.overrideStateRate !== null && inputs.overrideStateRate !== '')
      ? adjIncomeWithBonus * (Number(inputs.overrideStateRate)/100)
      : calcStateTax(adjIncomeWithBonus, inputs.state).tax;
    const ficaTaxWithBonus = calcFicaTax(inputs.year, totalIncomeWithBonus, inputs.status);
    const localTaxWithBonus = adjIncomeWithBonus * ((Number(inputs.localTaxRate)||0)/100);
    const totalTaxWithBonus = fedTaxWithBonus + stateTaxWithBonus + ficaTaxWithBonus + localTaxWithBonus;
    const netWithBonus = totalIncomeWithBonus - totalTaxWithBonus - result.preTaxDeductions;
    const finalNetWithBonus = Math.max(0, netWithBonus - result.rothContributions);
    const bonusTakeHome = finalNetWithBonus - result.finalNet;
    return `Original Annual Net: ${formatCurrency(result.finalNet)} | New Annual Net (with bonus): ${formatCurrency(finalNetWithBonus)} | Bonus Take-Home: ${formatCurrency(bonusTakeHome)}`;
  }, [result, bonusAmount, inputs]);

  const offerComparison = useMemo(() => {
    if (!result || !offer1Income || !offer2Income) return '';
    const calcNet = (offerIncome) => {
      const offerAdj = Math.max(0, Number(offerIncome||0) - result.preTaxDeductions);
      const fr = calcFederalTax(inputs.year, offerAdj, inputs.status);
      const ft = Math.max(0, fr.tax - (Number(inputs.childTaxCredit)||0) - (Number(inputs.dependentCareCredit)||0));
      const st = (inputs.overrideStateRate !== undefined && inputs.overrideStateRate !== null && inputs.overrideStateRate !== '')
        ? offerAdj * (Number(inputs.overrideStateRate)/100)
        : calcStateTax(offerAdj, inputs.state).tax;
      const fica = calcFicaTax(inputs.year, Number(offerIncome||0), inputs.status);
      const lt = offerAdj * ((Number(inputs.localTaxRate)||0)/100);
      const tot = ft + st + fica + lt;
      const net = Number(offerIncome||0) - tot - result.preTaxDeductions;
      return Math.max(0, net - result.rothContributions);
    };
    const n1 = calcNet(offer1Income);
    const n2 = calcNet(offer2Income);
    return `Offer 1: ${formatCurrency(Number(offer1Income||0))} â†’ ${formatCurrency(n1)} net (${formatCurrency(n1/12)}/mo) | ` +
           `Offer 2: ${formatCurrency(Number(offer2Income||0))} â†’ ${formatCurrency(n2)} net (${formatCurrency(n2/12)}/mo)`;
  }, [result, offer1Income, offer2Income, inputs]);

  return (
    <div className="min-h-screen bg-bg-page text-neutral-900">
      <Topbar />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-neutral-900">U.S. Take-Home Pay Calculator</h1>
            <p className="text-neutral-600 mt-1 max-w-2xl">Compare your gross income against taxes and deductions to estimate take-home pay.</p>
          </div>
          <button onClick={handleReset} className="inline-flex items-center rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-sm font-semibold px-3 py-2">Reset</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Inputs */}
          <section className="lg:col-span-1 bg-bg-surface shadow-card rounded-lg p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Your Gross Annual Income</label>
                <input type="number" min="0" step="100" value={inputs.income}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,income: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder="e.g. 90000" />
              </div>
              
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Spouse's Gross Annual Income</label>
                <input type="number" min="0" step="100" value={inputs.spouseIncome}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,spouseIncome: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder="e.g. 75000" />
              </div>
              
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Tax Year</label>
                <select value={inputs.year} onChange={(e)=>setInputs(v=>({...v,year:Number(e.target.value)}))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus">
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Filing Status</label>
                <select value={inputs.status} onChange={(e)=>setInputs(v=>({...v,status:e.target.value}))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus">
                  <option value="single">Single</option>
                  <option value="mfj">Married Filing Jointly</option>
                  <option value="mfs">Married Filing Separately</option>
                  <option value="hoh">Head of Household</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">State</label>
                <select value={inputs.state} onChange={(e)=>setInputs(v=>({...v,state:e.target.value}))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus">
                  <option value="">Select state</option>
                  {STATES_LIST.map((s)=> (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Override State Effective Rate (%) <span className="text-neutral-400">(optional)</span></label>
                <input type="number" min="0" step="0.01" value={inputs.overrideStateRate ?? ''}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,overrideStateRate: val})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder="Overrides State Calculated Rate" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">Local Tax Rate (%)</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-local" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-local" role="tooltip" className="tooltip-bubble">
                      Enter your local income tax rate (percent).
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="0.01" value={inputs.localTaxRate}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,localTaxRate: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder="e.g. 1.5" />
                </div>
              <div>
                {/* Your 401(k) first */}
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">Your 401(k) Contributions</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-k401" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-k401" role="tooltip" className="tooltip-bubble">
                      Enter the percent of income you contribute pre-tax to a 401(k).
                    </div>
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={inputs.k401Percent}
                    onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,k401Percent: val === '' ? '' : Number(val)})); }}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus"
                    placeholder="Percent of income"
                    data-has-value={inputs.k401Percent ? 'true' : 'false'}
                  />
                </div>

                {/* Spouse 401(k) second */}
                <div className="flex items-center gap-2 mb-1 mt-4">
                  <label className="block text-sm font-medium text-neutral-700">Spouse's 401(k) Contributions</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-k401-spouse" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-k401-spouse" role="tooltip" className="tooltip-bubble">
                      Enter the percent of your spouse's income contributed pre-tax to a 401(k).
                    </div>
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={inputs.spouseK401Percent}
                    onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,spouseK401Percent: val === '' ? '' : Number(val)})); }}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus"
                    placeholder="Percent of income"
                    data-has-value={inputs.spouseK401Percent ? 'true' : 'false'}
                  />
                </div>
              </div>
              {/* Advanced options toggle */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                  {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                </button>
              </div>
              
              {showAdvanced && (
              <div className="mt-4 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="block text-sm font-medium text-neutral-700">Your Roth IRA (Post-tax)</label>
                    <span className="tooltip">
                      <button type="button" aria-describedby="tip-roth" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                        <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div id="tip-roth" role="tooltip" className="tooltip-bubble">
                        Enter your annual post-tax Roth IRA contributions (amount).
                      </div>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={inputs.rothAmount}
                      onChange={(e)=>{
                        const val = e.target.value; setInputs(v=>({...v,rothAmount: val === '' ? '' : Number(val)}));
                      }}
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus"
                      placeholder="e.g. 3000"
                    />
                  </div>
                </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">Spouse's Roth IRA (Post-tax)</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-roth-spouse" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-roth-spouse" role="tooltip" className="tooltip-bubble">
                      Enter your spouse's annual post-tax Roth IRA contributions (amount).
                    </div>
                  </span>
                </div>
                <div className="relative">
                <input type="number" min="0" step="100" value={inputs.spouseRothAmount}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,spouseRothAmount: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder="e.g. 3000" />
                  
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">Health Insurance</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-health" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-health" role="tooltip" className="tooltip-bubble">
                      Enter your annual pre-tax health insurance premiums (amount).
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.healthInsurance}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,healthInsurance: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">HSA</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-hsa" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-hsa" role="tooltip" className="tooltip-bubble">
                      Enter annual pre-tax HSA contributions (amount).
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.hsa}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,hsa: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">Traditional IRA</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-tira" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-tira" role="tooltip" className="tooltip-bubble">
                      Enter annual pre-tax Traditional IRA contributions (amount).
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.traditionalIra}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,traditionalIra: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">Student Loan Interest</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-sli" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-sli" role="tooltip" className="tooltip-bubble">
                      Enter annual student loan interest eligible for adjustment (amount).
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.studentLoanInterest}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,studentLoanInterest: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">FSA Contribution</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-fsa" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-fsa" role="tooltip" className="tooltip-bubble">
                      Enter your annual pre-tax FSA contributions (amount).
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.fsaContribution}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,fsaContribution: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">Other Pre-Tax Deductions</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-other" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-other" role="tooltip" className="tooltip-bubble">
                      Enter other annual pre-tax deductions not listed above (amount).
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.otherPreTaxDeductions}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,otherPreTaxDeductions: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">Child Tax Credit</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-ctc" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-ctc" role="tooltip" className="tooltip-bubble">
                      Enter your total annual Child Tax Credit to apply (amount).
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.childTaxCredit}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,childTaxCredit: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">Dependent Care Credit</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-dcc" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-dcc" role="tooltip" className="tooltip-bubble">
                      Enter your total annual Dependent Care Credit to apply (amount).
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.dependentCareCredit}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,dependentCareCredit: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              </div>
              )}
            </div>
          </section>

          {/* Right: Results */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-bg-surface shadow-card rounded-2xl p-6">
              <div className="text-center">
                <p className="text-sm text-neutral-400">Annual Take-Home Pay</p>
                <p className="text-4xl font-extrabold mt-1 text-primary-700">{result ? formatCurrency(result.netPay) : '$0'}</p>
                <p className="text-xs text-neutral-400 mt-1">Primary State: {inputs.state || '\u2014'}</p>

                {result && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>Std Deduction</span>
                      <strong>{formatCurrency(result.federalStdDeduction)}</strong>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>Taxable</span>
                      <strong>{formatCurrency(result.federalTaxable)}</strong>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>Federal Marginal</span>
                      <strong>{(result.federalMarginalRate * 100).toFixed(2)}%</strong>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>401(k) per paycheck</span>
                      <strong>{formatCurrency(result.k401Total / 26)}</strong>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>State Marginal</span>
                      <strong>{(result.stateMarginalRate * 100).toFixed(2)}%</strong>
                    </div>
                    {false && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                        <span>{result.stateInfo}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="my-4 border-t border-neutral-200" />

              <div>
                <p className="text-lg font-semibold mb-2">Breakdown</p>
                <div className="rounded-xl border border-neutral-200 divide-y divide-neutral-200 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-500">Gross Income</span>
                    <span className="font-semibold tabular-nums font-mono">{result ? formatCurrency(result.grossIncome) : '$0'}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-500">Pre-Tax Deductions</span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-rose-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5">
                          {((result.preTaxDeductions / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <span>-{result ? formatCurrency(result.preTaxDeductions) : '$0'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-500">Adjusted Income</span>
                    <span className="font-semibold tabular-nums font-mono">{result ? formatCurrency(result.adjustedIncome) : '$0'}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-500">Federal Tax</span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-rose-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5">
                          {((result.federalTax / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <span>-{result ? formatCurrency(result.federalTax) : '$0'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-500">State Tax</span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-rose-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5">
                          {((result.stateTax / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <span>-{result ? formatCurrency(result.stateTax) : '$0'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-500">FICA Tax</span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-rose-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5">
                          {((result.ficaTax / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <span>-{result ? formatCurrency(result.ficaTax) : '$0'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-500">Local Tax</span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-rose-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5">
                          {((result.localTax / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <span>-{result ? formatCurrency(result.localTax) : '$0'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-500">Total Tax</span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-rose-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5">
                          {((result.totalTax / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <span>-{result ? formatCurrency(result.totalTax) : '$0'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-500">Roth Contributions</span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-amber-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-amber-700/80 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
                          {((result.rothContributions / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <span>-{result ? formatCurrency(result.rothContributions) : '$0'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-600 font-medium">Net After Taxes</span>
                    <span className="font-semibold tabular-nums font-mono text-emerald-700">{result ? formatCurrency(result.netPay) : '$0'}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-600 font-medium">Final Net (After Roth)</span>
                    <span className="font-semibold tabular-nums font-mono text-emerald-700">{result ? formatCurrency(result.finalNet) : '$0'}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-700 font-semibold">Final Net (Weekly)</span>
                    <span className="font-bold tabular-nums font-mono text-emerald-700">{result ? formatCurrency(result.finalNetWeekly) : '$0'}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-700 font-semibold">Final Net (Biweekly)</span>
                    <span className="font-bold tabular-nums font-mono text-emerald-700">{result ? formatCurrency(result.finalNetBiweekly) : '$0'}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-700 font-semibold">Final Net (Monthly)</span>
                    <span className="font-bold tabular-nums font-mono text-emerald-700">{result ? formatCurrency(result.finalNetMonthly) : '$0'}</span>
                  </div>
                </div>

                {result && (
                  <TaxChart
                    federalTax={result.federalTax}
                    stateTax={result.stateTax}
                    ficaTax={result.ficaTax}
                    localTax={result.localTax}
                    preTaxDeductions={result.preTaxDeductions}
                    rothContributions={result.rothContributions}
                    netPay={result.finalNet}
                  />
                )}
              </div>
            </div>

            {/* Compare States */}
            <div className="bg-bg-surface shadow-card rounded-2xl p-6">
              <p className="text-lg font-semibold mb-3">Compare States</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {[0,1].map((i)=> (
                  <select key={i} value={compareStates[i]} onChange={(e)=> setCompareStates((prev)=> { const c=[...prev]; c[i]=e.target.value; return c; })}
                    className="w-full h-12 rounded-xl px-4 border border-neutral-200 bg-neutral-50 focus:border-primary-500 focus:ring-primary-500">
                    <option value="">Select state</option>
                    {STATES_LIST.map((s)=> (<option key={s} value={s}>{s}</option>))}
                  </select>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparisonResults.length === 0 && (
                  <p className="text-neutral-400 text-sm">Pick up to two states to compare.</p>
                )}
                {comparisonResults.map((c)=> (
                  <div key={c.code} className="rounded-lg border border-neutral-200 p-4 bg-bg-surface">
                    <h3 className="font-semibold mb-2">{c.code}</h3>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">State tax</span><strong>{formatCurrency(c.stateTax)}</strong></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">Net (annual)</span><strong>{formatCurrency(c.netAnnual)}</strong></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">After Roth (annual)</span><strong>{formatCurrency(c.finalAnnual)}</strong></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">Monthly</span><strong>{formatCurrency(c.monthly)}</strong></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">Biweekly</span><strong>{formatCurrency(c.biweekly)}</strong></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">Weekly</span><strong>{formatCurrency(c.weekly)}</strong></div>
                    <p className="text-xs text-neutral-400 mt-2">{c.info||''}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What-If Scenarios */}
            <div className="bg-bg-surface shadow-card rounded-2xl p-6">
              <p className="text-lg font-semibold mb-3">What-If Scenarios</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Bonus Amount</label>
                  <input type="number" min="0" step="100" value={bonusAmount}
                    onChange={(e)=>{ const val = e.target.value; setBonusAmount(val === '' ? '' : Number(val)); }}
                    className="form-input w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div className="md:col-span-2 text-sm text-neutral-600">
                  {bonusSummary ? (<p>{bonusSummary}</p>) : (<p className="text-neutral-400">Enter a bonus amount to see the impact.</p>)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-3 items-end">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Offer 1 Income</label>
                  <input type="number" min="0" step="100" value={offer1Income}
                    onChange={(e)=>{ const val = e.target.value; setOffer1Income(val === '' ? '' : Number(val)); }}
                    className="form-input w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Offer 2 Income</label>
                  <input type="number" min="0" step="100" value={offer2Income}
                    onChange={(e)=>{ const val = e.target.value; setOffer2Income(val === '' ? '' : Number(val)); }}
                    className="form-input w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div className="text-sm text-neutral-600 md:col-span-1">
                  {offerComparison ? (<p>{offerComparison}</p>) : (<p className="text-neutral-400">Enter both offers to compare.</p>)}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}






