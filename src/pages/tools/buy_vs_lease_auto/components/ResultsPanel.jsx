import React from "react";
import { BadgeCheck, Calendar, DollarSign, ArrowRightLeft, ArrowDownRight } from "lucide-react";

export default function ResultsPanel({ results, cheaperText }) {
  if (!results) return null;

  const leaseTotal = results.lease.totalCost;
  const buyTotal = results.buy.totalCost;
  const cheaper = results.comparison.cheaper; // 'buy' | 'lease' | 'tie'
  const savings = results.comparison.difference;
  const breakEven = results.comparison.breakEvenMonth;

  const leaseMonthly = results.lease.monthly;
  const buyMonthly = results.buy.monthly;

  const winnerLabel = cheaper === "buy" ? "Buying" : cheaper === "lease" ? "Leasing" : "Tie";
  const winnerColor = cheaper === "tie" ? "text-neutral-700" : "text-emerald-700";

  return (
    <div className="bg-bg-surface rounded-lg shadow-card p-6">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>

      {/* Highlight banner */}
      <div className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 flex items-start gap-3">
        <BadgeCheck className="w-5 h-5 text-primary-600 mt-0.5" />
        <p className="text-neutral-800 text-sm">
          {cheaperText}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
        <Tile title="Lease total" value={`$${leaseTotal.toLocaleString()}`} subtitle={`${results.lease.termsCount} term(s) • ${formatCurrency(leaseMonthly)}/mo`} Icon={DollarSign} />
        <Tile title="Buy total" value={`$${buyTotal.toLocaleString()}`} subtitle={`${results.ownershipMonths} months • ${formatCurrency(buyMonthly)}/mo`} Icon={DollarSign} />
        <Tile title="Cheaper overall" value={cheaper === 'tie' ? 'Tie' : `${winnerLabel} by ${formatCurrency(savings)}`} accent={cheaper === 'tie' ? 'neutral' : 'positive'} Icon={ArrowRightLeft} />
        <Tile title="Break-even" value={breakEven != null ? `Month ${breakEven} (${formatDuration(breakEven)})` : 'No break-even'} Icon={Calendar} />
        <Tile title="Depreciation end value" value={formatCurrency(results.depreciation.endValue)} subtitle={`Lost ${formatCurrency(results.depreciation.valueLost)}`} Icon={ArrowDownRight} accent="negative" />
      </div>

    </div>
  );
}

function Tile({ title, value, subtitle, accent, Icon }) {
  const valueColor = accent === 'positive' ? 'text-emerald-700' : accent === 'negative' ? 'text-amber-700' : 'text-neutral-900';
  return (
    <div className="rounded-lg border border-neutral-200 p-4 bg-white">
      <div className="flex items-start gap-2">
        {Icon && <Icon className="w-5 h-5 text-primary-600 mt-0.5" />}
        <div className="flex-1">
          <div className="text-sm text-neutral-500">{title}</div>
          <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
          {subtitle && <div className="text-xs text-neutral-500 mt-1">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(n) { return `$${Math.round(Number(n || 0)).toLocaleString()}`; }
function formatDuration(months) {
  const m = Math.max(0, Number(months || 0));
  const y = Math.floor(m / 12);
  const rm = m % 12;
  if (y === 0) return `${rm} mo`;
  if (rm === 0) return `${y} yr${y > 1 ? 's' : ''}`;
  return `${y} yr${y > 1 ? 's' : ''} ${rm} mo`;
}
