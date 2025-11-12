import React from 'react';
// Note: requires `recharts` dependency installed in the host app
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

export default function Charts({ roiSeries, analysis, show = 'both' }) {
  const effective = Math.max(0, Number(analysis?.income?.effectiveMonthlyIncome) || 0);
  const gross = Math.max(0, (Number(analysis?.income?.grossMonthlyIncome) || (effective + (Number(analysis?.income?.vacancyMonthly) || 0))));
  const operating = Math.max(0, Number(analysis?.expenses?.operatingMonthly) || 0);
  const cashFlowData = [
    { name: 'Income', value: gross },
    { name: 'Expenses', value: operating },
    { name: 'Mortgage', value: Math.max(0, analysis.monthlyPI) },
    { name: 'Net', value: Math.max(0, analysis.monthlyCashFlow) },
  ];

  const pieData = [
    { name: 'Income', value: gross, color: '#12B76A' },
    { name: 'Expenses', value: operating, color: '#FCA5A5' },
    { name: 'Mortgage', value: Math.max(0, analysis.monthlyPI), color: '#C4B5FD' },
  ];
  const total = pieData.reduce((s, d) => s + d.value, 0);
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0];
      const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0.0';
      return (
        <div className="bg-bg-surface p-3 rounded-lg shadow-lg border border-neutral-200">
          <p className="text-sm font-medium">{d.name}</p>
          <p className="text-lg font-bold text-primary-500">
            {d.value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-neutral-400">{pct}% of total</p>
        </div>
      );
    }
    return null;
  };

  const CustomSliceLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RAD = Math.PI / 180;
    const r = (innerRadius + outerRadius) / 2; // center of the ring
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    if (percent < 0.08) return null; // hide tiny slices
    return (
      <text x={x} y={y} fill="#FFFFFF" textAnchor="middle" dominantBaseline="central" className="text-sm font-semibold tracking-tight">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const containerClass = show === 'both' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : '';
  return (
    <div className={containerClass}>
      {show !== 'cash' && (
      <motion.div
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
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
      </motion.div>
      )}
      {show !== 'roi' && (
      <motion.div
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-md w-full"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h4 className="font-semibold text-slate-900 mb-2">Monthly Cash Flow Breakdown</h4>
        <div className="h-72 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="30%"
                cy="50%"
                innerRadius={56}
                outerRadius={108}
                paddingAngle={1}
                dataKey="value"
                isAnimationActive
                animationDuration={750}
                animationEasing="ease-in-out"
                labelLine={false}
                label={CustomSliceLabel}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              {/* Pin tooltip to bottom-left corner of chart area */}
              <Tooltip content={<CustomTooltip />} offset={0} position={{ x: 20, y: 220 }} wrapperStyle={{ pointerEvents: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
          <div
            className="absolute pointer-events-none"
            style={{ left: '30%', top: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <div className="text-center leading-tight">
              {(() => {
                const gross = Math.max(0, (Number(analysis?.income?.grossMonthlyIncome) || ((Number(analysis?.income?.effectiveMonthlyIncome)||0) + (Number(analysis?.income?.vacancyMonthly)||0))));
                const operating = Math.max(0, Number(analysis?.expenses?.operatingMonthly) || 0);
                const net = gross - operating - (Number(analysis?.monthlyPI) || 0);
                const cls = net >= 0 ? 'text-semantic-success' : 'text-semantic-error';
                return (
                  <p className={`text-xl font-bold ${cls}`}>
                    {Math.abs(net).toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                  </p>
                );
              })()}
              <p className="text-xs text-slate-500 mt-0.5">Net Income</p>
            </div>
          </div>
          <div className="absolute right-4 top-4 space-y-2">
            {pieData.map((d, idx) => (
              <motion.div
                key={d.name}
                className="flex items-center justify-between gap-3 bg-neutral-50 rounded-lg px-3 py-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-sm font-medium text-neutral-900">{d.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-neutral-900">{d.value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</div>
                  <div className="text-xs text-neutral-400">{total > 0 ? ((d.value / total) * 100).toFixed(1) : '0.0'}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      )}
    </div>
  );
}
