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
    <div className="flex flex-wrap gap-3 text-xs">
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
          <button onClick={() => toggle('balance')} className={`px-2 py-1 rounded-md border ${show.balance? 'bg-neutral-900 text-white border-neutral-900':'bg-neutral-100'}`}>Balance</button>
          <button onClick={() => toggle('contrib')} className={`px-2 py-1 rounded-md border ${show.contrib? 'bg-neutral-900 text-white border-neutral-900':'bg-neutral-100'}`}>Contrib</button>
          <button onClick={() => toggle('interest')} className={`px-2 py-1 rounded-md border ${show.interest? 'bg-neutral-900 text-white border-neutral-900':'bg-neutral-100'}`}>Interest</button>
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
    <button onClick={onClick} className={`inline-flex items-center gap-1 px-2 py-1 rounded border ${active? 'bg-neutral-900 text-white border-neutral-900':'bg-neutral-100'}`}>
      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </button>
  );
}
