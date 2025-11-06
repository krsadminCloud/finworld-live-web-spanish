import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import formatCurrency from '../../../../utils/formatCurrency';

const formatTickCurrency = (v) => {
  try { return formatCurrency(v); } catch { return `$${v}`; }
};

export default function GrowthChart({ data = [], granularity = 'yearly', palette = { primary: '#00C1B0', secondary1: '#93C5FD', secondary2: '#F59E0B' } }) {
  const [show, setShow] = useState({ balance: true, contrib: true, interest: true });
  const toggle = (k) => setShow(s => ({ ...s, [k]: !s[k] }));
  let cumC = 0, cumI = 0;
  const chartData = data.map((row, idx) => {
    cumC += (row.cumContribution !== undefined ? (idx===0 ? row.cumContribution : row.cumContribution - (data[idx-1].cumContribution||0)) : row.contribution || 0);
    cumI += (row.cumInterest !== undefined ? (idx===0 ? row.cumInterest : row.cumInterest - (data[idx-1].cumInterest||0)) : row.interest || 0);
    return {
      name: granularity === 'monthly' ? `M${idx+1}` : `Y${idx+1}`,
      Balance: row.balance,
      'Contributions Accumulated': row.cumContribution ?? cumC,
      'Interest Accrued': row.cumInterest ?? cumI,
    };
  });

  const CustomLegend = () => (
    <div className="flex flex-wrap gap-4 text-sm mt-2">
      <LegendItem color={palette.primary} active={show.balance} label="Balance" onClick={() => toggle('balance')} />
      <LegendItem color={palette.secondary1} active={show.contrib} label="Contributions" onClick={() => toggle('contrib')} />
      <LegendItem color={palette.secondary2} active={show.interest} label="Interest" onClick={() => toggle('interest')} />
    </div>
  );

  return (
    <div className="bg-bg-surface rounded-lg boxShadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-neutral-900">Growth Chart</h2>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => toggle('balance')}
            className={`px-3 py-1.5 rounded-full border-2 transition-colors ${show.balance ? 'text-white' : 'text-teal-600'} `}
            style={{ borderColor: palette.primary, backgroundColor: show.balance ? palette.primary : 'transparent' }}
          >
            Balance
          </button>
          <button
            onClick={() => toggle('contrib')}
            className={`px-3 py-1.5 rounded-full border-2 transition-colors ${show.contrib ? 'text-white' : 'text-sky-600'}`}
            style={{ borderColor: palette.secondary1, backgroundColor: show.contrib ? palette.secondary1 : 'transparent' }}
          >
            Contrib
          </button>
          <button
            onClick={() => toggle('interest')}
            className={`px-3 py-1.5 rounded-full border-2 transition-colors ${show.interest ? 'text-white' : 'text-amber-600'}`}
            style={{ borderColor: palette.secondary2, backgroundColor: show.interest ? palette.secondary2 : 'transparent' }}
          >
            Interest
          </button>
        </div>
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={v => formatTickCurrency(v)} width={90} />
            <Tooltip formatter={(v) => formatTickCurrency(v)} />
            <Legend content={<CustomLegend />} />
            {show.balance && (<Line type="monotone" dataKey="Balance" stroke={palette.primary} strokeWidth={2} dot={false} />)}
            {show.contrib && (<Line type="monotone" dataKey="Contributions Accumulated" stroke={palette.secondary1} strokeWidth={2} dot={false} />)}
            {show.interest && (<Line type="monotone" dataKey="Interest Accrued" stroke={palette.secondary2} strokeWidth={2} dot={false} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LegendItem({ color, active, label, onClick }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 focus:outline-none" style={{ color, opacity: active ? 1 : 0.5 }}>
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="underline decoration-current decoration-2 underline-offset-4">{label}</span>
    </button>
  );
}
