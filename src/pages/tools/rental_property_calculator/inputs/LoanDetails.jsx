import React from 'react';
import Card from '../components/Card';
import TooltipInfo from '../components/TooltipInfo';
import IconBadge from '../components/IconBadge';
import { Landmark } from 'lucide-react';
import FloatingInput from '../components/FloatingInput';

export default function LoanDetails({ value, onChange, onReset, disabled = false }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <IconBadge color="bg-violet-100" ring="ring-violet-200" fg="text-violet-600"><Landmark size={16} /></IconBadge>
          Loan Details <TooltipInfo text="Down payment, interest rate, term length, and optional points." />
        </span>
      }
      right={onReset ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="uppercase tracking-wide text-[10px] px-3 py-1.5 rounded-full transition-colors border bg-primary-500 text-white border-primary-500 hover:bg-primary-500/90 shadow"
          >
            Reset
          </button>
          <button
            type="button"
            aria-label={collapsed ? 'Expand' : 'Collapse'}
            onClick={() => setCollapsed((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-500/90"
            title={collapsed ? 'Expand' : 'Minimize'}
          >
            <span className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}>▾</span>
          </button>
        </div>
      ) : null}
    >
      {!collapsed && (
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <FloatingInput
          label="Down Payment (%)"
          inputMode="decimal"
          value={value.downPaymentPct}
          onChange={(e) => set('downPaymentPct', e.target.value === '' ? '' : e.target.value)}
          placeholder="(%)"
        />
        <FloatingInput
          label="Interest Rate (%)"
          inputMode="decimal"
          value={value.interestRatePct}
          onChange={(e) => set('interestRatePct', e.target.value === '' ? '' : e.target.value)}
          placeholder="(%)"
        />
        <FloatingInput
          label="Loan Term (Years)"
          inputMode="numeric"
          value={value.termYears}
          onChange={(e) => set('termYears', e.target.value === '' ? '' : Number(e.target.value) || 0)}
          placeholder="(years)"
        />
        <FloatingInput
          label="Points (%)"
          inputMode="decimal"
          value={value.points}
          onChange={(e) => set('points', e.target.value === '' ? '' : e.target.value)}
          placeholder="(%)"
        />
      </div>
      )}
    </Card>
  );
}

