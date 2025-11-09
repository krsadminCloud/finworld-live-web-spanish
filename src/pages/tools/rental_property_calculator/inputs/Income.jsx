import React from 'react';
import Card from '../components/Card';
import TooltipInfo from '../components/TooltipInfo';

export default function Income({ value, onChange, onReset }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  const ensureCustom = () => Array.isArray(value.custom) ? value.custom : [];
  // per-input toggle map: true = show as Annual, false = show Monthly
  const [annualFlags, setAnnualFlags] = React.useState({ monthlyRent: false, otherIncome: false, custom: {} });

  const toggleFlag = (key, id) => {
    setAnnualFlags((prev) => {
      if (key === 'custom') {
        const next = { ...prev.custom, [id]: !prev.custom?.[id] };
        return { ...prev, custom: next };
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const toDisplay = (monthlyVal, flag) => {
    const n = Number(monthlyVal) || 0;
    return flag ? Math.round((n * 12) * 100) / 100 : n;
  };

  const fromDisplay = (inputVal, flag) => {
    const n = Number(inputVal) || 0;
    return flag ? n / 12 : n;
  };
  const addCustom = () => {
    const id = Date.now() + Math.random();
    const custom = [...ensureCustom(), { id, name: '', amount: 0 }];
    onChange({ ...value, custom });
  };
  const updateCustom = (id, patch) => {
    const custom = ensureCustom().map(item => item.id === id ? { ...item, ...patch } : item);
    onChange({ ...value, custom });
  };
  const removeCustom = (id) => {
    const custom = ensureCustom().filter(item => item.id !== id);
    onChange({ ...value, custom });
  };
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          Add Income <TooltipInfo text="Monthly rent and other recurring income." />
        </span>
      }
      right={onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center rounded-md bg-primary-700 px-4 py-2 text-white hover:bg-primary-700/90"
        >
          Reset
        </button>
      ) : null}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600">{annualFlags.monthlyRent ? 'Annual Rent' : 'Monthly Rent'}</label>
          <div className="mt-1 relative w-full md:w-3/4">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input
              inputMode="decimal"
              className="w-full rounded-md border border-slate-300 p-2 pr-9 pl-5 text-left"
              placeholder={annualFlags.monthlyRent ? '30000' : '2500'}
              value={toDisplay(value.monthlyRent, annualFlags.monthlyRent)}
              onChange={(e) => set('monthlyRent', fromDisplay(e.target.value, annualFlags.monthlyRent))}
            />
            <button
              type="button"
              onClick={() => toggleFlag('monthlyRent')}
              title={annualFlags.monthlyRent ? 'Show Monthly' : 'Show Annual'}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0"
            >
              M/A
            </button>
          </div>
        </div>
        <div className="flex md:justify-end items-end gap-2">
          <button type="button" onClick={addCustom} className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">+ Add Custom Income</button>
        </div>
        {ensureCustom().map((item) => (
          <div key={item.id} className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-sm text-slate-600">Custom Income Name</label>
              <input className="mt-1 w-full rounded-md border border-slate-300 p-2" placeholder="e.g., Parking, Laundry" value={item.name}
                onChange={(e) => updateCustom(item.id, { name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Amount ({annualFlags.custom?.[item.id] ? 'Annual' : 'Monthly'})</label>
              <div className="mt-1 relative w-full md:w-3/4">
                <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input inputMode="decimal" className="w-full rounded-md border border-slate-300 p-2 pl-5 pr-9 text-left" placeholder="0" value={toDisplay(item.amount, annualFlags.custom?.[item.id])}
                  onChange={(e) => updateCustom(item.id, { amount: fromDisplay(e.target.value, annualFlags.custom?.[item.id]) })} />
                <button type="button" onClick={() => toggleFlag('custom', item.id)} title={annualFlags.custom?.[item.id] ? 'Show Monthly' : 'Show Annual'} className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0">M/A</button>
              </div>
            </div>
            <div>
              <button type="button" onClick={() => removeCustom(item.id)} className="mt-1 inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100">
                Remove
              </button>
            </div>
          </div>
        ))}
        <div>
          <label className="text-sm text-slate-600">Other Income ({annualFlags.otherIncome ? 'Annual' : 'Monthly'})</label>
          <div className="mt-1 relative w-full md:w-3/4">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input inputMode="decimal" className="w-full rounded-md border border-slate-300 p-2 pl-5 pr-9 text-left" placeholder="0" value={toDisplay(value.otherIncome, annualFlags.otherIncome)}
              onChange={(e) => set('otherIncome', fromDisplay(e.target.value, annualFlags.otherIncome))} />
            <button type="button" onClick={() => toggleFlag('otherIncome')} title={annualFlags.otherIncome ? 'Show Monthly' : 'Show Annual'} className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0">M/A</button>
          </div>
        </div>
      </div>
    </Card>
  );
}
