import React from 'react';
import Card from '../components/Card';
import TooltipInfo from '../components/TooltipInfo';

export default function Expenses({ value, onChange, onReset }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  // Per-input flip of natural unit: false = natural (taxes/insurance annual; others monthly), true = flipped
  const [flip, setFlip] = React.useState({});

  const monthlyKeys = new Set(['maintenance', 'capex', 'hoa', 'utilities', 'garbageSewer']);
  const annualKeys = new Set(['propertyTaxes', 'insurance']);
  const percentKeys = new Set(['managementPct', 'vacancyRatePct']);

  const isAnnualNatural = (key) => annualKeys.has(key);
  const isFlipped = (key) => !!flip[key];
  const toggle = (key) => setFlip((p) => ({ ...p, [key]: !p[key] }));

  const displayForKey = (key, val) => {
    const n = Number(val) || 0;
    if (percentKeys.has(key)) return n;
    const showAnnual = isAnnualNatural(key) ? !isFlipped(key) : isFlipped(key);
    if (showAnnual && monthlyKeys.has(key)) return Math.round(n * 12 * 100) / 100;
    if (!showAnnual && annualKeys.has(key)) return Math.round((n / 12) * 100) / 100;
    return n;
  };

  const saveFromDisplay = (key, inputVal) => {
    const n = Number(inputVal) || 0;
    if (percentKeys.has(key)) return n;
    const showAnnual = isAnnualNatural(key) ? !isFlipped(key) : isFlipped(key);
    if (showAnnual && monthlyKeys.has(key)) return n / 12; // showing annual but store monthly
    if (!showAnnual && annualKeys.has(key)) return n * 12; // showing monthly but store annual
    return n;
  };

  const unitForKey = (key) => {
    if (percentKeys.has(key)) return '(%)';
    const showAnnual = isAnnualNatural(key) ? !isFlipped(key) : isFlipped(key);
    return showAnnual ? '(annual)' : '(monthly)';
  };
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          Expenses <TooltipInfo text="Operating expenses including taxes, insurance, maintenance, management, and more." />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div >
          <label className="text-sm text-slate-600">
            <span>Property Taxes</span>
            <span className="block text-xs text-slate-500">{unitForKey('propertyTaxes')}</span>
          </label>
          <div className="mt-1 relative w-full md:w-3/4">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input inputMode="decimal" className="w-full rounded-md border border-slate-300 p-2 pl-5 pr-9 text-left" placeholder="3500" value={displayForKey('propertyTaxes', value.propertyTaxes)}
              onChange={(e) => set('propertyTaxes', saveFromDisplay('propertyTaxes', e.target.value))} />
            <button type="button" onClick={() => toggle('propertyTaxes')} className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0">M/A</button>
          </div>
        </div>
        <div >
          <label className="text-sm text-slate-600">
            <span>Insurance</span>
            <span className="block text-xs text-slate-500">{unitForKey('insurance')}</span>
          </label>
          <div className="mt-1 relative w-full md:w-3/4">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input inputMode="decimal" className="w-full rounded-md border border-slate-300 p-2 pl-5 pr-9 text-left" placeholder="1200" value={displayForKey('insurance', value.insurance)}
              onChange={(e) => set('insurance', saveFromDisplay('insurance', e.target.value))} />
            <button type="button" onClick={() => toggle('insurance')} className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0">M/A</button>
          </div>
        </div>
        <div >
          <label className="text-sm text-slate-600">
            <span>Maintenance</span>
            <span className="block text-xs text-slate-500">{unitForKey('maintenance')}</span>
          </label>
          <div className="mt-1 relative w-full md:w-3/4">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input inputMode="decimal" className="w-full rounded-md border border-slate-300 p-2 pl-5 pr-9 text-left" placeholder="150" value={displayForKey('maintenance', value.maintenance)}
              onChange={(e) => set('maintenance', saveFromDisplay('maintenance', e.target.value))} />
            <button type="button" onClick={() => toggle('maintenance')} className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0">M/A</button>
          </div>
        </div>
        <div >
          <label className="text-sm text-slate-600">
            <span>CapEx</span>
            <span className="block text-xs text-slate-500">{unitForKey('capex')}</span>
          </label>
          <div className="mt-1 relative w-full md:w-3/4">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input inputMode="decimal" className="w-full rounded-md border border-slate-300 p-2 pl-5 pr-9 text-left" placeholder="150" value={displayForKey('capex', value.capex)}
              onChange={(e) => set('capex', saveFromDisplay('capex', e.target.value))} />
            <button type="button" onClick={() => toggle('capex')} className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0">M/A</button>
          </div>
        </div>
        <div >
          <label className="text-sm text-slate-600">
            <span>Property Mgmt</span>
            <span className="block text-xs text-slate-500">(%)</span>
          </label>
          <div className="mt-1 relative w-full md:w-3/4">
            <input inputMode="decimal" className="w-full rounded-md border border-slate-300 p-2 pl-5 pr-9 text-left" placeholder="8" value={value.managementPct}
              onChange={(e) => set('managementPct', Number(e.target.value) || 0)} />
            <button type="button" onClick={() => toggle('managementPct')} className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0">M/A</button>
          </div>
        </div>
        <div >
          <label className="text-sm text-slate-600">
            <span>Vacancy</span>
            <span className="block text-xs text-slate-500">(%)</span>
          </label>
          <div className="mt-1 relative w-full md:w-3/4">
            <input inputMode="decimal" className="w-full rounded-md border border-slate-300 p-2 pl-5 pr-9 text-left" placeholder="5" value={value.vacancyRatePct}
              onChange={(e) => set('vacancyRatePct', Number(e.target.value) || 0)} />
            <button type="button" onClick={() => toggle('vacancyRatePct')} className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0">M/A</button>
          </div>
        </div>
        <div >
          <label className="text-sm text-slate-600">
            <span>HOA</span>
            <span className="block text-xs text-slate-500">{unitForKey('hoa')}</span>
          </label>
          <div className="mt-1 relative w-full md:w-3/4">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input inputMode="decimal" className="w-full rounded-md border border-slate-300 p-2 pl-5 pr-9 text-left" placeholder="0" value={displayForKey('hoa', value.hoa)}
              onChange={(e) => set('hoa', saveFromDisplay('hoa', e.target.value))} />
            <button type="button" onClick={() => toggle('hoa')} className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0">M/A</button>
          </div>
        </div>
        <div >
          <label className="text-sm text-slate-600">
            <span>Utilities</span>
            <span className="block text-xs text-slate-500">{unitForKey('utilities')}</span>
          </label>
          <div className="mt-1 relative w-full md:w-3/4">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input inputMode="decimal" className="w-full rounded-md border border-slate-300 p-2 pl-5 pr-9 text-left" placeholder="0" value={displayForKey('utilities', value.utilities)}
              onChange={(e) => set('utilities', saveFromDisplay('utilities', e.target.value))} />
            <button type="button" onClick={() => toggle('utilities')} className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0">M/A</button>
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-600">
            <span>Garbage / Sewer</span>
            <span className="block text-xs text-slate-500">{unitForKey('garbageSewer')}</span>
          </label>
          <div className="mt-1 relative w-full md:w-3/4">
            <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input inputMode="decimal" className="w-full rounded-md border border-slate-300 p-2 pl-5 pr-9 text-left" placeholder="0" value={displayForKey('garbageSewer', value.garbageSewer)}
              onChange={(e) => set('garbageSewer', saveFromDisplay('garbageSewer', e.target.value))} />
            <button type="button" onClick={() => toggle('garbageSewer')} className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded border-0">M/A</button>
          </div>
        </div>
      </div>
    </Card>
  );
}
