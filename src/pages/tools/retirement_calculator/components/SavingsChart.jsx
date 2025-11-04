import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function SavingsChart({ data, formatCurrency }) {
  return (
    <div className="bg-bg-surface rounded-lg shadow-md p-6 card-hover">
      <h3 className="text-lg font-semibold mb-4">Projected Balance to Retirement</h3>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#697586' }} />
            <YAxis tick={{ fontSize: 12, fill: '#697586' }} tickFormatter={(v) => formatCurrency(v)} width={80} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="nominal" name="Balance (Nominal)" stroke="#00C1B0" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="real" name="Balance (Real)" stroke="#697586" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
