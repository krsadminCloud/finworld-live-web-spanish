import React, { useMemo, useState } from "react";
import { DollarSign, TrendingUp, Flag, Calendar, ArrowDownRight, ArrowUpRight } from "lucide-react";
import ComparisonChart from "./ComparisonChart";
import ResultsPanel from "./ResultsPanel";
import CashFlowPanel from "./CashFlowPanel";

import DepreciationPanel from "./DepreciationPanel";

export default function Insights({ scenario, results, cheaperText }) {
  const [tab, setTab] = useState("overall");
  const breakEven = results?.comparison?.breakEvenMonth ?? null;
  const milestoneData = useMemo(() => buildMilestones(results), [results]);
  const drivers = useMemo(() => buildDrivers(results), [results]);

  return (
    <section className="mt-8">
      <div className="bg-bg-surface rounded-lg shadow-card">
        <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Financial Insights</h3>
          <div className="flex items-center gap-2 text-sm">
            <TabButton active={tab === "overall"} onClick={() => setTab("overall")}>Overall Cost</TabButton>
            <TabButton active={tab === "breakeven"} onClick={() => setTab("breakeven")}>Break-Even Point</TabButton>
            <TabButton active={tab === "cashflow"} onClick={() => setTab("cashflow")}>Cash Flow</TabButton>
            <TabButton active={tab === "depr"} onClick={() => setTab("depr")}>Depreciation</TabButton>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {tab === "overall" && (
            <>
              <ResultsPanel results={results} cheaperText={cheaperText} />
              <ComparisonChart series={results.series} breakEven={breakEven} />
            </>
          )}
          {tab === "breakeven" && (
            <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <div className="text-sm text-neutral-600">Break-even</div>
                  <div className="text-3xl font-bold">{breakEven != null ? `Month ${breakEven} (${formatDuration(breakEven)})` : 'No break-even within horizon'}</div>
                </div>
                {breakEven != null && (
                  <div className="text-sm text-neutral-600">At break-even, cumulative costs are equal.</div>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <ComparisonChart series={results.series} breakEven={breakEven} />
                </div>
                <div className="space-y-4">
                  <DriversPanel drivers={drivers} />
                  <MilestonesPanel items={milestoneData} />
                </div>
              </div>
            </div>
          )}
          {tab === "cashflow" && (
            <CashFlowPanel results={results} />
          )}
          {tab === "depr" && (
            <DepreciationPanel scenario={scenario} results={results} />
          )}
        </div>
      </div>
    </section>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md border text-sm ${
        active
          ? 'border-primary-500 text-primary-700 bg-primary-100'
          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
      }`}
    >
      {children}
    </button>
  );
}

function Placeholder({ text }) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6 text-neutral-600 text-sm">
      {text}
    </div>
  );
}

// ----- Helpers -----
function formatCurrency(n) {
  return `$${Math.round(Number(n || 0)).toLocaleString()}`;
}

function formatDuration(months) {
  const m = Math.max(0, Number(months || 0));
  const y = Math.floor(m / 12);
  const rm = m % 12;
  if (y === 0) return `${rm} mo`;
  if (rm === 0) return `${y} yr${y > 1 ? 's' : ''}`;
  return `${y} yr${y > 1 ? 's' : ''} ${rm} mo`;
}

function buildMilestones(results) {
  if (!results?.series?.lease || !results?.series?.buy) return [];
  const maxM = results.ownershipMonths ?? (results.series.lease.length - 1);
  const picks = [12, 36, 60, maxM].filter((v, i, a) => v <= maxM && a.indexOf(v) === i);
  return picks.map((m) => {
    const lease = Math.round(results.series.lease[m] ?? 0);
    const buy = Math.round(results.series.buy[m] ?? 0);
    return { label: m === maxM ? 'End' : `Month ${m}`, sub: formatDuration(m), lease, buy, diff: lease - buy };
  });
}

function buildDrivers(results) {
  if (!results?.series?.lease || !results?.series?.buy) return null;
  const L = results.series.lease;
  const B = results.series.buy;
  const n = Math.min(L.length, B.length) - 1;
  if (n < 2) return null;
  const inc = (arr, i) => Math.max(0, (arr[i] ?? 0) - (arr[i - 1] ?? 0));
  const incL1 = inc(L, 1), incB1 = inc(B, 1);
  const incL2 = inc(L, 2), incB2 = inc(B, 2);
  const upfrontLease = Math.max(0, incL1 - incL2);
  const upfrontBuy = Math.max(0, incB1 - incB2);
  const upfrontDelta = upfrontLease - upfrontBuy;
  let sum = 0, count = 0;
  for (let i = 2; i <= n - 1; i++) {
    const d = (inc(L, i) - inc(B, i));
    sum += d; count += 1;
  }
  const slopeDelta = count > 0 ? sum / count : (incL2 - incB2);
  const lastDelta = (inc(L, n) - inc(B, n));
  const endEffectDelta = lastDelta - slopeDelta;
  return { upfrontDelta, slopeDelta, endEffectDelta };
}

function Stat({ label, value, accent }) {
  const color = accent === 'pos' ? 'text-emerald-700' : accent === 'neg' ? 'text-amber-700' : 'text-neutral-700';
  return (
    <div className="p-3 border border-neutral-200 rounded-md bg-white">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function DriversPanel({ drivers }) {
  if (!drivers) return null;
  const fmt = (v) => (v >= 0 ? `+${formatCurrency(v)}` : `-${formatCurrency(Math.abs(v))}`);
  return (
    <div className="border border-neutral-200 rounded-md p-4 bg-bg-surface">
      <div className="font-medium mb-3">Key Drivers</div>
      <div className="grid grid-cols-1 gap-3">
        <DriverCard
          title="Upfront difference"
          subtitle="Lease vs Buy"
          value={fmt(drivers.upfrontDelta)}
          good={drivers.upfrontDelta <= 0}
          Icon={DollarSign}
        />
        <DriverCard
          title="Average monthly difference"
          subtitle="Lease vs Buy"
          value={fmt(drivers.slopeDelta)}
          good={drivers.slopeDelta <= 0}
          Icon={TrendingUp}
        />
        <DriverCard
          title="End fees/credits"
          subtitle="Lease vs Buy"
          value={fmt(drivers.endEffectDelta)}
          good={drivers.endEffectDelta <= 0}
          Icon={Flag}
        />
      </div>
    </div>
  );
}

function MilestonesPanel({ items }) {
  if (!items || !items.length) return null;
  return (
    <div className="border border-neutral-200 rounded-md p-4 bg-bg-surface">
      <div className="font-medium mb-2">Milestones</div>
      <div className="rounded-md border border-neutral-200 overflow-hidden divide-y divide-neutral-200 bg-white">
        {items.map((it, idx) => (
          <SimpleMilestoneRow key={idx} index={idx} label={it.label} sub={it.sub} diff={it.diff} />
        ))}
      </div>
    </div>
  );
}

function SimpleMilestoneRow({ index, label, sub, diff }) {
  const title = `${label} (${sub})`;
  const relation = diff >= 0 ? 'Lease > Buy' : 'Buy > Lease';
  const isFirst = index === 0;
  const amt = formatCurrency(Math.abs(diff));
  const amtColor = diff >= 0 ? 'text-amber-700' : 'text-emerald-700';
  return (
    <div className={`px-4 py-3 ${isFirst ? 'bg-neutral-50' : ''}`}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xl font-semibold text-neutral-900 truncate">{title}</div>
          <div className="mt-1 text-neutral-500">{relation}</div>
        </div>
        <div className={`text-lg font-semibold ${amtColor} shrink-0 tabular-nums`}>{amt}</div>
      </div>
    </div>
  );
}

function MilestoneCard({ label, sub, diff }) {
  const leaseCheaper = diff < 0;
  const amt = formatCurrency(Math.abs(diff));
  const badgeText = leaseCheaper ? 'Leasing cheaper' : 'Buying cheaper';
  const badgeColor = leaseCheaper ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200';
  const valueColor = leaseCheaper ? 'text-emerald-700' : 'text-amber-700';
  const Icon = leaseCheaper ? ArrowDownRight : ArrowUpRight;
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <div className="text-sm font-medium text-neutral-800">{label}</div>
          <div className="text-xs text-neutral-500">{sub}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ring-1 ${badgeColor}`}>
          <Icon className="w-3.5 h-3.5" />
          {badgeText}
        </span>
        <div className={`text-sm font-semibold ${valueColor}`}>{amt}</div>
      </div>
    </div>
  );
}

function DriverCard({ title, subtitle, value, good, Icon }) {
  const color = good ? 'text-emerald-700' : 'text-amber-700';
  const bgIcon = good ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600';
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm hover:shadow transition">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${bgIcon}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-neutral-800 leading-5">{title}</div>
          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs whitespace-nowrap">{subtitle}</span>
          <div className={`mt-2 text-xl font-semibold ${color}`}>{value}</div>
        </div>
      </div>
    </div>
  );
}

