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
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPI label="Monthly Cash Flow" value={currency(analysis.monthlyCashFlow)} />
        <KPI label="Cash-on-Cash Return" value={percent(analysis.coc)} />
        <KPI label="Cap Rate" value={percent(analysis.capRate)} />
        <KPI label="Total Investment" value={currency(analysis.investBreakdown.totalInvestment)} />
        <KPI label="ROI Over 5 Years" value={percent(analysis.roi5)} />
      </div>
    </div>
  );
}

