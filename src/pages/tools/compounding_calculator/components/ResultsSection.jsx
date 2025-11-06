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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-neutral-900">Summary</h3>
          <button onClick={handleExportPdf} className="px-4 py-1.5 text-sm rounded-full border-2 border-teal-400 text-teal-500 hover:bg-teal-50 transition-colors">
            Export PDF
          </button>
        </div>
        <div className="text-center p-8 bg-teal-500 rounded-lg mb-4">
          <p className="text-sm font-bold text-white mb-2">END BALANCE</p>
          <div className="flex justify-center">
            <AutoFitText value={formatCurrency(outputs.futureValue)} min={28} max={72} className="font-bold text-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-4">
          <SummaryBadge palette={palette} title="Total Invested" primary={formatCurrency((outputs.initialInvestment || 0) + (outputs.totalContributions || 0))} />
          <SummaryBadge palette={palette} title="Interest Earned" primary={formatCurrency(outputs.totalInterest)} />
        </div>
        <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-lg boxShadow-md p-6">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">METRICS</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Initial Investment:</span>
              <span className="font-bold text-neutral-900">{formatCurrency(outputs.initialInvestment)}</span>
            </div>
            {/* Annual Deposits derived from contribution + frequency */}
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Annual Deposits:</span>
              <span className="font-bold text-neutral-900">
                {(() => {
                  const freq = (results?.inputs?.contributionFrequency) || 'monthly';
                  const amount = Number(results?.inputs?.contribution) || 0;
                  const perYearMap = { yearly: 1, semiannual: 2, quarterly: 4, monthly: 12, weekly: 52 };
                  const perYear = perYearMap[freq] ?? 12;
                  const annual = amount * perYear;
                  return formatCurrency(annual);
                })()}
              </span>
            </div>
            {/* Years from input (years + months) */}
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Years:</span>
              <span className="font-bold text-neutral-900">
                {(() => {
                  const y = Number(results?.inputs?.years) || 0;
                  const ym = formatYearsMonths(y);
                  return `${ym.years}y ${ym.months}m`;
                })()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Effective Yield:</span>
              <span className="font-bold text-neutral-900">{(outputs.effectiveAnnualYield*100).toFixed(2)}%</span>
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
        <ScheduleTable schedule={schedule} granularity={granularity} onExportPdf={handleExportPdf} />
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

// Auto-fit a single-line text to its container width
function AutoFitText({ value, min = 18, max = 72, className = '' }) {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState(max);

  const fit = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.fontSize = max + 'px';
    el.style.whiteSpace = 'nowrap';
    const container = el.parentElement;
    if (!container) return;
    const limit = container.clientWidth;
    let lo = min, hi = max, best = min;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      el.style.fontSize = mid + 'px';
      if (el.scrollWidth <= limit) { best = mid; lo = mid + 1; } else { hi = mid - 1; }
    }
    setSize(best);
  }, [min, max]);

  React.useLayoutEffect(() => { fit(); }, [value, fit]);
  React.useEffect(() => {
    const el = ref.current?.parentElement; if (!el) return;
    const ro = new ResizeObserver(() => fit());
    ro.observe(el); return () => ro.disconnect();
  }, [fit]);

  return (
    <span ref={ref} className={className} style={{ fontSize: size, display: 'inline-block', whiteSpace: 'nowrap', lineHeight: 1 }} title={String(value)}>
      {value}
    </span>
  );
}

function SummaryBadge({ title, primary, palette }) {
  return (
    <div className="text-center p-4 bg-sky-50 rounded-lg border border-sky-200">
      <p className="text-sm font-semibold mb-1 text-neutral-700">{title}</p>
      <div className="flex justify-center">
        <AutoFitText value={primary} min={18} max={36} className="font-bold text-teal-500" />
      </div>
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
