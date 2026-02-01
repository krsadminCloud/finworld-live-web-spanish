import React, { useEffect, useMemo, useState } from 'react';
import Topbar from '../../../components/calculators_shared_files/topBar';
import { Helmet } from 'react-helmet-async';
import { STATES_LIST } from './utils/taxData';
import { calcFederalTax, calcStateTax, calcFicaComponents, calcFicaTax, formatCurrency } from './utils/taxCalculations';
import { TaxChart } from './components/TaxChart';
import { ensureThpThemeCss, setThpThemeCss } from './themeCssLoader';
import { trackEvent } from '../../../utils/analytics';
import { useTranslation, Trans } from 'react-i18next';

export default function TakeHomePayCalculator() {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    income: '',
    spouseIncome: '',
    yourBonus: '',
    spouseBonus: '',
    year: 2025,
    state: '',
    status: 'single',
    k401Percent: '',
    spouseK401Percent: '',
    k401BaseSelf: 'salary_plus_bonus',
    k401BaseSpouse: 'salary_plus_bonus',
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
  const [offer1Income, setOffer1Income] = useState('');
  const [offer2Income, setOffer2Income] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreTaxDetails, setShowPreTaxDetails] = useState(false);
  const [showIncomeDetails, setShowIncomeDetails] = useState(false);
  const [detailRow, setDetailRow] = useState('');

  // Ensure page-scoped theme CSS is loaded and kept in sync with global dark class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    ensureThpThemeCss(isDark ? 'dark' : 'light');
    const observer = new MutationObserver(() => {
      const nextIsDark = document.documentElement.classList.contains('dark');
      setThpThemeCss(nextIsDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const canonical =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/take-home-pay`
      : 'https://www.finworld.live/tools/take-home-pay';
  const title = t("calculators.takeHomePay.meta.title");
  const description = t("calculators.takeHomePay.meta.description");

  const result = useMemo(() => {
    const baseSelf = Number(inputs.income) || 0;
    const baseSpouse = Number(inputs.spouseIncome) || 0;
    const bonusSelf = Number(inputs.yourBonus) || 0;
    const bonusSpouse = Number(inputs.spouseBonus) || 0;
    const totalIncome = baseSelf + baseSpouse + bonusSelf + bonusSpouse;
    if (!totalIncome) return null;

    const your401Base = baseSelf + ((inputs.k401BaseSelf === 'salary_plus_bonus') ? bonusSelf : 0);
    const spouse401Base = baseSpouse + ((inputs.k401BaseSpouse === 'salary_plus_bonus') ? bonusSpouse : 0);
    const k401_1 = Math.max(0, your401Base * ((Number(inputs.k401Percent) || 0) / 100));
    const k401_2 = Math.max(0, spouse401Base * ((Number(inputs.spouseK401Percent) || 0) / 100));
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

    let stateTax, stateInfo, stateMarginalRate, stateTaxable, stateDeduction;
    if (inputs.overrideStateRate !== undefined && inputs.overrideStateRate !== null && inputs.overrideStateRate !== '') {
      const rate = Number(inputs.overrideStateRate) / 100;
      stateTax = adjustedIncome * rate;
      stateInfo = `Override ${Number(inputs.overrideStateRate).toFixed(2)}%`;
      stateMarginalRate = rate;
      stateTaxable = adjustedIncome;
      stateDeduction = 0;
    } else {
      const sres = calcStateTax(adjustedIncome, inputs.state, inputs.year, inputs.status);
      stateTax = sres.tax;
      stateInfo = sres.info;
      stateMarginalRate = sres.marginalRate;
      stateTaxable = sres.taxable ?? adjustedIncome;
      stateDeduction = sres.deductionAmount || 0;
    }

    const ficaComponents = calcFicaComponents(inputs.year, totalIncome, inputs.status);
    const ficaTax = ficaComponents.total;
    const localTax = adjustedIncome * ((Number(inputs.localTaxRate) || 0) / 100);
    const totalTax = federalTax + stateTax + ficaTax + localTax;
    const netPay = totalIncome - totalTax - preTaxDeductions;
      const finalNet = Math.max(0, netPay - rothTotal);

      return {
      grossIncome: totalIncome,
      yourBaseIncome: baseSelf,
      spouseBaseIncome: baseSpouse,
      yourBonus: bonusSelf,
      spouseBonus: bonusSpouse,
      preTaxDeductions,
      adjustedIncome,
      federalTax,
      stateTax,
      ficaTax,
      ficaComponents,
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
      k401Your: k401_1,
      k401Spouse: k401_2,
      preTaxItems: {
        k401Your: k401_1,
        k401Spouse: k401_2,
        healthInsurance: Number(inputs.healthInsurance) || 0,
        hsa: Number(inputs.hsa) || 0,
        traditionalIra: Number(inputs.traditionalIra) || 0,
        studentLoanInterest: Number(inputs.studentLoanInterest) || 0,
        fsaContribution: Number(inputs.fsaContribution) || 0,
        otherPreTaxDeductions: Number(inputs.otherPreTaxDeductions) || 0,
      },
      netMonthly: netPay / 12,
      netBiweekly: netPay / 26,
      netWeekly: netPay / 52,
      finalNetMonthly: finalNet / 12,
      finalNetBiweekly: finalNet / 26,
      finalNetWeekly: finalNet / 52,
      stateTaxable,
      stateDeduction,
      // de-dup keys: stateDeduction/stateTaxable/ficaComponents already included above
    };
  }, [inputs]);

  const handleReset = () => {
    setInputs({
      income: '',
      spouseIncome: '',
      yourBonus: '',
      spouseBonus: '',
      year: 2025,
      state: '',
      status: 'single',
      k401Percent: '',
      spouseK401Percent: '',
      k401BaseSelf: 'salary_plus_bonus',
      k401BaseSpouse: 'salary_plus_bonus',
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
          : calcStateTax(result.adjustedIncome, code, inputs.year, inputs.status);
        const netS = result.grossIncome - result.federalTax - stRes.tax - result.ficaTax - result.localTax - result.k401Total;
        const finalS = Math.max(0, netS - result.rothContributions);
        return { code, stateTax: stRes.tax, netAnnual: netS, finalAnnual: finalS, monthly: finalS/12, biweekly: finalS/26, weekly: finalS/52, info: stRes.info };
      });
  }, [compareStates, inputs.overrideStateRate, result]);


  const offerComparison = useMemo(() => {
    if (!result || !offer1Income || !offer2Income) return '';
    const calcNet = (offerIncome) => {
      const offerAdj = Math.max(0, Number(offerIncome||0) - result.preTaxDeductions);
      const fr = calcFederalTax(inputs.year, offerAdj, inputs.status);
      const ft = Math.max(0, fr.tax - (Number(inputs.childTaxCredit)||0) - (Number(inputs.dependentCareCredit)||0));
      const st = (inputs.overrideStateRate !== undefined && inputs.overrideStateRate !== null && inputs.overrideStateRate !== '')
        ? offerAdj * (Number(inputs.overrideStateRate)/100)
        : calcStateTax(offerAdj, inputs.state, inputs.year, inputs.status).tax;
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
    <div className="thp min-h-screen bg-bg-page text-neutral-900">
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonical} />
        <meta name="description" content={description} />
      </Helmet>
      <Topbar />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-neutral-900">{t("calculators.takeHomePay.hero.title")}</h1>
            <p className="text-neutral-600 mt-1 max-w-2xl">{t("calculators.takeHomePay.hero.subtitle")}</p>
          </div>
            <button onClick={handleReset} className="inline-flex items-center rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-sm font-semibold px-3 py-2">{t("calculators.takeHomePay.actions.reset")}</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Inputs */}
          <section className="lg:col-span-1 bg-bg-surface shadow-card rounded-lg p-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">{t("calculators.takeHomePay.inline.labels.yourIncome")}</label>
                <input type="number" min="0" step="100" value={inputs.income}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,income: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder={t("calculators.takeHomePay.inline.placeholders.income")} />
              </div>
              
              <div>
                <label className="block text-sm text-neutral-600 mb-1">{t("calculators.takeHomePay.inline.labels.spouseIncome")}</label>
                <input type="number" min="0" step="100" value={inputs.spouseIncome}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,spouseIncome: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder={t("calculators.takeHomePay.inline.placeholders.incomeSpouse")} />
              </div>
              
              <div>
                <label className="block text-sm text-neutral-600 mb-1">{t("calculators.takeHomePay.inline.labels.yourBonus")}</label>
                <input type="number" min="0" step="100" value={inputs.yourBonus ?? ''}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,yourBonus: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder={t("calculators.takeHomePay.inline.placeholders.yourBonus")} />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">{t("calculators.takeHomePay.inline.labels.spouseBonus")}</label>
                <input type="number" min="0" step="100" value={inputs.spouseBonus ?? ''}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,spouseBonus: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder={t("calculators.takeHomePay.inline.placeholders.spouseBonus")} />
              </div>
              
              <div>
                <label className="block text-sm text-neutral-600 mb-1">{t("calculators.takeHomePay.inline.labels.taxYear")}</label>
                <select value={inputs.year} onChange={(e)=>setInputs(v=>({...v,year:Number(e.target.value)}))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus">
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">{t("calculators.takeHomePay.inline.labels.filingStatus")}</label>
                <select value={inputs.status} onChange={(e)=>setInputs(v=>({...v,status:e.target.value}))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus">
                  <option value="single">{t("calculators.takeHomePay.inline.options.single")}</option>
                  <option value="mfj">{t("calculators.takeHomePay.inline.options.mfj")}</option>
                  <option value="mfs">{t("calculators.takeHomePay.inline.options.mfs")}</option>
                  <option value="hoh">{t("calculators.takeHomePay.inline.options.hoh")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">{t("calculators.takeHomePay.inline.labels.state")}</label>
                <select value={inputs.state} onChange={(e)=>setInputs(v=>({...v,state:e.target.value}))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus">
                  <option value="">{t("calculators.takeHomePay.inline.options.selectState")}</option>
                  {STATES_LIST.map((s)=> (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">{t("calculators.takeHomePay.inline.labels.overrideState")} <span className="text-neutral-400">{t("calculators.takeHomePay.inline.labels.optional")}</span></label>
                <input type="number" min="0" step="0.01" value={inputs.overrideStateRate ?? ''}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,overrideStateRate: val})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder={t("calculators.takeHomePay.inline.placeholders.overrideState")} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.inline.labels.localTax")}</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-local" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-local" role="tooltip" className="tooltip-bubble">
                      {t("calculators.takeHomePay.inline.help.localTax")}
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="0.01" value={inputs.localTaxRate}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,localTaxRate: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder={t("calculators.takeHomePay.inline.placeholders.localTaxExample")} />
                </div>
              <div>
                {/* Your 401(k) first */}
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.inline.labels.your401")}</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-k401" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-k401" role="tooltip" className="tooltip-bubble">
                      {t("calculators.takeHomePay.inline.help.your401")}
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
                    placeholder={t("calculators.takeHomePay.inline.placeholders.percentIncome")}
                    data-has-value={inputs.k401Percent ? 'true' : 'false'}
                  />
                </div>

                <div className="mt-1">
                  <label className="block text-xs text-neutral-500 mb-1">{t("calculators.takeHomePay.inline.labels.apply401")}</label>
                  <select
                    value={inputs.k401BaseSelf || 'salary_plus_bonus'}
                    onChange={(e)=> setInputs(v=>({...v,k401BaseSelf: e.target.value}))}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus"
                  >
                    <option value="salary">{t("calculators.takeHomePay.inline.options.salaryOnly")}</option>
                    <option value="salary_plus_bonus">{t("calculators.takeHomePay.inline.options.salaryPlusBonus")}</option>
                  </select>
                </div>

                {/* Spouse 401(k) second */}
                <div className="flex items-center gap-2 mb-1 mt-4">
                  <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.inline.labels.spouse401")}</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-k401-spouse" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-k401-spouse" role="tooltip" className="tooltip-bubble">
                      {t("calculators.takeHomePay.inline.help.spouse401")}
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
                    placeholder={t("calculators.takeHomePay.inline.placeholders.percentIncome")}
                    data-has-value={inputs.spouseK401Percent ? 'true' : 'false'}
                  />
                </div>
                <div className="mt-1">
                  <label className="block text-xs text-neutral-500 mb-1">{t("calculators.takeHomePay.inline.labels.apply401")}</label>
                  <select
                    value={inputs.k401BaseSpouse || 'salary_plus_bonus'}
                    onChange={(e)=> setInputs(v=>({...v,k401BaseSpouse: e.target.value}))}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus"
                  >
                    <option value="salary">{t("calculators.takeHomePay.inline.options.salaryOnly")}</option>
                    <option value="salary_plus_bonus">{t("calculators.takeHomePay.inline.options.salaryPlusBonus")}</option>
                  </select>
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
                  {showAdvanced ? t("calculators.takeHomePay.inline.labels.hideAdvanced") : t("calculators.takeHomePay.inline.labels.showAdvanced")}
                </button>
              </div>
              
              {showAdvanced && (
              <div className="mt-4 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.inline.labels.yourRoth")}</label>
                    <span className="tooltip">
                      <button type="button" aria-describedby="tip-roth" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                        <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div id="tip-roth" role="tooltip" className="tooltip-bubble">
                        {t("calculators.takeHomePay.inline.help.yourRoth")}
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
                      placeholder={t("calculators.takeHomePay.inline.placeholders.rothExample")}
                    />
                  </div>
                </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.inline.labels.spouseRoth")}</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-roth-spouse" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-roth-spouse" role="tooltip" className="tooltip-bubble">
                      {t("calculators.takeHomePay.inline.help.spouseRoth")}
                    </div>
                  </span>
                </div>
                <div className="relative">
                <input type="number" min="0" step="100" value={inputs.spouseRothAmount}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,spouseRothAmount: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" placeholder={t("calculators.takeHomePay.inline.placeholders.rothExample")} />
                  
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.inline.labels.healthInsurance")}</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-health" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-health" role="tooltip" className="tooltip-bubble">
                      {t("calculators.takeHomePay.inline.help.healthInsurance")}
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.healthInsurance}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,healthInsurance: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.advanced.preTax.hsa")}</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-hsa" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-hsa" role="tooltip" className="tooltip-bubble">
                      {t("calculators.takeHomePay.advanced.preTax.hsaHelp")}
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.hsa}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,hsa: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.advanced.preTax.traditionalIra")}</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-tira" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-tira" role="tooltip" className="tooltip-bubble">
                      {t("calculators.takeHomePay.advanced.preTax.traditionalIraHelp")}
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.traditionalIra}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,traditionalIra: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.advanced.preTax.studentLoanInterest")}</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-sli" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-sli" role="tooltip" className="tooltip-bubble">
                      {t("calculators.takeHomePay.advanced.preTax.studentLoanInterestHelp")}
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.studentLoanInterest}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,studentLoanInterest: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.advanced.preTax.fsaContribution")}</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-fsa" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-fsa" role="tooltip" className="tooltip-bubble">
                      {t("calculators.takeHomePay.advanced.preTax.fsaContributionHelp")}
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.fsaContribution}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,fsaContribution: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.advanced.preTax.otherDeductions")}</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-other" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-other" role="tooltip" className="tooltip-bubble">
                      {t("calculators.takeHomePay.advanced.preTax.otherDeductionsHelp")}
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.otherPreTaxDeductions}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,otherPreTaxDeductions: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.credits.childTaxCredit")}</label>
                  <span className="tooltip">
                    <button type="button" aria-describedby="tip-ctc" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                      <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div id="tip-ctc" role="tooltip" className="tooltip-bubble">
                      {t("calculators.takeHomePay.credits.childTaxCreditHelp")}
                    </div>
                  </span>
                </div>
                <input type="number" min="0" step="50" value={inputs.childTaxCredit}
                  onChange={(e)=>{ const val = e.target.value; setInputs(v=>({...v,childTaxCredit: val === '' ? '' : Number(val)})); }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus" />
              </div>
              <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="block text-sm font-medium text-neutral-700">{t("calculators.takeHomePay.credits.dependentCareCredit")}</label>
                      <span className="tooltip">
                        <button type="button" aria-describedby="tip-dcc" className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-300">
                          <svg className="h-4 w-4 text-teal-600 hover:text-teal-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div id="tip-dcc" role="tooltip" className="tooltip-bubble">
                          {t("calculators.takeHomePay.credits.dependentCareCreditHelp")}
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
                <p className="text-sm text-neutral-400">{t("calculators.takeHomePay.results.annualTitle")}</p>
                <p className="text-4xl font-extrabold mt-1 text-primary-700">{result ? formatCurrency(result.netPay) : '$0'}</p>
                <p className="text-xs text-neutral-400 mt-1">{t("calculators.takeHomePay.results.primaryState")} {inputs.state || '\u2014'}</p>

                {result && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>{t("calculators.takeHomePay.results.stdDeduction")}</span>
                      <strong>{formatCurrency(result.federalStdDeduction)}</strong>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>{t("calculators.takeHomePay.results.federalTaxable")}</span>
                      <strong>{formatCurrency(result.federalTaxable)}</strong>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>{t("calculators.takeHomePay.results.federalMarginal")}</span>
                      <strong>{(result.federalMarginalRate * 100).toFixed(2)}%</strong>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>{t("calculators.takeHomePay.results.k401PerPaycheck")}</span>
                      <strong>{formatCurrency(result.k401Total / 26)}</strong>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>{t("calculators.takeHomePay.results.stateMarginal")}</span>
                      <strong>{(result.stateMarginalRate * 100).toFixed(2)}%</strong>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>{t("calculators.takeHomePay.results.stateTaxable")}</span>
                      <strong>{formatCurrency(result.stateTaxable || 0)}</strong>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-900 border border-neutral-200">
                      <span>{t("calculators.takeHomePay.results.stateDeduction")}</span>
                      <strong>{formatCurrency(result.stateDeduction || 0)}</strong>
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
                <p className="text-lg font-semibold mb-2">{t("calculators.takeHomePay.breakdown.title")}</p>
                <div className="rounded-xl border border-neutral-200 divide-y divide-neutral-200 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-500">
                      {t("calculators.takeHomePay.breakdown.grossIncome")}
                      <button
                        type="button"
                        onClick={() => setShowIncomeDetails(v=>!v)}
                        className="ml-2 text-teal-700 hover:text-teal-800 text-xs underline"
                      >
                        {showIncomeDetails ? t("calculators.takeHomePay.breakdown.hideDetails") : t("calculators.takeHomePay.breakdown.incomeDetails")}
                      </button>
                    </span>
                    <span className="font-semibold tabular-nums font-mono">{result ? formatCurrency(result.grossIncome) : '$0'}</span>
                  </div>
                  {result && showIncomeDetails && (
                    <div className="px-3 py-2 text-xs bg-white">
                      {(() => {
                        const items = [
                          { key: 'baseSelf', label: t("calculators.takeHomePay.breakdown.income.baseSelf"), val: result.yourBaseIncome },
                          { key: 'bonusSelf', label: t("calculators.takeHomePay.breakdown.income.bonusSelf"), val: result.yourBonus },
                          { key: 'baseSpouse', label: t("calculators.takeHomePay.breakdown.income.baseSpouse"), val: result.spouseBaseIncome },
                          { key: 'bonusSpouse', label: t("calculators.takeHomePay.breakdown.income.bonusSpouse"), val: result.spouseBonus },
                        ];
                        return items
                          .filter(i => (Number(i.val) || 0) > 0)
                          .map(i => (
                            <div key={i.key} className="flex items-center justify-between pl-4 py-1">
                              <span className="text-neutral-500">{i.label}</span>
                              <span className="flex items-center gap-2 font-medium tabular-nums font-mono text-neutral-800">
                                <span className="text-[10px] text-neutral-700/80 bg-neutral-50 border border-neutral-200 rounded-full px-1.5 py-0.5">
                                  {((i.val / result.grossIncome) * 100).toFixed(1)}%
                                </span>
                                <span>{formatCurrency(i.val)}</span>
                              </span>
                            </div>
                          ));
                      })()}
                    </div>
                  )}

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-500">
                      {t("calculators.takeHomePay.breakdown.preTaxTotal")}
                      <button
                        type="button"
                        onClick={() => setShowPreTaxDetails(v => !v)}
                        className="ml-2 text-teal-700 hover:text-teal-800 text-xs underline"
                      >
                        {t("calculators.takeHomePay.breakdown.details")}
                      </button>
                    </span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-rose-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5">
                          {((result.preTaxDeductions / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <span>-{result ? formatCurrency(result.preTaxDeductions) : '$0'}</span>
                    </span>
                  </div>

                  {result && showPreTaxDetails && (
                    <div className="px-3 py-2 text-xs bg-neutral-50">
                      {(() => {
                        const items = [
                          { key: 'k401Your', label: "Your 401(k)", val: result.preTaxItems.k401Your },
                          { key: 'k401Spouse', label: "Spouse's 401(k)", val: result.preTaxItems.k401Spouse },
                          { key: 'healthInsurance', label: 'Health Insurance', val: result.preTaxItems.healthInsurance },
                          { key: 'hsa', label: 'HSA', val: result.preTaxItems.hsa },
                          { key: 'traditionalIra', label: 'Traditional IRA', val: result.preTaxItems.traditionalIra },
                          { key: 'studentLoanInterest', label: 'Student Loan Interest', val: result.preTaxItems.studentLoanInterest },
                          { key: 'fsaContribution', label: 'FSA', val: result.preTaxItems.fsaContribution },
                          { key: 'otherPreTaxDeductions', label: 'Other Pre-Tax Deductions', val: result.preTaxItems.otherPreTaxDeductions },
                        ];
                        return items
                          .filter(i => (Number(i.val) || 0) > 0)
                          .map(i => (
                            <div key={i.key} className="flex items-center justify-between pl-4 py-1">
                              <span className="text-neutral-500">{i.label}</span>
                              <span className="flex items-center gap-2 font-medium tabular-nums font-mono text-rose-700">
                                <span className="text-[10px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-1.5 py-0.5">
                                  {((i.val / result.grossIncome) * 100).toFixed(1)}%
                                </span>
                                <span>-{formatCurrency(i.val)}</span>
                              </span>
                            </div>
                          ));
                      })()}
                    </div>
                  )}

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-500">{t("calculators.takeHomePay.breakdown.adjustedIncome")}</span>
                    <span className="font-semibold tabular-nums font-mono">{result ? formatCurrency(result.adjustedIncome) : '$0'}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-500">
                      {t("calculators.takeHomePay.breakdown.federalTax")}
                      <button
                        type="button"
                        onClick={() => setDetailRow(prev => prev === 'federal' ? '' : 'federal')}
                        className="ml-2 text-teal-700 hover:text-teal-800 text-xs underline"
                      >
                        {detailRow === 'federal' ? t("calculators.takeHomePay.breakdown.hideDetails") : t("calculators.takeHomePay.breakdown.details")}
                      </button>
                    </span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-rose-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5">
                          {((result.federalTax / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                    <span>-{result ? formatCurrency(result.federalTax) : '$0'}</span>
                  </span>
                </div>
                {detailRow === 'federal' && result && (
                  <div className="px-3 py-2 text-xs text-neutral-500 bg-neutral-50">
                    {t("calculators.takeHomePay.breakdown.federalDetails", {
                      adjusted: formatCurrency(result.adjustedIncome),
                      std: formatCurrency(result.federalStdDeduction),
                      taxable: formatCurrency(result.federalTaxable),
                      marginal: ((result.federalMarginalRate || 0) * 100).toFixed(2),
                    })}
                  </div>
                )}

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-500">
                      {t("calculators.takeHomePay.breakdown.stateTax")}
                      <button
                        type="button"
                        onClick={() => setDetailRow(prev => prev === 'state' ? '' : 'state')}
                        className="ml-2 text-teal-700 hover:text-teal-800 text-xs underline"
                      >
                        {detailRow === 'state' ? t("calculators.takeHomePay.breakdown.hideDetails") : t("calculators.takeHomePay.breakdown.details")}
                      </button>
                    </span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-rose-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5">
                          {((result.stateTax / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <span>-{result ? formatCurrency(result.stateTax) : '$0'}</span>
                  </span>
                </div>
                {detailRow === 'state' && result && (
                  <div className="px-3 py-2 text-xs text-neutral-500 bg-white">
                    {t("calculators.takeHomePay.breakdown.stateDetails", {
                      adjusted: formatCurrency(result.adjustedIncome),
                      deduction: formatCurrency(result.stateDeduction || 0),
                      taxable: formatCurrency(result.stateTaxable || result.adjustedIncome),
                      info: result.stateInfo || t("calculators.takeHomePay.breakdown.stateInfoDefault"),
                    })}
                  </div>
                )}

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-500">
                      {t("calculators.takeHomePay.breakdown.ficaTax")}
                      <button
                        type="button"
                        onClick={() => setDetailRow(prev => prev === 'fica' ? '' : 'fica')}
                        className="ml-2 text-teal-700 hover:text-teal-800 text-xs underline"
                      >
                        {detailRow === 'fica' ? t("calculators.takeHomePay.breakdown.hideDetails") : t("calculators.takeHomePay.breakdown.details")}
                      </button>
                    </span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-rose-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5">
                          {((result.ficaTax / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <span>-{result ? formatCurrency(result.ficaTax) : '$0'}</span>
                  </span>
                </div>
                {detailRow === 'fica' && result && (
                  <div className="px-3 py-2 text-xs text-neutral-500 bg-neutral-50">
                    {t("calculators.takeHomePay.breakdown.ficaDetails", {
                      ss: formatCurrency(result.ficaComponents.socialSecurityTax),
                      ssLimit: formatCurrency(result.ficaComponents.ssLimit),
                      medicare: formatCurrency(result.ficaComponents.medicareTax - (result.ficaComponents.additionalMedicareTax || 0)),
                      addlMedicare: formatCurrency(result.ficaComponents.additionalMedicareTax),
                      addlThreshold: formatCurrency(result.ficaComponents.addMedThreshold),
                    })}
                  </div>
                )}

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-500">
                      {t("calculators.takeHomePay.breakdown.localTax")}
                      <button
                        type="button"
                        onClick={() => setDetailRow(prev => prev === 'local' ? '' : 'local')}
                        className="ml-2 text-teal-700 hover:text-teal-800 text-xs underline"
                      >
                        {detailRow === 'local' ? t("calculators.takeHomePay.breakdown.hideDetails") : t("calculators.takeHomePay.breakdown.details")}
                      </button>
                    </span>
                    <span className="flex items-center gap-2 font-semibold tabular-nums font-mono text-rose-700">
                      {result && result.grossIncome ? (
                        <span className="text-[11px] text-rose-700/80 bg-rose-50 border border-rose-100 rounded-full px-2 py-0.5">
                          {((result.localTax / result.grossIncome) * 100).toFixed(1)}%
                        </span>
                      ) : null}
                      <span>-{result ? formatCurrency(result.localTax) : '$0'}</span>
                  </span>
                </div>
                {detailRow === 'local' && result && (
                  <div className="px-3 py-2 text-xs text-neutral-500 bg-white">
                    Local tax = adjusted income ({formatCurrency(result.adjustedIncome)}) × rate ({((Number(inputs.localTaxRate) || 0)).toFixed(2)}%).
                  </div>
                )}

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-500">{t("calculators.takeHomePay.breakdown.totalTax")}</span>
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
                    <span className="text-neutral-600 font-medium">{t("calculators.takeHomePay.summary.netAfterTaxes")}</span>
                    <span className="font-semibold tabular-nums font-mono text-emerald-700">{result ? formatCurrency(result.netPay) : '$0'}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-600 font-medium">{t("calculators.takeHomePay.summary.finalNet")}</span>
                    <span className="font-semibold tabular-nums font-mono text-emerald-700">{result ? formatCurrency(result.finalNet) : '$0'}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-700 font-semibold">{t("calculators.takeHomePay.summary.finalNetWeekly")}</span>
                    <span className="font-bold tabular-nums font-mono text-emerald-700">{result ? formatCurrency(result.finalNetWeekly) : '$0'}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-neutral-50">
                    <span className="text-neutral-700 font-semibold">{t("calculators.takeHomePay.summary.finalNetBiweekly")}</span>
                    <span className="font-bold tabular-nums font-mono text-emerald-700">{result ? formatCurrency(result.finalNetBiweekly) : '$0'}</span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-white">
                    <span className="text-neutral-700 font-semibold">{t("calculators.takeHomePay.summary.finalNetMonthly")}</span>
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
              <p className="text-lg font-semibold mb-3">{t("calculators.takeHomePay.compare.title")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {[0,1].map((i)=> (
                  <select key={i} value={compareStates[i]} onChange={(e)=> setCompareStates((prev)=> { const c=[...prev]; c[i]=e.target.value; return c; })}
                    className="w-full h-12 rounded-xl px-4 border border-neutral-200 bg-neutral-50 focus:border-primary-500 focus:ring-primary-500">
                    <option value="">{t("calculators.takeHomePay.compare.selectState")}</option>
                    {STATES_LIST.map((s)=> (<option key={s} value={s}>{s}</option>))}
                  </select>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparisonResults.length === 0 && (
                  <p className="text-neutral-400 text-sm">{t("calculators.takeHomePay.compare.pickTwo")}</p>
                )}
                {comparisonResults.map((c)=> (
                  <div key={c.code} className="rounded-lg border border-neutral-200 p-4 bg-bg-surface">
                    <h3 className="font-semibold mb-2">{c.code}</h3>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">{t("calculators.takeHomePay.compare.stateTax")}</span><strong>{formatCurrency(c.stateTax)}</strong></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">{t("calculators.takeHomePay.compare.netAnnual")}</span><strong>{formatCurrency(c.netAnnual)}</strong></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">{t("calculators.takeHomePay.compare.afterRothAnnual")}</span><strong>{formatCurrency(c.finalAnnual)}</strong></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">{t("calculators.takeHomePay.compare.monthly")}</span><strong>{formatCurrency(c.monthly)}</strong></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">{t("calculators.takeHomePay.compare.biweekly")}</span><strong>{formatCurrency(c.biweekly)}</strong></div>
                    <div className="flex justify-between text-sm"><span className="text-neutral-400">{t("calculators.takeHomePay.compare.weekly")}</span><strong>{formatCurrency(c.weekly)}</strong></div>
                    <p className="text-xs text-neutral-400 mt-2">{c.info||''}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What-If Scenarios removed */}
          </section>
        </div>
      </main>
    </div>
  );
}






