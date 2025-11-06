import React, { useEffect, useMemo, useState } from 'react';
import Topbar from '../../../components/calculators_shared_files/topBar';
import { STATES_LIST } from './utils/taxData';
import { calcFederalTax, calcStateTax, calcFicaTax, formatCurrency } from './utils/taxCalculations';
import { TaxChart } from './components/TaxChart';

export default function TakeHomePayCalculator() {
  const [inputs, setInputs] = useState({
    income: 0,
    spouseIncome: 0,
    year: 2025,
    state: '',
    status: 'single',
    k401Percent: 0,
    spouseK401Percent: 0,
    rothAmount: 0,
    spouseRothAmount: 0,
    healthInsurance: 0,
    hsa: 0,
    traditionalIra: 0,
    studentLoanInterest: 0,
    fsaContribution: 0,
    otherPreTaxDeductions: 0,
    childTaxCredit: 0,
    dependentCareCredit: 0,
    localTaxRate: 0,
    overrideStateRate: undefined,
  });

  const [compareStates, setCompareStates] = useState(['', '']);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [offer1Income, setOffer1Income] = useState(0);
  const [offer2Income, setOffer2Income] = useState(0);

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
    };
  }, [inputs]);

  const handleReset = () => {
    setInputs({
      income: 0,
      spouseIncome: 0,
      year: 2025,
      state: '',
      status: 'single',
      k401Percent: 0,
      spouseK401Percent: 0,
      rothAmount: 0,
      spouseRothAmount: 0,
      healthInsurance: 0,
      hsa: 0,
      traditionalIra: 0,
      studentLoanInterest: 0,
      fsaContribution: 0,
      otherPreTaxDeductions: 0,
      childTaxCredit: 0,
      dependentCareCredit: 0,
      localTaxRate: 0,
      overrideStateRate: undefined,
    });
    setCompareStates(['', '']);
    setBonusAmount(0);
    setOffer1Income(0);
    setOffer2Income(0);
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
    return `Offer 1: ${formatCurrency(Number(offer1Income||0))} → ${formatCurrency(n1)} net (${formatCurrency(n1/12)}/mo) | ` +
           `Offer 2: ${formatCurrency(Number(offer2Income||0))} → ${formatCurrency(n2)} net (${formatCurrency(n2/12)}/mo)`;
  }, [result, offer1Income, offer2Income, inputs]);

  return (
    <div className="min-h-screen bg-bg-page text-neutral-900">
      <Topbar />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">U.S. Take-Home Pay Calculator</h1>
          <button onClick={handleReset} className="inline-flex items-center rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-sm font-semibold px-3 py-2">Reset</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Inputs */}
          <section className="lg:col-span-1 bg-bg-surface shadow-card rounded-xl p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">Your Gross Annual Income</label>
                <input type="number" min="0" step="100" value={inputs.income}
                  onChange={(e)=>setInputs(v=>({...v,income:Number(e.target.value)||0}))}
                  className="form-input w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-primary-500" placeholder="e.g. 90000" />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-1">Spouse's Gross Annual Income</label>
                <input type="number" min="0" step="100" value={inputs.spouseIncome}
                  onChange={(e)=>setInputs(v=>({...v,spouseIncome:Number(e.target.value)||0}))}
                  className="form-input w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-primary-500" placeholder="e.g. 60000" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Tax Year</label>
                  <select value={inputs.year} onChange={(e)=>setInputs(v=>({...v,year:Number(e.target.value)}))}
                    className="form-select w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-primary-500">
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Filing Status</label>
                  <select value={inputs.status} onChange={(e)=>setInputs(v=>({...v,status:e.target.value}))}
                    className="form-select w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-primary-500">
                    <option value="single">Single</option>
                    <option value="mfj">Married Filing Jointly</option>
                    <option value="mfs">Married Filing Separately</option>
                    <option value="hoh">Head of Household</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">State</label>
                  <select value={inputs.state} onChange={(e)=>setInputs(v=>({...v,state:e.target.value}))}
                    className="form-select w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-primary-500">
                    <option value="">Select state</option>
                    {STATES_LIST.map((s)=> (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Override State Rate (%)</label>
                  <input type="number" min="0" step="0.01" value={inputs.overrideStateRate ?? ''}
                    onChange={(e)=>setInputs(v=>({...v,overrideStateRate:e.target.value}))}
                    className="form-input w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-primary-500" placeholder="optional" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-1">Local Tax Rate (%)</label>
                <input type="number" min="0" step="0.01" value={inputs.localTaxRate}
                  onChange={(e)=>setInputs(v=>({...v,localTaxRate:Number(e.target.value)||0}))}
                  className="form-input w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-primary-500" placeholder="0" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">401(k) % (You)</label>
                  <input type="number" min="0" step="0.1" value={inputs.k401Percent}
                    onChange={(e)=>setInputs(v=>({...v,k401Percent:Number(e.target.value)||0}))}
                    className="form-input w-full rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">401(k) % (Spouse)</label>
                  <input type="number" min="0" step="0.1" value={inputs.spouseK401Percent}
