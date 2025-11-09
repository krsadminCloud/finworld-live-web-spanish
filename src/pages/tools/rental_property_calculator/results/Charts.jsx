import React from 'react';
// Note: requires `recharts` dependency installed in the host app
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from 'recharts';

export default function Charts({ roiSeries, analysis }) {
  const cashFlowData = [
    { name: 'Income', value: Math.max(0, analysis.income.effectiveMonthlyIncome) },
    { name: 'Operating', value: Math.max(0, analysis.expenses.operatingMonthly) },
    { name: 'Mortgage', value: Math.max(0, analysis.monthlyPI) },
    { name: 'Net', value: Math.max(0, analysis.monthlyCashFlow) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-md">
        <h4 className="font-semibold text-slate-900 mb-2">ROI Growth Over Time</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={roiSeries} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tickFormatter={(y) => `${y}y`} />
              <YAxis tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => [`${v.toFixed(1)}%`, 'ROI']} labelFormatter={(l) => `Year ${l}`} />
              <Legend />
              <Line type="monotone" dataKey="roiPct" name="ROI %" stroke="#008A7E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-md">
        <h4 className="font-semibold text-slate-900 mb-2">Monthly Cash Flow Breakdown</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlowData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => v.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} />
              <Bar dataKey="value" fill="#00C1B0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

