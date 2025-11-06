import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";

export default function ComparisonChart({ series, breakEven }) {
  if (!series) return null;
  const data = (series.lease || []).map((v, i) => ({ month: i, lease: Math.round(v), buy: Math.round(series.buy?.[i] ?? 0) }));
  return (
    <div className="bg-bg-surface rounded-lg shadow-card p-6">
      <h2 className="text-xl font-semibold mb-4">Cumulative Cost Over Time</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 8, top: 12, bottom: 8 }}>
            <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="lease" stroke="#f59e0b" dot={false} strokeWidth={2} name="Lease" />
            <Line type="monotone" dataKey="buy" stroke="#10b981" dot={false} strokeWidth={2} name="Buy" />
            {breakEven != null && <ReferenceLine x={breakEven} stroke="#14b8a6" strokeDasharray="4 4" />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
