import React from 'react';
import Card from '../components/Card';
import TooltipInfo from '../components/TooltipInfo';

export default function PropertyInfo({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          Property Information <TooltipInfo text="Basic acquisition details including purchase price and closing costs." />
        </span>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-slate-600">Address</label>
          <input className="mt-1 w-full rounded-md border border-slate-300 p-2" placeholder="123 Main St" value={value.address}
            onChange={(e) => set('address', e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Purchase Price</label>
          <input inputMode="decimal" className="mt-1 w-full rounded-md border border-slate-300 p-2 text-right" placeholder="350000" value={value.purchasePrice}
            onChange={(e) => set('purchasePrice', Number(e.target.value) || 0)} />
        </div>
        <div>
          <label className="text-sm text-slate-600">Closing Costs</label>
          <input inputMode="decimal" className="mt-1 w-full rounded-md border border-slate-300 p-2 text-right" placeholder="5000" value={value.closingCosts}
            onChange={(e) => set('closingCosts', Number(e.target.value) || 0)} />
        </div>
      </div>
    </Card>
  );
}

