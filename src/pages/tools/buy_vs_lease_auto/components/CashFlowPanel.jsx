import React, { useMemo } from "react";
import CashFlowChart from "./CashFlowChart";

function formatCurrency(n) {
  const s = Math.round(Number(n || 0));
  const sign = s < 0 ? "-" : "";
  return `${sign}$${Math.abs(s).toLocaleString()}`;
}

function toMonthly(series) {
  if (!Array.isArray(series) || series.length === 0) return [];
  const m = new Array(series.length).fill(0);
  for (let i = 1; i < series.length; i++) m[i] = (series[i] || 0) - (series[i - 1] || 0);
  return m;
}

export default function CashFlowPanel({ results }) {
  const leaseCum = results?.series?.lease || [];
  const buyCum = results?.series?.buy || [];
  const monthlyLease = useMemo(() => toMonthly(leaseCum), [leaseCum]);
  const monthlyBuy = useMemo(() => toMonthly(buyCum), [buyCum]);

  const peakL = useMemo(() => {
    let v = -Infinity, m = 0;
    for (let i = 1; i < monthlyLease.length; i++) if (monthlyLease[i] > v) { v = monthlyLease[i]; m = i; }
    return { m, v: Math.round(v || 0) };
  }, [monthlyLease]);
  const peakB = useMemo(() => {
    let v = -Infinity, m = 0;
    for (let i = 1; i < monthlyBuy.length; i++) if (monthlyBuy[i] > v) { v = monthlyBuy[i]; m = i; }
    return { m, v: Math.round(v || 0) };
  }, [monthlyBuy]);

  const next90Lease = useMemo(() => Math.round(monthlyLease.slice(1, Math.min(4, monthlyLease.length)).reduce((a, b) => a + b, 0)), [monthlyLease]);
  const next90Buy = useMemo(() => Math.round(monthlyBuy.slice(1, Math.min(4, monthlyBuy.length)).reduce((a, b) => a + b, 0)), [monthlyBuy]);

  const endL = monthlyLease[monthlyLease.length - 1] || 0;
  const endB = monthlyBuy[monthlyBuy.length - 1] || 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-neutral-200 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat label="Peak monthly outflow" value={`Lease ${formatCurrency(peakL.v)} (m${peakL.m}) • Buy ${formatCurrency(peakB.v)} (m${peakB.m})`} />
          <Stat label="Next 90 days cash" value={`Lease ${formatCurrency(next90Lease)} • Buy ${formatCurrency(next90Buy)}`} />
          <Stat label="End-of-term cash" value={`Lease ${formatCurrency(endL)} • Buy ${formatCurrency(endB)}`} />
        </div>
      </div>

      <CashFlowChart monthlyLease={monthlyLease} monthlyBuy={monthlyBuy} breakEven={results?.comparison?.breakEvenMonth} />

      <div className="bg-white rounded-lg shadow-card p-6 border border-neutral-200">
        <h2 className="text-xl font-semibold mb-4 text-neutral-900">Cash Flow Preview</h2>
        <div className="overflow-auto border border-primary-200 rounded-lg">
          <table className="min-w-full text-sm text-neutral-800">
            <thead className="bg-primary-50">
              <tr>
                <Th>Month</Th>
                <Th align="right">Lease</Th>
                <Th align="right">Buy</Th>
                <Th align="right">Delta (Buy − Lease)</Th>
                <Th align="right">Cumulative Delta</Th>
              </tr>
            </thead>
            <tbody>
              {buildPreviewRows(monthlyLease, monthlyBuy).map((r) => (
                <tr key={r.month} className="odd:bg-white even:bg-primary-50/40">
                  <Td>{r.month}</Td>
                  <Td align="right">{formatCurrency(r.lease)}</Td>
                  <Td align="right">{formatCurrency(r.buy)}</Td>
                  <Td align="right">{formatCurrency(r.delta)}</Td>
                  <Td align="right">{formatCurrency(r.cum)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-neutral-600 mt-3">Preview shows key months; full schedule available in detail view.</div>
      </div>
    </div>
  );
}

function buildPreviewRows(mL, mB) {
  const n = Math.min(mL.length, mB.length) - 1;
  if (n <= 0) return [];
  const picks = [1, 2, 3, 12, 24, n].filter((x, i, a) => x >= 1 && x <= n && a.indexOf(x) === i);
  const rows = [];
  let cum = 0;
  for (const m of picks) {
    const lease = Math.round(mL[m] || 0);
    const buy = Math.round(mB[m] || 0);
    const delta = buy - lease;
    cum += delta;
    rows.push({ month: m, lease, buy, delta, cum });
  }
  return rows;
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

