import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceDot, Area } from "recharts";

function formatCurrency(n) {
  return `$${Math.round(Number(n || 0)).toLocaleString()}`;
}

export default function ComparisonChart({ series, breakEven }) {
  if (!series) return null;
  const data = (series.lease || []).map((v, i) => {
    const lease = Math.round(v);
    const buy = Math.round(series.buy?.[i] ?? 0);
    const lower = Math.min(lease, buy);
    const upper = Math.max(lease, buy);
    const gap = Math.max(0, upper - lower);
    return { month: i, lease, buy, lower, gap };
  });
  return (
    <div className="bg-bg-surface rounded-lg shadow-card p-6">
      <h2 className="text-xl font-semibold mb-4">Cumulative Cost Over Time</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 8, top: 36, bottom: 8 }}>
            <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(v, name) => [formatCurrency(v), name === 'gap' ? 'Difference' : name.charAt(0).toUpperCase() + name.slice(1)]}
              labelFormatter={(label) => `Month ${label}`}
              contentStyle={{ fontSize: 12 }}
              filterNull={true}
            />
            <Legend />
            {/* Shaded gap between lines: stack lower (transparent) + gap */}
            <Area type="monotone" dataKey="lower" stackId="gap" strokeOpacity={0} fillOpacity={0} isAnimationActive={false} />
            <Area type="monotone" dataKey="gap" stackId="gap" strokeOpacity={0} fill="rgba(20,184,166,0.15)" isAnimationActive={false} />
            <Line type="monotone" dataKey="lease" stroke="#f59e0b" dot={false} strokeWidth={2} name="Lease" />
            <Line type="monotone" dataKey="buy" stroke="#10b981" dot={false} strokeWidth={2} name="Buy" />
            {breakEven != null && (
              <>
                <ReferenceLine x={breakEven} stroke="#14b8a6" strokeDasharray="4 4" label={{ value: 'Break-even', position: 'insideTop', fill: '#14b8a6', fontSize: 12 }} />
                {data[breakEven] && (
                  <ReferenceDot x={breakEven} y={Math.min(data[breakEven].lease, data[breakEven].buy) + data[breakEven].gap} r={4} fill="#14b8a6" stroke="none" />
                )}
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
