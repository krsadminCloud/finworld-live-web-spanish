import React from "react";

export default function ScheduleTable({ series }) {
  if (!series) return null;
  const rows = (series.lease || []).map((v, i) => ({ month: i, lease: v, buy: series.buy?.[i] ?? 0 }));

  return (
    <div className="bg-bg-surface rounded-lg shadow-card p-6">
      <h2 className="text-xl font-semibold mb-4">Monthly Comparison Table</h2>
      <div className="max-h-80 overflow-auto border border-neutral-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 sticky top-0">
            <tr>
              <Th>Month</Th>
              <Th>Lease Cumulative</Th>
              <Th>Buy Cumulative</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.month} className="odd:bg-white even:bg-neutral-50">
                <Td>{r.month}</Td>
                <Td>${Math.round(r.lease).toLocaleString()}</Td>
                <Td>${Math.round(r.buy).toLocaleString()}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th className="text-left px-3 py-2 font-semibold text-neutral-700 dark:text-neutral-200">{children}</th>;
}
function Td({ children }) {
  return <td className="px-3 py-2 text-neutral-800 dark:text-neutral-200">{children}</td>;
}
