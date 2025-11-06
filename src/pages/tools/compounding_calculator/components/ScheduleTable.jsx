import React from 'react';
import formatCurrency from '../../../../utils/formatCurrency';

export default function ScheduleTable({ schedule, onExportPdf, onExportPng, granularity }) {
  const rows = schedule?.rows || [];
  const capped = schedule?.meta?.capped;
  const requested = schedule?.meta?.stepsRequested;
  const generated = schedule?.meta?.stepsGenerated;
  const exportCsv = () => {
    const header = ['Period','Contribution','Interest','Balance','Cumulative Contribution','Cumulative Interest'];
    const lines = [header.join(',')];
    rows.forEach(r => {
      lines.push([r.period, r.contribution ?? 0, r.interest ?? 0, r.balance ?? 0, r.cumContribution ?? r.cumContribution ?? 0, r.cumInterest ?? 0].join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'compounding_schedule.csv'; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="bg-bg-surface rounded-lg boxShadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-neutral-900">{granularity === 'monthly' ? 'Monthly' : 'Yearly'} Breakdown</h2>
        <div className="flex items-center gap-2">
          <button onClick={onExportPdf} className="px-3 py-2 bg-neutral-900 text-white rounded-md text-sm">Export PDF</button>
          <button onClick={onExportPng} className="px-3 py-2 bg-primary-500 text-white rounded-md text-sm">Export PNG</button>
          <button onClick={exportCsv} className="px-3 py-2 bg-neutral-100 rounded-md text-sm">CSV</button>
        </div>
      </div>
      {capped && (
        <div className="mb-3 text-xs text-neutral-500">Monthly view capped to first {generated} periods out of {requested}. Switch to Yearly for full range.</div>
      )}
      <div className="overflow-auto max-h-[480px] border border-neutral-200 rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 sticky top-0">
            <tr>
              <th className="text-left p-3">Period</th>
              <th className="text-right p-3">Contribution</th>
              <th className="text-right p-3">Interest</th>
              <th className="text-right p-3">Balance</th>
              <th className="text-right p-3">Cum. Contribution</th>
              <th className="text-right p-3">Cum. Interest</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.period} className="border-t">
                <td className="p-3">{r.period}</td>
                <td className="p-3 text-right">{formatCurrency(r.contribution || 0)}</td>
                <td className="p-3 text-right">{formatCurrency(r.interest || 0)}</td>
                <td className="p-3 text-right font-medium">{formatCurrency(r.balance || 0)}</td>
                <td className="p-3 text-right">{formatCurrency(r.cumContribution || 0)}</td>
                <td className="p-3 text-right">{formatCurrency(r.cumInterest || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
