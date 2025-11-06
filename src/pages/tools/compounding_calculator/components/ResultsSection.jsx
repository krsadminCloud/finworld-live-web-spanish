import React from 'react';
import GrowthChart from './GrowthChart';
import ScheduleTable from './ScheduleTable';
import { calculateAll, formatYearsMonths } from '../utils/calc';
import formatCurrency from '../../../../utils/formatCurrency';
import { DollarSign, Coins, PiggyBank, Percent, TrendingUp, Clock, HelpCircle, Gauge } from 'lucide-react';

export default function ResultsSection({ results, granularity, setGranularity, scheduleRef, palette }) {
  if (!results) return null;
  const { outputs, schedule } = results;
  const t = formatYearsMonths(outputs.timeToDoubleYears);

  const handleExportPdf = async () => {
    const [{ default: jsPDF }, autoTable] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable').then(m => ({ default: m.default }))
    ]);
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    doc.text('Compounding Calculator Report', 40, 40);
    doc.setFontSize(11);
    doc.text(`Future Value: ${formatCurrency(outputs.futureValue)}`, 40, 70);
    doc.text(`Total Interest: ${formatCurrency(outputs.totalInterest)}`, 40, 85);
    doc.text(`Effective Annual Yield: ${(outputs.effectiveAnnualYield*100).toFixed(2)}%`, 40, 100);
    doc.text(`Time to Double: ${t.years === Infinity ? 'N/A' : `${t.years}y ${t.months}m`}`, 40, 115);

    const body = schedule.rows.map(r => [r.period, formatCurrency(r.contribution||0), formatCurrency(r.interest||0), formatCurrency(r.balance||0)]);
    autoTable.default(doc, {
      startY: 140,
      head: [['Period','Contribution','Interest','Balance']],
      body,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0,193,176] },
    });
    doc.save('compounding_report.pdf');
  }

  const handleExportPng = async () => {
    if (!scheduleRef?.current) return;
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(scheduleRef.current);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'compounding_schedule.png';
    link.click();
  }

  return (
    <div className="space-y-6">
      {/* Metric badges */}
      <div className="bg-bg-surface rounded-lg boxShadow-md p-6">
        <div className="text-center p-8 bg-teal-500 rounded-lg mb-4">
          <p className="text-sm font-bold text-white mb-2">END BALANCE</p>
          <div className="text-6xl font-bold text-white">{formatCurrency(outputs.futureValue)}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-4">
          <SummaryBadge palette={palette} title="Total Invested" primary={formatCurrency(outputs.totalContributions)} className="border border-sky-200 bg-sky-50" />
          <SummaryBadge palette={palette} title="Interest Earned" primary={formatCurrency(outputs.totalInterest)} className="border border-sky-200 bg-sky-50" />
        </div>
        <div className="bg-neutral-50 rounded-lg boxShadow-md p-6">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">METRICS</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Initial Investment:</span>
              <span className="font-bold text-neutral-900">{formatCurrency(outputs.initialInvestment)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Effective Annual Yield:</span>
              <span className="font-bold text-neutral-900">{(outputs.effectiveAnnualYield*100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">CAGR:</span>
              <span className="font-bold text-neutral-900">{(outputs.compoundedRateEffective*100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Gain %:</span>
              <span className="font-bold text-neutral-900">{(outputs.rateOfReturn*100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Time to Double:</span>
              <span className="font-bold text-neutral-900">{t.years === Infinity ? 'N/A' : `${t.years}y ${t.months}m`}</span>
            </div>
          </div>
        </div>
      </div>

      <GrowthChart data={schedule.rows} granularity={granularity} palette={palette} />

      <div ref={scheduleRef}>
        <ScheduleTable schedule={schedule} granularity={granularity} onExportPdf={handleExportPdf} onExportPng={handleExportPng} />
      </div>
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
      <div className="text-sm text-neutral-500">{label}</div>
      <div className={`text-lg font-bold ${color||'text-neutral-900'}`}>{value}</div>
    </div>
  );
}

function SummaryBadge({ title, primary, palette }) {
  return (
    <div className="text-center p-4 bg-neutral-50 rounded-lg">
      <p className="text-xs mb-1 text-neutral-400">{title}</p>
      <div className="text-3xl font-bold text-teal-500">{primary}</div>
    </div>
  );
}

function LabelWithInfo({ text, info }) {
  return (
    <span className="inline-flex items-center gap-1">
      {text}
      <HelpCircle size={14} className="text-neutral-400" title={info} />
    </span>
  );
}
