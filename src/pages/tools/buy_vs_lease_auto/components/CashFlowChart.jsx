import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";

function formatCurrency(n) {
  const s = Math.round(Number(n || 0));
  const sign = s < 0 ? "-" : "";
  return `${sign}$${Math.abs(s).toLocaleString()}`;
}

export default function CashFlowChart({ monthlyLease, monthlyBuy, breakEven, maxMonths = 24 }) {
  if (!monthlyLease || !monthlyBuy) return null;
  const n = Math.min(maxMonths, Math.min(monthlyLease.length, monthlyBuy.length) - 1);
  const data = Array.from({ length: n }, (_, i) => {
    const m = i + 1; // months start at 1
    return { month: m, Lease: Math.round(monthlyLease[m] || 0), Buy: Math.round(monthlyBuy[m] || 0) };
  });
  return (
    <div className="bg-bg-surface rounded-lg shadow-card p-6">
      <h2 className="text-xl font-semibold mb-4 text-neutral-900">Monthly Cash Outflow (first {n} months)</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 8, top: 16, bottom: 8 }}>
            <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v, name) => [formatCurrency(v), name]} labelFormatter={(l) => `Month ${l}`} contentStyle={{ fontSize: 12 }} />
            <Legend />
            <ReferenceLine y={0} stroke="#9CA3AF" />
            <Bar dataKey="Lease" fill="#f59e0b" />
            <Bar dataKey="Buy" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

