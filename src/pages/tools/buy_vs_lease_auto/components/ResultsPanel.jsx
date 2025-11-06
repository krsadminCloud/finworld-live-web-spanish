import React from "react";

export default function ResultsPanel({ results, cheaperText }) {
  if (!results) return null;
  return (
    <div className="bg-bg-surface rounded-lg shadow-card p-6">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Tile title="Lease total" value={`$${results.lease.totalCost.toLocaleString()}`} subtitle={`${results.lease.termsCount} term(s)`} />
        <Tile title="Buy total" value={`$${results.buy.totalCost.toLocaleString()}`} subtitle={`${results.ownershipMonths} months`} />
        <Tile title="Depreciation end value" value={`$${Math.round(results.depreciation.endValue).toLocaleString()}`} subtitle={`Lost $${Math.round(results.depreciation.valueLost).toLocaleString()}`} />
      </div>
      <p className="mt-4 text-base text-neutral-700 dark:text-neutral-300">{cheaperText}</p>
    </div>
  );
}

function Tile({ title, value, subtitle }) {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <div className="text-xs text-neutral-500 mt-1">{subtitle}</div>}
    </div>
  );
}
