import React from 'react';

function KPI({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-slate-500 text-sm">{label}</div>
      <div className="mt-1 text-slate-900 text-2xl font-semibold">{value}</div>
      {hint ? <div className="text-slate-400 text-xs mt-1">{hint}</div> : null}
    </div>
  );
}

export default function ResultsSummary({ analysis }) {
  const currency = (n) => (isFinite(n) ? n : 0).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const percent = (n) => `${isFinite(n) ? n.toFixed(1) : '0.0'}%`;

  return (
    <div className="rounded-xl bg-primary-100 border border-primary-500/20">
      <div className="border-b border-primary-500/20 bg-primary-700 text-white rounded-t-xl p-4">
        <h3 className="text-lg font-semibold">Analysis Summary</h3>
        <p className="text-sm opacity-90">Key KPIs for this property</p>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <KPI label="Monthly Cash Flow" value={currency(analysis.monthlyCashFlow)} />
        <KPI label="Cash-on-Cash Return" value={percent(analysis.coc)} />
        <KPI label="Cap Rate" value={percent(analysis.capRate)} />
        <KPI label="Total Investment" value={currency(analysis.investBreakdown.totalInvestment)} />
        <KPI label="Closing Costs" value={currency(analysis.investBreakdown.closingCostAmount)} hint="Computed from purchase price × %" />
        <KPI label="ROI Over 5 Years" value={percent(analysis.roi5)} />
        <KPI label="Total Expenses" value={currency(analysis.expenses.operatingMonthly)} hint="Operating expenses per month" />
      </div>

      {/* Analytics & Insights */}
      <div className="px-4 pb-4">
        <h4 className="text-base font-semibold text-slate-800 mb-2">Analytics & Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
            <div className="font-semibold text-slate-900 mb-1">Performance vs Savings</div>
            <p className="text-sm text-slate-700">
              Beats a typical 3% savings by about {(() => {
                const alt = 3; // baseline APR
                const lift = (isFinite(analysis.coc) ? analysis.coc : 0) / alt;
                return `${Number.isFinite(lift) ? lift.toFixed(1) : '0.0'}x`;
              })()} at your current settings.
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="font-semibold text-slate-900 mb-1">10-Year Advantage</div>
            <p className="text-sm text-slate-700">
              In 10 years, with current cash flow and amortization, your ROI trajectory suggests about {percent(analysis.roi5)} by year 5; compounding trends indicate continued gains by year 10.
            </p>
          </div>
          <div className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 p-4">
            <div className="font-semibold text-slate-900 mb-1">Smart Summary</div>
            <p className="text-sm text-slate-700">
              With net monthly cash flow of {currency(Math.round(analysis.monthlyCashFlow))} and cap rate of {percent(analysis.capRate)},
              your total investment of {currency(Math.round(analysis.investBreakdown.totalInvestment))} targets a cash-on-cash of {percent(analysis.coc)}.
            </p>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
            <div className="font-semibold text-slate-900 mb-1">Total Expenses</div>
            <p className="text-sm text-slate-700">
              Operating costs are {currency(analysis.expenses.operatingMonthly)} /mo
              {` (`}
              {currency(analysis.expenses.operatingMonthly * 12)} annual{`)`}
              .
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="font-semibold text-slate-900 mb-1">Custom Expenses</div>
            <p className="text-sm text-slate-700">
              Additional custom expenses total {currency(analysis?.expenses?.customMonthly || 0)} /mo
              {` (`}{currency((analysis?.expenses?.customMonthly || 0) * 12)} annual{`)`}.
            </p>
          </div>
        </div>
      </div>

      {/* Investment Details */}
      <div className="px-4 pb-5">
        <h4 className="text-base font-semibold text-slate-800 mb-2">Investment Details</h4>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Down Payment</span><span className="font-semibold text-slate-900">{currency(analysis.investBreakdown.downPayment)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Points</span><span className="font-semibold text-slate-900">{currency(analysis.investBreakdown.points)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Closing Costs</span><span className="font-semibold text-slate-900">{currency(analysis.investBreakdown.closingCostAmount)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Total Investment</span><span className="font-semibold text-slate-900">{currency(analysis.investBreakdown.totalInvestment)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
