import React from 'react';
import TooltipInfo from '../components/TooltipInfo';

function KPI({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-100 p-4 shadow-sm">
      <div className="text-slate-500 text-[0.72rem] font-bold leading-snug">
        {(() => {
          const twoLineSet = new Set(['Total Investment', 'Closing Costs', 'Total Expenses']);
          if (String(label).includes('(After Debt Service)')) {
            const base = String(label).replace(' (After Debt Service)', '');
            return (
              <>
                <span>{base} </span>
                <span className="whitespace-nowrap">(After Debt Service)</span>
              </>
            );
          }
          if (label === 'Total Expenses (Monthly)') {
            return (<><span>Total Expenses</span><br /><span>(Monthly)</span></>);
          }
          if (twoLineSet.has(label)) {
            const parts = String(label).split(' ');
            return (
              <>
                <span>{parts[0]}</span>
                <br />
                <span>{parts.slice(1).join(' ')}</span>
              </>
            );
          }
          return label;
        })()}
      </div>
      <div className="mt-1 text-slate-900 text-2xl font-semibold">{value}</div>
      {hint ? <div className="text-slate-400 text-xs mt-1">{hint}</div> : null}
    </div>
  );
}

export default function ResultsSummary({ analysis, mode = 'M', toggleMode, inputs, insightsTealHeader = false, hideInsights = false, onlyInsights = false, onGlobalReset }) {
  const currency = (n) => (isFinite(n) ? n : 0).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const percent = (n) => `${isFinite(n) ? n.toFixed(1) : '0.0'}%`;
  const [expMode, setExpMode] = React.useState('A');
  const factor = expMode === 'A' ? 12 : 1;
  const periodSuffix = expMode === 'A' ? '/yr' : '/mo';
  const [insightFlipped, setInsightFlipped] = React.useState(false);
  const [criteria, setCriteria] = React.useState(() => {
    try {
      const raw = localStorage.getItem('rpc_success_criteria');
      const base = { pp_gt: '', invest_under: '', cashflow_min: '', ppsf_under: '', use_pp: false, use_invest: false, use_cf: false, use_ppsf: false, use_onepct: false, use_twopct: false, use_50pct: false };
      return raw ? { ...base, ...JSON.parse(raw) } : base;
    } catch {
      return { pp_gt: '', invest_under: '', cashflow_min: '', ppsf_under: '', use_pp: false, use_invest: false, use_cf: false, use_ppsf: false, use_onepct: false, use_twopct: false, use_50pct: false };
    }
  });

  const saveCriteria = (next) => {
    setCriteria(next);
    try { localStorage.setItem('rpc_success_criteria', JSON.stringify(next)); } catch {}
  };

  const parseNum = (v) => {
    const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
    return Number.isFinite(n) ? n : undefined;
  };

  const fmtCurrencyInput = (v) => {
    const num = parseNum(v);
    if (num === undefined) return '';
    try {
      return `$${Math.trunc(num).toLocaleString()}`;
    } catch {
      return `$${num}`;
    }
  };

  const evaluate = () => {
    const actual = {
      purchasePrice: Number(inputs?.property?.purchasePrice),
      totalInvestment: Number(analysis?.investBreakdown?.totalInvestment),
      cashFlow: Number(analysis?.monthlyCashFlow),
      pricePerSqft: undefined,
      monthlyRent: Number(inputs?.income?.monthlyRent),
      effectiveMonthlyIncome: Number(analysis?.income?.effectiveMonthlyIncome),
      operatingMonthly: Number(analysis?.expenses?.operatingMonthly),
    };
    const results = [];
    const ppTh = parseNum(criteria.pp_gt);
    results.push({
      key: 'pp_gt',
      label: 'Max Purchase Price',
      actual: isFinite(actual.purchasePrice) ? actual.purchasePrice : undefined,
      pass: ppTh !== undefined && isFinite(actual.purchasePrice) ? actual.purchasePrice <= ppTh : undefined,
      text: ppTh !== undefined ? `$${ppTh.toLocaleString()}` : undefined,
      enabled: !!criteria.use_pp,
    });
    const investTh = parseNum(criteria.invest_under);
    results.push({
      key: 'invest_under',
      label: 'Max Cash to Invest',
      actual: isFinite(actual.totalInvestment) ? actual.totalInvestment : undefined,
      pass: investTh !== undefined && isFinite(actual.totalInvestment) ? actual.totalInvestment < investTh : undefined,
      text: investTh !== undefined ? `$${investTh.toLocaleString()}` : undefined,
      enabled: !!criteria.use_invest,
    });
    const cfTh = parseNum(criteria.cashflow_min);
    results.push({
      key: 'cashflow_min',
      label: 'Cash Flow at least',
      actual: isFinite(actual.cashFlow) ? actual.cashFlow : undefined,
      pass: cfTh !== undefined && isFinite(actual.cashFlow) ? actual.cashFlow >= cfTh : undefined,
      text: cfTh !== undefined ? `$${cfTh.toLocaleString()}` : undefined,
      enabled: !!criteria.use_cf,
    });
    const ppsfTh = parseNum(criteria.ppsf_under);
    results.push({
      key: 'ppsf_under',
      label: 'Price Per Square Foot under',
      actual: isFinite(actual.pricePerSqft) ? actual.pricePerSqft : undefined,
      pass: ppsfTh !== undefined ? (isFinite(actual.pricePerSqft) ? actual.pricePerSqft < ppsfTh : true) : undefined,
      text: ppsfTh !== undefined ? `$${ppsfTh.toLocaleString()}` : undefined,
      enabled: !!criteria.use_ppsf,
    });

    // Heuristic Rules
    const hasPriceRent = isFinite(actual.purchasePrice) && isFinite(actual.monthlyRent);
    results.push({
      key: 'one_pct_rule',
      label: '1% Rule',
      actual: hasPriceRent ? (actual.monthlyRent / actual.purchasePrice) : undefined,
      pass: hasPriceRent ? (actual.monthlyRent >= 0.01 * actual.purchasePrice) : undefined,
      text: undefined,
      enabled: !!criteria.use_onepct,
    });
    results.push({
      key: 'two_pct_rule',
      label: '2% Rule',
      actual: hasPriceRent ? (actual.monthlyRent / actual.purchasePrice) : undefined,
      pass: hasPriceRent ? (actual.monthlyRent >= 0.02 * actual.purchasePrice) : undefined,
      text: undefined,
      enabled: !!criteria.use_twopct,
    });
    const hasIncomeExpense = isFinite(actual.effectiveMonthlyIncome) && isFinite(actual.operatingMonthly);
    results.push({
      key: 'fifty_pct_rule',
      label: '50% Rule',
      actual: hasIncomeExpense ? (actual.operatingMonthly / (actual.effectiveMonthlyIncome || 1)) : undefined,
      pass: hasIncomeExpense ? (actual.operatingMonthly <= 0.5 * actual.effectiveMonthlyIncome) : undefined,
      text: undefined,
      enabled: !!criteria.use_50pct,
    });
    return results;
  };

  if (onlyInsights) {
    return (
      <div className="rounded-xl bg-primary-100 border border-primary-500/20">
        <div className="bg-primary-500 text-white rounded-t-xl p-4">
          <h3 className="text-lg font-semibold">Analytics & Insights</h3>
        </div>
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-3 items-stretch">
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 min-h-44">
              <div className="font-semibold text-slate-900 mb-1">NOI Breakdown</div>
              <div className="text-[0.7rem] text-slate-700 space-y-1">
                <div className="flex justify-between"><span>Gross Income (mo)</span><span className="font-semibold text-slate-900">{(() => {
                  const gross = (Number(analysis?.income?.grossMonthlyIncome)||((Number(analysis?.income?.effectiveMonthlyIncome)||0)+(Number(analysis?.income?.vacancyMonthly)||0)));
                  return gross.toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});
                })()}</span></div>
                <div className="flex justify-between"><span>Operating Expense (mo)</span><span className="font-semibold text-slate-900">{(() => {
                  const op = Number(analysis?.expenses?.operatingMonthly) || 0; return op.toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});
                })()}</span></div>
                <div className="flex justify-between"><span>Loan Payment (mo)</span><span className="font-semibold text-slate-900">{(() => {
                  const pi = Number(analysis?.monthlyPI) || 0; return pi.toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});
                })()}</span></div>
                <hr className="border-sky-200" />
                <div className="flex justify-between"><span>Net Income (mo)</span><span className="font-bold text-slate-900">{(() => {
                  const gross = (Number(analysis?.income?.grossMonthlyIncome)||((Number(analysis?.income?.effectiveMonthlyIncome)||0)+(Number(analysis?.income?.vacancyMonthly)||0)));
                  const op = Number(analysis?.expenses?.operatingMonthly) || 0;
                  const pi = Number(analysis?.monthlyPI) || 0;
                  const noi = gross - op - pi; return noi.toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});
                })()}</span></div>
              </div>
            </div>
            <div className="flip-card min-h-44">
              <div className={`flip-card-inner ${insightFlipped ? 'is-flipped' : ''}`}>
                <div className="flip-card-front h-full rounded-lg border border-amber-200 bg-amber-50 p-4 flex flex-col">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-slate-900 text-[0.6rem]">Add your Success criteria</div>
                    <button
                      type="button"
                      onClick={() => setInsightFlipped((v) => !v)}
                      className="text-[10px] px-2 py-1 rounded-full border border-green-600 bg-green-600 text-white hover:bg-green-700"
                    >
                      ADD
                    </button>
                  </div>
                  <div className="text-[0.5rem] text-slate-700 flex-1">
                    {(() => {
                      const rows = evaluate().filter(r => r.enabled);
                      return (
                        <div className="space-y-1">
                          {rows.map((r) => {
                            if (r.pass === undefined) {
                              return (
                                <div key={r.key} className="text-slate-400">
                                  {r.label} —
                                </div>
                              );
                            }
                            const ok = r.pass === true;
                            const symbol = ok ? '✅' : '❌';
                            const status = ok ? 'PASS' : 'FAIL';
                            const color = ok ? 'text-green-600' : 'text-red-600';
                            return (
                              <div key={r.key} className={`font-semibold ${color}`}>
                                {symbol} {r.label} {r.text} — {status}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div className="flip-card-back h-full rounded-lg border border-amber-200 bg-amber-50 p-4 flex flex-col">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-slate-900 text-[0.6rem]">Pick Your Criteria</div>
                    <button
                      type="button"
                      onClick={() => { saveCriteria(criteria); setInsightFlipped(false); }}
                      className="text-[10px] px-2 py-1 rounded-full border border-green-600 bg-green-600 text-white hover:bg-green-700"
                    >
                      Done
                    </button>
                  </div>
                  <div className="text-[0.5rem] text-slate-700 flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                          <input type="checkbox" className="align-middle circle-check"
                            checked={!!criteria.use_pp}
                            onChange={(e)=>saveCriteria({ ...criteria, use_pp: e.target.checked })} />
                          <span>Max Purchase Price</span>
                        </label>
                        <input className="border rounded px-2 py-1 text-right crit-input font-semibold"
                          value={criteria.pp_gt}
                          onChange={(e) => saveCriteria({ ...criteria, pp_gt: fmtCurrencyInput(e.target.value) })} />
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                          <input type="checkbox" className="align-middle circle-check"
                            checked={!!criteria.use_invest}
                            onChange={(e)=>saveCriteria({ ...criteria, use_invest: e.target.checked })} />
                          <span>Max Cash to Invest</span>
                        </label>
                        <input className="border rounded px-2 py-1 text-right crit-input font-semibold"
                          value={criteria.invest_under}
                          onChange={(e) => saveCriteria({ ...criteria, invest_under: fmtCurrencyInput(e.target.value) })} />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                          <input type="checkbox" className="align-middle circle-check"
                            checked={!!criteria.use_cf}
                            onChange={(e)=>saveCriteria({ ...criteria, use_cf: e.target.checked })} />
                          <span>Cash Flow at least</span>
                        </label>
                        <input className="border rounded px-2 py-1 text-right crit-input font-semibold"
                          value={criteria.cashflow_min}
                          onChange={(e) => saveCriteria({ ...criteria, cashflow_min: fmtCurrencyInput(e.target.value) })} />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                          <input type="checkbox" className="align-middle circle-check"
                            checked={!!criteria.use_ppsf}
                            onChange={(e)=>saveCriteria({ ...criteria, use_ppsf: e.target.checked })} />
                          <span>Price Per Square Foot under</span>
                        </label>
                        <input className="border rounded px-2 py-1 text-right crit-input font-semibold"
                          value={criteria.ppsf_under}
                          onChange={(e) => saveCriteria({ ...criteria, ppsf_under: fmtCurrencyInput(e.target.value) })} />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                          <input type="checkbox" className="align-middle circle-check"
                            checked={!!criteria.use_onepct}
                            onChange={(e)=>saveCriteria({ ...criteria, use_onepct: e.target.checked })} />
                          <span className="inline-flex items-center gap-1">1% Rule <TooltipInfo text="Monthly rent should be at least 1% of the purchase price." /></span>
                        </label>
                        <div className="crit-gap"></div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                          <input type="checkbox" className="align-middle circle-check"
                            checked={!!criteria.use_twopct}
                            onChange={(e)=>saveCriteria({ ...criteria, use_twopct: e.target.checked })} />
                          <span className="inline-flex items-center gap-1">2% Rule <TooltipInfo text="Monthly rent should be at least 2% of the purchase price." /></span>
                        </label>
                        <div className="crit-gap"></div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                          <input type="checkbox" className="align-middle circle-check"
                            checked={!!criteria.use_50pct}
                            onChange={(e)=>saveCriteria({ ...criteria, use_50pct: e.target.checked })} />
                          <span className="inline-flex items-center gap-1">50% Rule <TooltipInfo text="Rule of thumb: operating expenses should be about 50% of effective income." /></span>
                        </label>
                        <div className="crit-gap"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 p-4 min-h-44">
              <div className="font-semibold text-slate-900 mb-1 text-[0.6rem]">Smart Summary</div>
              <div className="text-[0.5rem] text-slate-700">
                <div className="font-semibold text-slate-900 mb-1 text-[0.6rem]">Returns (Year 1)</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <div className="text-[0.55rem] whitespace-nowrap">Cap Rate</div><div className="text-right font-semibold text-[0.6rem]">{percent(analysis.capRate)}</div>
                  <div className="text-[0.55rem] whitespace-nowrap">Cash on Cash Return</div><div className="text-right font-semibold text-[0.6rem]">{percent(analysis.coc)}</div>
                  <div className="text-[0.55rem] whitespace-nowrap">Return on Equity</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                    const equity = Number(analysis?.investBreakdown?.downPayment) || 0;
                    const acf = (Number(analysis?.monthlyCashFlow) || 0) * 12;
                    const roe = equity > 0 ? (acf / equity) * 100 : 0;
                    return percent(roe);
                  })()}</div>
                  <div className="text-[0.55rem] whitespace-nowrap">Return on Investment</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                    const inv = Number(analysis?.investBreakdown?.totalInvestment) || 0;
                    const acf = (Number(analysis?.monthlyCashFlow) || 0) * 12;
                    const roi = inv > 0 ? (acf / inv) * 100 : 0;
                    return percent(roi);
                  })()}</div>
                </div>

                <div className="font-semibold text-slate-900 mt-3 mb-1 text-[0.6rem]">Financial Ratios (at purchase)</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <div className="text-[0.55rem] whitespace-nowrap">Rent to Value</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                    const rtv = (Number(inputs?.income?.monthlyRent)||0) * 12 / (Number(inputs?.property?.purchasePrice)||1) * 100;
                    return `${isFinite(rtv) ? rtv.toFixed(2) : '0.00'}%`;
                  })()}</div>
                  <div className="text-[0.55rem] whitespace-nowrap">Gross Rent Multiplier</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                    const grm = (Number(inputs?.property?.purchasePrice)||0) / ((Number(inputs?.income?.monthlyRent)||0) * 12 || 1);
                    return `${isFinite(grm) ? grm.toFixed(1) : '0.0'}x`;
                  })()}</div>
                  <div className="text-[0.55rem] whitespace-nowrap">Break Even Ratio</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                    const opex = Number(analysis?.expenses?.operatingMonthly)||0;
                    const ds = Number(analysis?.monthlyPI)||0;
                    const egi = Number(analysis?.income?.effectiveMonthlyIncome)||0;
                    const ber = egi > 0 ? ((opex + ds) / egi) * 100 : 0;
                    return `${isFinite(ber) ? ber.toFixed(0) : '0'}%`;
                  })()}</div>
                  <div className="text-[0.55rem] whitespace-nowrap">Debt Coverage Ratio</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                    const noi = Number(analysis?.noiAnnual)||0;
                    const ads = (Number(analysis?.monthlyPI)||0) * 12;
                    const dscr = ads > 0 ? (noi / ads) : 0;
                    return isFinite(dscr) ? dscr.toFixed(2) : '0.00';
                  })()}</div>
                  <div className="text-[0.55rem] whitespace-nowrap">Debt Yield</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                    const noi = Number(analysis?.noiAnnual)||0;
                    const loan = Number(analysis?.loanAmount)||0;
                    const dy = loan > 0 ? (noi / loan) * 100 : 0;
                    return `${isFinite(dy) ? dy.toFixed(2) : '0.00'}%`;
                  })()}</div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 min-h-44">
              <div className="font-semibold text-slate-900 mb-1">Loan Details</div>
              <div className="text-[0.7rem] text-slate-700 space-y-1">
                <div className="flex justify-between"><span>Down Payment</span><span className="font-semibold text-slate-900">{currency(analysis.investBreakdown.downPayment)}</span></div>
                <div className="flex justify-between"><span>Interest Rate</span><span className="font-semibold text-slate-900">{currency((Number(analysis.loanAmount)||0) * ((Number(inputs?.loan?.interestRatePct)||0)/100))}</span></div>
                <div className="flex justify-between"><span>Closing Cost</span><span className="font-semibold text-slate-900">{currency(analysis.investBreakdown.closingCostAmount)}</span></div>
                <hr className="my-2 border-violet-200" />
                <div className="flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-slate-900">{currency((Number(analysis.investBreakdown.closingCostAmount)||0) + (Number(analysis.investBreakdown.downPayment)||0) + ((Number(analysis.loanAmount)||0) * ((Number(inputs?.loan?.interestRatePct)||0)/100)) )}</span></div>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 min-h-44">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-semibold text-slate-900 text-[0.78rem]">Expense Summary ({expMode === 'A' ? 'Annual' : 'Monthly'})</div>
                <button
                  type="button"
                  onClick={() => setExpMode((m) => (m === 'M' ? 'A' : 'M'))}
                  title="Toggle Monthly/Annual"
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border transition-colors ${expMode === 'A' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-slate-700 border-slate-200'}`}
                >
                  M/A
                </button>
              </div>
              <div className="text-[0.7rem] text-slate-700 space-y-1">
                <div className="flex justify-between"><span>Closing Cost</span><span className="font-semibold text-slate-900">{currency(analysis.investBreakdown.closingCostAmount)}</span></div>
                <div className="flex justify-between"><span>Loan Payment</span><span className="font-semibold text-slate-900">{currency((isFinite(analysis.monthlyPI) ? analysis.monthlyPI : 0) * (expMode==='A'?12:1))}{expMode==='M' ? ' /mo' : ''}</span></div>
                <div className="flex justify-between"><span>Operating Expense</span><span className="font-semibold text-slate-900">{currency((isFinite(analysis.expenses.operatingMonthly) ? analysis.expenses.operatingMonthly : 0) * (expMode==='A'?12:1))}{expMode==='M' ? ' /mo' : ''}</span></div>
                <hr className="my-2 border-emerald-200" />
                <div className="flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-slate-900">{currency((isFinite(analysis.investBreakdown.closingCostAmount) ? analysis.investBreakdown.closingCostAmount : 0) + ((isFinite(analysis.monthlyPI) ? analysis.monthlyPI : 0) * (expMode==='A'?12:1)) + ((isFinite(analysis.expenses.operatingMonthly) ? analysis.expenses.operatingMonthly : 0) * (expMode==='A'?12:1)))}</span></div>
              </div>
            </div>
          </div>
          {/* Investment Details inside Insights section for Option C */}
          <div className="px-0 pt-4">
            <h4 className="text-base font-semibold text-slate-800 mb-2">Investment Details</h4>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-600 font-semibold">Down Payment</span><span className="font-semibold text-slate-900">{currency(analysis.investBreakdown.downPayment)}</span></div>
                <div className="flex justify-between"><span className="text-slate-600 font-semibold">Loan Payment (before expenses)</span><span className="font-semibold text-slate-900">{currency(analysis.monthlyPI)} /mo</span></div>
                <div className="flex justify-between"><span className="text-slate-600 font-semibold">Closing Costs</span><span className="font-semibold text-slate-900">{currency(analysis.investBreakdown.closingCostAmount)}</span></div>
                <div className="flex justify-between"><span className="text-slate-600 font-semibold">Total Investment</span><span className="font-semibold text-slate-900">{currency(analysis.investBreakdown.totalInvestment)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-primary-100 border border-primary-500/20">
      <div className="border-b border-primary-500/20 bg-primary-500 text-white rounded-t-xl p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analysis Summary</h3>
          <p className="text-sm opacity-90">Key KPIs for this property</p>
        </div>
        {onGlobalReset ? (
          <button
            type="button"
            onClick={onGlobalReset}
            className="uppercase tracking-wide text-[10px] px-3 py-1 rounded-full transition-colors border border-white/40 bg-white/20 text-white hover:bg-white/30 font-bold"
            title="Reset all values to zero"
          >
            Full Reset
          </button>
        ) : null}
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <KPI label="NOI After Debt Service (Annual)" value={currency((isFinite(analysis.noiAnnual) ? analysis.noiAnnual : 0) - (isFinite(analysis.monthlyPI) ? analysis.monthlyPI : 0) * 12)} />
        <KPI label="Monthly Cash Flow (After Debt Service)" value={(() => {
          const gross = (Number(analysis?.income?.grossMonthlyIncome) || ((Number(analysis?.income?.effectiveMonthlyIncome)||0) + (Number(analysis?.income?.vacancyMonthly)||0)));
          const op = Number(analysis?.expenses?.operatingMonthly) || 0;
          const pi = Number(analysis?.monthlyPI) || 0;
          const net = gross - op - pi;
          return currency(net);
        })()} />
        <KPI label="Cash-on-Cash Return" value={percent(analysis.coc)} />
        <KPI label="Cap Rate (After Debt Service)" value={percent(analysis.capRate)} />
        <KPI label="Total Investment" value={currency(analysis.investBreakdown.totalInvestment)} />
        <KPI label="Closing Costs" value={currency(analysis.investBreakdown.closingCostAmount)} />
        <KPI label="Total Expenses (Monthly)" value={currency(analysis.expenses.operatingMonthly)}  />
      </div>

      {/* Analytics & Insights */}
      {!hideInsights && (
      <div className="px-4 pb-4">
        {insightsTealHeader ? (
          <div className="rounded-xl overflow-hidden border border-primary-500/20 mb-2">
            <div className="bg-primary-500 text-white p-3">
              <h3 className="text-base font-semibold">Analytics & Insights</h3>
            </div>
          </div>
        ) : (
          <h4 className="text-base font-semibold text-slate-800 mb-2">Analytics & Insights</h4>
        )}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-3">
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
              <div className="font-semibold text-slate-900 mb-1">NOI Breakdown</div>
            <div className="text-[0.7rem] text-slate-700 space-y-1">
              <div className="flex justify-between"><span>Gross Income (mo)</span><span className="font-semibold text-slate-900">{(() => {
                const gross = (Number(analysis?.income?.grossMonthlyIncome)||((Number(analysis?.income?.effectiveMonthlyIncome)||0)+(Number(analysis?.income?.vacancyMonthly)||0)));
                return gross.toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});
              })()}</span></div>
              <div className="flex justify-between"><span>Operating Expense (mo)</span><span className="font-semibold text-slate-900">{(() => {
                const op = Number(analysis?.expenses?.operatingMonthly) || 0; return op.toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});
              })()}</span></div>
              <div className="flex justify-between"><span>Loan Payment (mo)</span><span className="font-semibold text-slate-900">{(() => {
                const pi = Number(analysis?.monthlyPI) || 0; return pi.toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});
              })()}</span></div>
              <hr className="border-sky-200" />
              <div className="flex justify-between"><span>Net Income (mo)</span><span className="font-bold text-slate-900">{(() => {
                const gross = (Number(analysis?.income?.grossMonthlyIncome)||((Number(analysis?.income?.effectiveMonthlyIncome)||0)+(Number(analysis?.income?.vacancyMonthly)||0)));
                const op = Number(analysis?.expenses?.operatingMonthly) || 0;
                const pi = Number(analysis?.monthlyPI) || 0;
                const noi = gross - op - pi; return noi.toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});
              })()}</span></div>
            </div>
          </div>
          <div className="flip-card min-h-44">
            <div className={`flip-card-inner ${insightFlipped ? 'is-flipped' : ''}`}>
              <div className="flip-card-front h-full rounded-lg border border-amber-200 bg-amber-50 p-4 flex flex-col">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-semibold text-slate-900 text-[0.6rem]">Add your Success criteria</div>
                  <button
                    type="button"
                    onClick={() => setInsightFlipped((v) => !v)}
                    className="text-[10px] px-2 py-1 rounded-full border border-green-600 bg-green-600 text-white hover:bg-green-700"
                  >
                    ADD
                  </button>
                </div>
                <div className="text-[0.5rem] text-slate-700 flex-1">
                  {(() => {
                    const rows = evaluate().filter(r => r.enabled);
                    return (
                      <div className="space-y-1">
                        {rows.map((r) => {
                          if (r.pass === undefined) {
                            return (
                              <div key={r.key} className="text-slate-400">
                                {r.label} —
                              </div>
                            );
                          }
                          const ok = r.pass === true;
                          const symbol = ok ? '✅' : '❌';
                          const status = ok ? 'PASS' : 'FAIL';
                          const color = ok ? 'text-green-600' : 'text-red-600';
                          return (
                            <div key={r.key} className={`font-semibold ${color}`}>
                              {symbol} {r.label} {r.text} — {status}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div className="flip-card-back h-full rounded-lg border border-amber-200 bg-amber-50 p-4 flex flex-col">
                <div className="flex items-start justify-between mb-1">
                  <div className="font-semibold text-slate-900 text-[0.6rem]">Pick Your Criteria</div>
                  <button
                    type="button"
                    onClick={() => { saveCriteria(criteria); setInsightFlipped(false); }}
                    className="text-[10px] px-2 py-1 rounded-full border border-green-600 bg-green-600 text-white hover:bg-green-700"
                  >
                    Done
                  </button>
                </div>
                <div className="text-[0.5rem] text-slate-700 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                        <input type="checkbox" className="align-middle circle-check"
                          checked={!!criteria.use_pp}
                          onChange={(e)=>saveCriteria({ ...criteria, use_pp: e.target.checked })} />
                        <span>Max Purchase Price</span>
                      </label>
                      <input className="border rounded px-2 py-1 text-right crit-input font-semibold"
                        value={criteria.pp_gt}
                        onChange={(e) => saveCriteria({ ...criteria, pp_gt: fmtCurrencyInput(e.target.value) })} />
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                        <input type="checkbox" className="align-middle circle-check"
                          checked={!!criteria.use_invest}
                          onChange={(e)=>saveCriteria({ ...criteria, use_invest: e.target.checked })} />
                          <span>Max Cash to Invest</span>
                      </label>
                      <input className="border rounded px-2 py-1 text-right crit-input font-semibold"
                        value={criteria.invest_under}
                        onChange={(e) => saveCriteria({ ...criteria, invest_under: fmtCurrencyInput(e.target.value) })} />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                        <input type="checkbox" className="align-middle circle-check"
                          checked={!!criteria.use_cf}
                          onChange={(e)=>saveCriteria({ ...criteria, use_cf: e.target.checked })} />
                        <span>Cash Flow at least</span>
                      </label>
                      <input className="border rounded px-2 py-1 text-right crit-input font-semibold"
                        value={criteria.cashflow_min}
                        onChange={(e) => saveCriteria({ ...criteria, cashflow_min: fmtCurrencyInput(e.target.value) })} />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                        <input type="checkbox" className="align-middle circle-check"
                          checked={!!criteria.use_ppsf}
                          onChange={(e)=>saveCriteria({ ...criteria, use_ppsf: e.target.checked })} />
                        <span>Price Per Square Foot under</span>
                      </label>
                      <input className="border rounded px-2 py-1 text-right crit-input font-semibold"
                        value={criteria.ppsf_under}
                        onChange={(e) => saveCriteria({ ...criteria, ppsf_under: fmtCurrencyInput(e.target.value) })} />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                        <input type="checkbox" className="align-middle circle-check"
                          checked={!!criteria.use_onepct}
                          onChange={(e)=>saveCriteria({ ...criteria, use_onepct: e.target.checked })} />
                        <span className="inline-flex items-center gap-1">1% Rule <TooltipInfo text="Monthly rent should be at least 1% of the purchase price." /></span>
                      </label>
                      <div className="crit-gap"></div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                        <input type="checkbox" className="align-middle circle-check"
                          checked={!!criteria.use_twopct}
                          onChange={(e)=>saveCriteria({ ...criteria, use_twopct: e.target.checked })} />
                        <span className="inline-flex items-center gap-1">2% Rule <TooltipInfo text="Monthly rent should be at least 2% of the purchase price." /></span>
                      </label>
                      <div className="crit-gap"></div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-semibold text-[0.55rem] flex items-center gap-2">
                        <input type="checkbox" className="align-middle circle-check"
                          checked={!!criteria.use_50pct}
                          onChange={(e)=>saveCriteria({ ...criteria, use_50pct: e.target.checked })} />
                        <span className="inline-flex items-center gap-1">50% Rule <TooltipInfo text="Rule of thumb: operating expenses should be about 50% of effective income." /></span>
                      </label>
                      <div className="crit-gap"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 p-4">
            <div className="font-semibold text-slate-900 mb-1 text-[0.6rem]">Smart Summary</div>
            <div className="text-[0.5rem] text-slate-700">
              <div className="font-semibold text-slate-900 mb-1 text-[0.6rem]">Returns (Year 1)</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="text-[0.55rem] whitespace-nowrap">Cap Rate</div><div className="text-right font-semibold text-[0.6rem]">{percent(analysis.capRate)}</div>
                <div className="text-[0.55rem] whitespace-nowrap">Cash on Cash Return</div><div className="text-right font-semibold text-[0.6rem]">{percent(analysis.coc)}</div>
                <div className="text-[0.55rem] whitespace-nowrap">Return on Equity</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                  const equity = Number(analysis?.investBreakdown?.downPayment) || 0;
                  const acf = (Number(analysis?.monthlyCashFlow) || 0) * 12;
                  const roe = equity > 0 ? (acf / equity) * 100 : 0;
                  return percent(roe);
                })()}</div>
                <div className="text-[0.55rem] whitespace-nowrap">Return on Investment</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                  const inv = Number(analysis?.investBreakdown?.totalInvestment) || 0;
                  const acf = (Number(analysis?.monthlyCashFlow) || 0) * 12;
                  const roi = inv > 0 ? (acf / inv) * 100 : 0;
                  return percent(roi);
                })()}</div>
              </div>

              <div className="font-semibold text-slate-900 mt-3 mb-1 text-[0.6rem]">Financial Ratios (at purchase)</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="text-[0.55rem] whitespace-nowrap">Rent to Value</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                  const rtv = (Number(inputs?.income?.monthlyRent)||0) * 12 / (Number(inputs?.property?.purchasePrice)||1) * 100;
                  return `${isFinite(rtv) ? rtv.toFixed(2) : '0.00'}%`;
                })()}</div>
                <div className="text-[0.55rem] whitespace-nowrap">Gross Rent Multiplier</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                  const grm = (Number(inputs?.property?.purchasePrice)||0) / ((Number(inputs?.income?.monthlyRent)||0) * 12 || 1);
                  return `${isFinite(grm) ? grm.toFixed(1) : '0.0'}x`;
                })()}</div>
                <div className="text-[0.55rem] whitespace-nowrap">Break Even Ratio</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                  const opex = Number(analysis?.expenses?.operatingMonthly)||0;
                  const ds = Number(analysis?.monthlyPI)||0;
                  const egi = Number(analysis?.income?.effectiveMonthlyIncome)||0;
                  const ber = egi > 0 ? ((opex + ds) / egi) * 100 : 0;
                  return `${isFinite(ber) ? ber.toFixed(0) : '0'}%`;
                })()}</div>
                <div className="text-[0.55rem] whitespace-nowrap">Debt Coverage Ratio</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                  const noi = Number(analysis?.noiAnnual)||0;
                  const ads = (Number(analysis?.monthlyPI)||0) * 12;
                  const dscr = ads > 0 ? (noi / ads) : 0;
                  return isFinite(dscr) ? dscr.toFixed(2) : '0.00';
                })()}</div>
                <div className="text-[0.55rem] whitespace-nowrap">Debt Yield</div><div className="text-right font-semibold text-[0.6rem]">{(() => {
                  const noi = Number(analysis?.noiAnnual)||0;
                  const loan = Number(analysis?.loanAmount)||0;
                  const dy = loan > 0 ? (noi / loan) * 100 : 0;
                  return `${isFinite(dy) ? dy.toFixed(2) : '0.00'}%`;
                })()}</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
            <div className="font-semibold text-slate-900 mb-2 text-[0.78rem]">Loan Details</div>
            {(() => {
              const down = Number(analysis?.investBreakdown?.downPayment) || 0;
              const closeAmt = Number(analysis?.investBreakdown?.closingCostAmount) || 0;
              const ratePct = Number(inputs?.loan?.interestRatePct) || 0;
              const loanAmt = Number(analysis?.loanAmount) || 0;
              const interestAnnual = loanAmt * (ratePct / 100);
              const total = down + closeAmt + interestAnnual;
              const downLabel = inputs?.property?.allCash ? 'All Cash' : 'Down Payment';
              return (
                <div className="text-[0.7rem] text-slate-700 space-y-1">
                  <div className="flex justify-between"><span>{downLabel}</span><span className="font-semibold text-slate-900">{currency(down)}</span></div>
                  {(!inputs?.property?.allCash && interestAnnual > 0) && (
                    <div className="flex justify-between"><span>Interest Rate</span><span className="font-semibold text-slate-900">{currency(interestAnnual)}</span></div>
                  )}
                  <div className="flex justify-between"><span>Closing Cost</span><span className="font-semibold text-slate-900">{currency(closeAmt)}</span></div>
                  <hr className="my-2 border-violet-200" />
                  <div className="flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-slate-900">{currency(total)}</span></div>
                </div>
              );
            })()}
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold text-slate-900 text-[0.78rem]">Expense Summary ({expMode === 'A' ? 'Annual' : 'Monthly'})</div>
              <button
                type="button"
                onClick={() => setExpMode((m) => (m === 'M' ? 'A' : 'M'))}
                title="Toggle Monthly/Annual"
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border transition-colors ${expMode === 'A' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-slate-700 border-slate-200'}`}
              >
                M/A
              </button>
            </div>
            <div className="text-[0.7rem] text-slate-700 space-y-1">
              <div className="flex justify-between"><span>Closing Cost</span><span className="font-semibold text-slate-900">{currency(analysis.investBreakdown.closingCostAmount)}</span></div>
              <div className="flex justify-between"><span>Loan Payment</span><span className="font-semibold text-slate-900">{currency((isFinite(analysis.monthlyPI) ? analysis.monthlyPI : 0) * factor)}{expMode==='M' ? ' /mo' : ''}</span></div>
              <div className="flex justify-between"><span>Operating Expense</span><span className="font-semibold text-slate-900">{currency((isFinite(analysis.expenses.operatingMonthly) ? analysis.expenses.operatingMonthly : 0) * factor)}{expMode==='M' ? ' /mo' : ''}</span></div>
              <hr className="my-2 border-emerald-200" />
              <div className="flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-slate-900">{currency((isFinite(analysis.investBreakdown.closingCostAmount) ? analysis.investBreakdown.closingCostAmount : 0) + ((isFinite(analysis.monthlyPI) ? analysis.monthlyPI : 0) * factor) + ((isFinite(analysis.expenses.operatingMonthly) ? analysis.expenses.operatingMonthly : 0) * factor))}</span></div>
            </div>
          </div>
        </div>
      </div>
      )}

      
    </div>
  );
}



