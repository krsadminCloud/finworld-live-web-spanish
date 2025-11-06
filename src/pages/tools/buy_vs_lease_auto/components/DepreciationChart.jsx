import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceDot } from "recharts";

function formatCurrency(n) {
  return `$${Math.round(Number(n || 0)).toLocaleString()}`;
}

export default function DepreciationChart({ curve }) {
  if (!Array.isArray(curve) || curve.length === 0) return null;
  const data = curve.map((v, i) => ({ month: i, book: Math.round(v) }));
  const end = data[data.length - 1];
  return (
    <div className="bg-bg-surface rounded-lg shadow-card p-6">
      <h2 className="text-xl font-semibold mb-4 text-neutral-900">Book Value Over Time</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 8, top: 20, bottom: 8 }}>
            <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => formatCurrency(v)} labelFormatter={(l) => `Month ${l}`} contentStyle={{ fontSize: 12 }} />
            <Legend />
            <Line type="monotone" dataKey="book" stroke="#14b8a6" dot={false} strokeWidth={2} name="Book value" />
            {end && <ReferenceDot x={end.month} y={end.book} r={4} fill="#14b8a6" stroke="none" />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
