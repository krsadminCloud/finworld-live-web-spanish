import React from 'react';
import Card from '../components/Card';
import TooltipInfo from '../components/TooltipInfo';
import IconBadge from '../components/IconBadge';
import { Home } from 'lucide-react';
import FloatingInput from '../components/FloatingInput';

export default function PropertyInfo({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <IconBadge color="bg-sky-100" ring="ring-sky-200" fg="text-sky-600"><Home size={16} /></IconBadge>
          Property Information <TooltipInfo text="Basic acquisition details including purchase price and closing costs." />
        </span>
      }
      right={(<div className="flex items-center gap-3">
          <label className="flex items-center gap-2 uppercase tracking-wide text-[10px] font-semibold text-primary-500">
            <input
              type="checkbox"
              checked={!!value.allCash}
              onChange={(e) => set('allCash', e.target.checked)}
              className="h-4 w-4"
            />
            All Cash
          </label>
          <button
            type="button"
            aria-label={collapsed ? 'Expand' : 'Collapse'}
            onClick={() => setCollapsed((v) => !v)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-white hover:bg-primary-500/90"
            title={collapsed ? 'Expand' : 'Minimize'}
          >
          <span className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}>▾</span>
        </button>
      </div>)}
    >
      {!collapsed && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FloatingInput
          label="Address"
          value={value.address}
          onChange={(e) => set('address', e.target.value)}
          placeholder="123 Main St"
        />
        <FloatingInput
          label="Purchase Price"
          prefix="$"
          inputMode="decimal"
          value={value.purchasePrice}
          onChange={(e) => set('purchasePrice', e.target.value === '' ? '' : Number(e.target.value) || 0)}
          placeholder="(Amount)"
          formatCurrency
        />
        <FloatingInput
          label={`Closing Cost (${value.closingIsDollar ? '$' : '%'})`}
          prefix={value.closingIsDollar ? '$' : '%'}
          inputMode="decimal"
          value={value.closingCosts === '' ? '' : value.closingCosts}
          onChange={(e) => set('closingCosts', e.target.value === '' ? '' : Number(e.target.value) || 0)}
          placeholder={value.closingIsDollar ? '(Amount)' : '(Percent)'}
          rightAddon={(
            <button
              type="button"
              onClick={() => set('closingIsDollar', !value.closingIsDollar)}
              className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              title="Toggle %/$"
            >
              %/$
            </button>
          )}
        />
      </div>
      )}
    </Card>
  );
}
