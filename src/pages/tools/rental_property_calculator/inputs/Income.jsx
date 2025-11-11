import React from 'react';
import Card from '../components/Card';
import TooltipInfo from '../components/TooltipInfo';
import FloatingInput from '../components/FloatingInput';
import IconBadge from '../components/IconBadge';
import { DollarSign } from 'lucide-react';

export default function Income({ value, onChange, onReset }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  const ensureCustom = () => Array.isArray(value.custom) ? value.custom : [];
  // per-input toggle map: true = show as Annual, false = show Monthly
  const [annualFlags, setAnnualFlags] = React.useState({ monthlyRent: false, otherIncome: false, totalIncome: false, custom: {} });
  const [tab, setTab] = React.useState('standard'); // 'standard' | 'itemized'
  const [itemizedOn, setItemizedOn] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const stdTabRef = React.useRef(null);
  const itmTabRef = React.useRef(null);
  const underlineRef = React.useRef(null);

  const updateUnderline = React.useCallback(() => {
    const target = (tab === 'itemized' ? itmTabRef.current : stdTabRef.current);
    const bar = underlineRef.current;
    if (!target || !bar || !target.parentElement) return;
    const parentRect = target.parentElement.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const left = rect.left - parentRect.left;
    bar.style.width = rect.width + 'px';
    bar.style.transform = `translateX(${left}px)`;
  }, [tab]);

  React.useEffect(() => { updateUnderline(); }, [tab, updateUnderline]);
  React.useEffect(() => {
    const onResize = () => updateUnderline();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateUnderline]);

  // When switching to Itemized tab, enable itemized by default
  React.useEffect(() => {
    if (tab === 'itemized') setItemizedOn(true);
  }, [tab]);

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
    <div className="relative">
      {/* Top tabs above and attached to the card */}
      <div className="absolute left-3 -top-3 z-10">
        <div className="relative inline-flex w-[160px]">
          <div className="flex w-full">
            <button
              type="button"
              onClick={() => setTab('standard')}
              aria-selected={tab === 'standard'}
              className={`flex-1 text-center px-3 py-1 text-[11px] rounded-t-[10px] border border-b-0 transition-colors duration-200 ${
                tab === 'standard'
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              style={{ marginRight: 4 }}
              ref={stdTabRef}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setTab('itemized')}
              aria-selected={tab === 'itemized'}
              className={`flex-1 text-center px-3 py-1 text-[11px] rounded-t-[10px] border border-b-0 transition-colors duration-200 ${
                tab === 'itemized'
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              ref={itmTabRef}
            >
              Itemized
            </button>
          </div>
          {/* Animated underline */}
          <span
            ref={underlineRef}
            className="absolute bottom-0 left-0 h-px rounded-full bg-teal-700 transition-[transform,width] duration-300 ease-out"
          />
        </div>
      </div>

    <Card
      title={
        <span className="flex items-center gap-2">
          <IconBadge color="bg-emerald-100" ring="ring-emerald-200" fg="text-emerald-600"><DollarSign size={16} /></IconBadge>
          Income <TooltipInfo text="Monthly rent and other recurring income." />
        </span>
      }
      right={(
        <div className="flex items-center gap-3">
          {tab === 'itemized' && (
            <>
              <label className="inline-flex items-center gap-2 uppercase tracking-wide text-[9px] text-teal-500">
                <input type="checkbox" className="h-4 w-4" checked={itemizedOn} onChange={(e) => setItemizedOn(e.target.checked)} />
                Enable itemized
              </label>
              <button
                type="button"
                onClick={addCustom}
                className="uppercase tracking-wide text-[9px] px-2.5 py-1 rounded-full transition-colors border bg-teal-600 text-white border-teal-600 hover:bg-teal-700 shadow"
              >
                + Add Custom Income
              </button>
            </>
          )}
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="uppercase tracking-wide text-[10px] px-3 py-1.5 rounded-full transition-colors border bg-teal-600 text-white border-teal-600 hover:bg-teal-700 shadow"
            >
              Reset
            </button>
          ) : null}
          <button
            type="button"
            aria-label={collapsed ? 'Expand' : 'Collapse'}
            onClick={() => setCollapsed((v) => !v)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white hover:bg-teal-700"
            title={collapsed ? 'Expand' : 'Minimize'}
          >
            <span className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}>▾</span>
          </button>
        </div>
      )}
    >
      {!collapsed && (
      <>
      {/* Itemized toggle */}
      {tab === 'itemized' && null}

      {tab === 'standard' ? (
        <div className="grid grid-cols-1 gap-4">
          <FloatingInput
            label={`Total Income (${annualFlags.totalIncome ? 'Annual' : 'Monthly'})`}
            prefix="$"
            inputMode="decimal"
            value={(() => { const v = toDisplay((Number(value.monthlyRent||0) + Number(value.otherIncome||0) + ensureCustom().reduce((s,i)=> s + (Number(i.amount)||0),0)), annualFlags.totalIncome); return v === '' ? '' : Number(v).toLocaleString(); })()}
            onChange={(e) => {
              const nMonthly = fromDisplay((e.target.value || '').replace(/,/g,''), annualFlags.totalIncome);
              onChange({ ...value, monthlyRent: nMonthly, otherIncome: 0, custom: [] });
            }}
            rightAddon={
              <button
                type="button"
                onClick={() => toggleFlag('totalIncome')}
                title={annualFlags.totalIncome ? 'Show Monthly' : 'Show Annual'}
                className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                M/A
              </button>
            }
          />
        </div>
      ) : (tab === 'itemized' && itemizedOn) ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FloatingInput
            label={annualFlags.monthlyRent ? 'Annual Rent' : 'Monthly Rent'}
            prefix="$"
            inputMode="decimal"
            value={(() => { if (value.monthlyRent === '') return ''; const v = toDisplay(value.monthlyRent, annualFlags.monthlyRent); return Number(v).toLocaleString(); })()}
            placeholder={annualFlags.monthlyRent ? '(Annual)' : '(Monthly)'}
            onChange={(e) => {
              const raw = (e.target.value || '').replace(/,/g,'');
              if (raw === '') return set('monthlyRent', '');
              set('monthlyRent', fromDisplay(raw, annualFlags.monthlyRent));
            }}
            rightAddon={
              <button type="button" onClick={() => toggleFlag('monthlyRent')} title={annualFlags.monthlyRent ? 'Show Monthly' : 'Show Annual'} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>
            }
          />
        </div>
        <div className="flex md:justify-end items-end gap-2"/>
        {ensureCustom().map((item) => (
          <div key={item.id} className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <FloatingInput
                label="Custom Income Name"
                value={item.name}
                onChange={(e) => updateCustom(item.id, { name: e.target.value })}
                placeholder="e.g., Parking, Laundry"
              />
            </div>
            <div>
              <FloatingInput
                label={`Amount (${annualFlags.custom?.[item.id] ? 'Annual' : 'Monthly'})`}
                prefix="$"
                inputMode="decimal"
                value={(() => { if (item.amount === '') return ''; const v = toDisplay(item.amount, annualFlags.custom?.[item.id]); return Number(v).toLocaleString(); })()}
                placeholder={annualFlags.custom?.[item.id] ? '(Annual)' : '(Monthly)'}
                onChange={(e) => {
                  const raw = (e.target.value || '').replace(/,/g,'');
                  const amt = raw === '' ? '' : fromDisplay(raw, annualFlags.custom?.[item.id]);
                  updateCustom(item.id, { amount: amt });
                }}
                rightAddon={<button type="button" onClick={() => toggleFlag('custom', item.id)} title={annualFlags.custom?.[item.id] ? 'Show Monthly' : 'Show Annual'} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>}
              />
            </div>
            <div>
              <button type="button" onClick={() => removeCustom(item.id)} className="mt-1 inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100">
                Remove
              </button>
            </div>
          </div>
        ))}
        <div>
          <FloatingInput
            label={`Other Income (${annualFlags.otherIncome ? 'Annual' : 'Monthly'})`}
            prefix="$"
            inputMode="decimal"
            value={(() => { if (value.otherIncome === '') return ''; const v = toDisplay(value.otherIncome, annualFlags.otherIncome); return Number(v).toLocaleString(); })()}
            placeholder={annualFlags.otherIncome ? '(Annual)' : '(Monthly)'}
            onChange={(e) => {
              const raw = (e.target.value || '').replace(/,/g,'');
              if (raw === '') return set('otherIncome', '');
              set('otherIncome', fromDisplay(raw, annualFlags.otherIncome));
            }}
            rightAddon={<button type="button" onClick={() => toggleFlag('otherIncome')} title={annualFlags.otherIncome ? 'Show Monthly' : 'Show Annual'} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>}
          />
        </div>
      </div>
      ) : (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          Toggle "Enable itemized" to enter detailed income by category.
        </div>
      )}
      </>
      )}
    </Card>
    </div>
  );
}
