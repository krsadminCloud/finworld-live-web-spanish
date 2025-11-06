import React from "react";
import DepreciationChart from "./DepreciationChart";

function formatCurrency(n) {
  return `$${Math.round(Number(n || 0)).toLocaleString()}`;
}

export default function DepreciationPanel({ scenario, results }) {
  const vehiclePrice = Number(scenario?.vehiclePrice || 0);
  const years = Number(scenario?.ownershipYears || 0);
  const dep = results?.depreciation || {};
  const mode = scenario?.depreciation?.mode || "simple";

  const avgMonthly = Array.isArray(dep.curve) && dep.curve.length > 1
    ? Math.max(0, (vehiclePrice - dep.curve[dep.curve.length - 1]) / (dep.curve.length - 1))
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-neutral-200 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Start value" value={formatCurrency(vehiclePrice)} />
          <Stat label="End value" value={formatCurrency(dep.endValue)} />
          <Stat label="Total depreciation" value={formatCurrency(dep.valueLost)} />
          <Stat label="Avg monthly dep." value={formatCurrency(avgMonthly)} />
        </div>
        <div className="text-xs text-neutral-500 mt-3">
          Method: {mode === "schedule" ? "Yearly drops schedule" : "Simple to final %"}
          {mode === "simple" && scenario?.depreciation?.finalPercent != null && (
            <> (final {Math.max(0, Math.min(100, Number(scenario.depreciation.finalPercent)))}%)</>
          )}
        </div>
      </div>

      <DepreciationChart curve={dep.curve} />

      {Array.isArray(dep.yearly) && dep.yearly.length > 0 && (
        <div className="bg-white rounded-lg shadow-card p-6 border border-neutral-200">
          <h2 className="text-xl font-semibold mb-4 text-neutral-900">Yearly Depreciation Schedule</h2>
          <div className="overflow-auto border border-primary-200 rounded-lg">
            <table className="min-w-full text-sm text-neutral-800">
              <thead className="bg-primary-50">
                <tr>
                  <Th>Year</Th>
                  <Th align="right">Opening Book</Th>
                  <Th align="right">Depreciation</Th>
                  <Th align="right">Closing Book</Th>
                </tr>
              </thead>
              <tbody>
                {dep.yearly.map((r) => (
                  <tr key={r.year} className="odd:bg-white even:bg-primary-50/40">
                    <Td>{r.year}</Td>
                    <Td align="right">{formatCurrency(r.opening)}</Td>
                    <Td align="right">{formatCurrency(r.depreciation)}</Td>
                    <Td align="right">{formatCurrency(r.closing)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-neutral-600 mt-3">Ownership period: {years} year{years === 1 ? "" : "s"}</div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="p-3 border border-neutral-200 rounded-md bg-white">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-lg font-semibold text-neutral-800">{value}</div>
    </div>
  );
}

function Th({ children, align }) {
  const a = align === "right" ? "text-right" : "text-left";
  return <th className={`px-3 py-2 font-semibold text-primary-700 ${a}`}>{children}</th>;
}
function Td({ children, align }) {
  const a = align === "right" ? "text-right" : "text-left";
  return <td className={`px-3 py-2 text-neutral-900 ${a}`}>{children}</td>;
}
