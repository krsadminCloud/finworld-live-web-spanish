import React from 'react';
import Card from '../components/Card';
import TooltipInfo from '../components/TooltipInfo';
import FloatingInput from '../components/FloatingInput';
import IconBadge from '../components/IconBadge';
import { Receipt } from 'lucide-react';

export default function Expenses({ value, onChange, onReset }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  // Per-input flip of natural unit: false = natural (taxes/insurance annual; others monthly), true = flipped
  const [flip, setFlip] = React.useState({});
  const [tab, setTab] = React.useState('standard'); // 'standard' | 'itemized'
  const [itemizedOn, setItemizedOn] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [overrideAnnual, setOverrideAnnual] = React.useState(false);
  const stdTabRef = React.useRef(null);
  const itmTabRef = React.useRef(null);
  const underlineRef = React.useRef(null);
  const [customAnnual, setCustomAnnual] = React.useState({});

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

  // Auto-enable itemized when Itemized tab is selected
  React.useEffect(() => {
    if (tab === 'itemized') setItemizedOn(true);
  }, [tab]);

  const monthlyKeys = new Set(['maintenance', 'capex', 'hoa', 'utilities', 'garbageSewer']);
  const annualKeys = new Set(['propertyTaxes', 'insurance']);
  const percentKeys = new Set(['managementPct', 'vacancyRatePct']);

  const isAnnualNatural = (key) => annualKeys.has(key);
  const isFlipped = (key) => !!flip[key];
  const toggle = (key) => setFlip((p) => ({ ...p, [key]: !p[key] }));

  const displayForKey = (key, val) => {
    if (val === '' || val === null || typeof val === 'undefined') return '';
    const n = Number(val) || 0;
    if (percentKeys.has(key)) return n;
    const showAnnual = isAnnualNatural(key) ? !isFlipped(key) : isFlipped(key);
    if (showAnnual && monthlyKeys.has(key)) return Math.round(n * 12 * 100) / 100;
    if (!showAnnual && annualKeys.has(key)) return Math.round((n / 12) * 100) / 100;
    return n;
  };

  const saveFromDisplay = (key, inputVal) => {
    if (inputVal === '' || inputVal === null || typeof inputVal === 'undefined') return '';
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
    return showAnnual ? '(Annual)' : '(Monthly)';
  };
  const periodLabel = (key) => {
    const showAnnual = isAnnualNatural(key) ? !isFlipped(key) : isFlipped(key);
    return showAnnual ? '(Annual)' : '(Monthly)';
  };

  const ensureCustom = () => Array.isArray(value.custom) ? value.custom : [];
  const addCustom = () => {
    const id = Date.now() + Math.random();
    const custom = [...ensureCustom(), { id, name: '', amount: '' }];
    onChange({ ...value, custom });
  };
  const updateCustom = (id, patch) => {
    const custom = ensureCustom().map(it => it.id === id ? { ...it, ...patch } : it);
    onChange({ ...value, custom });
  };
  const removeCustom = (id) => {
    const custom = ensureCustom().filter(it => it.id !== id);
    onChange({ ...value, custom });
    setCustomAnnual((m) => { const n = { ...m }; delete n[id]; return n; });
  };
  const toggleCustomAnnual = (id) => setCustomAnnual((m) => ({ ...m, [id]: !m?.[id] }));
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
          <IconBadge color="bg-rose-100" ring="ring-rose-200" fg="text-rose-600"><Receipt size={16} /></IconBadge>
          Expenses <TooltipInfo text="Operating expenses including taxes, insurance, maintenance, management, and more." />
        </span>
      }
      right={(
        <div className="flex items-center gap-3">
          {tab === 'itemized' && (
            <label className="inline-flex items-center gap-2 uppercase tracking-wide text-[9px] text-teal-500">
              <input type="checkbox" className="h-4 w-4" checked={itemizedOn} onChange={(e) => setItemizedOn(e.target.checked)} />
              Enable itemized
            </label>
          )}
          {tab === 'itemized' && (
            <button
              type="button"
              onClick={addCustom}
              className="uppercase tracking-wide text-[9px] px-2.5 py-1 rounded-full transition-colors border bg-teal-600 text-white border-teal-600 hover:bg-teal-700 shadow"
            >
              + Custom Expense
            </button>
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

      {tab === 'itemized' && !itemizedOn ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          Toggle "Enable itemized" to enter detailed expense amounts by category.
        </div>
      ) : null}

      {tab === 'standard' ? (
        <div className="grid grid-cols-1 gap-4">
          <FloatingInput
            label={`Total Expenses (${overrideAnnual ? 'Annual' : 'Monthly'})`}
            prefix="$"
            inputMode="decimal"
            value={
              value.overrideOperatingMonthly === '' || value.overrideOperatingMonthly == null
                ? ''
                : (overrideAnnual
                    ? Math.round(Number(value.overrideOperatingMonthly) * 12 * 100) / 100
                    : Number(value.overrideOperatingMonthly))
            }
            placeholder={overrideAnnual ? '(Annual)' : '(Monthly)'}
            onChange={(e) => {
              const raw = e.target.value;
              const entered = raw === '' ? '' : Number(raw) || 0;
              const monthly = raw === '' ? '' : (overrideAnnual ? entered / 12 : entered);
              onChange({
                ...value,
                overrideOperatingMonthly: monthly,
                managementPct: '',
                propertyTaxes: '',
                insurance: '',
                maintenance: '',
                capex: '',
                hoa: '',
                utilities: '',
                garbageSewer: '',
              });
            }}
            rightAddon={
              <button
                type="button"
                onClick={() => setOverrideAnnual((v) => !v)}
                title={overrideAnnual ? 'Show Monthly' : 'Show Annual'}
                className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                M/A
              </button>
            }
          />
        </div>
      ) : (tab === 'itemized' && itemizedOn) && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <FloatingInput
            label={`Property Taxes`}
            prefix="$"
            inputMode="decimal"
            value={(() => { const v = displayForKey('propertyTaxes', value.propertyTaxes); return v === '' ? '' : Number(v).toLocaleString(); })()}
            onChange={(e) => set('propertyTaxes', saveFromDisplay('propertyTaxes', (e.target.value || '').replace(/,/g,'') ))}
            placeholder={periodLabel('propertyTaxes')}
            rightAddon={
              <button type="button" onClick={() => toggle('propertyTaxes')} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>
            }
          />
        </div>
        <div>
          <FloatingInput
            label="Insurance"
            prefix="$"
            inputMode="decimal"
            value={(() => { const v = displayForKey('insurance', value.insurance); return v === '' ? '' : Number(v).toLocaleString(); })()}
            onChange={(e) => set('insurance', saveFromDisplay('insurance', (e.target.value || '').replace(/,/g,'') ))}
            placeholder={periodLabel('insurance')}
            rightAddon={<button type="button" onClick={() => toggle('insurance')} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>}
          />
        </div>
        <div>
          <FloatingInput
            label="Maintenance"
            prefix="$"
            inputMode="decimal"
            value={(() => { const v = displayForKey('maintenance', value.maintenance); return v === '' ? '' : Number(v).toLocaleString(); })()}
            onChange={(e) => set('maintenance', saveFromDisplay('maintenance', (e.target.value || '').replace(/,/g,'') ))}
            placeholder={periodLabel('maintenance')}
            rightAddon={<button type="button" onClick={() => toggle('maintenance')} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>}
          />
        </div>
        <div>
          <FloatingInput
            label="CapEx"
            prefix="$"
            inputMode="decimal"
            value={(() => { const v = displayForKey('capex', value.capex); return v === '' ? '' : Number(v).toLocaleString(); })()}
            onChange={(e) => set('capex', saveFromDisplay('capex', (e.target.value || '').replace(/,/g,'') ))}
            placeholder={periodLabel('capex')}
            rightAddon={<button type="button" onClick={() => toggle('capex')} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>}
          />
        </div>
        <div>
          <FloatingInput
            label="Property Mgmt"
            prefix="%"
            inputMode="decimal"
            value={value.managementPct}
            onChange={(e) => set('managementPct', e.target.value === '' ? '' : Number(e.target.value) || 0)}
            placeholder={periodLabel('managementPct')}
            rightAddon={<button type="button" onClick={() => toggle('managementPct')} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>}
          />
        </div>
        <div>
          <FloatingInput
            label="Vacancy"
            prefix="%"
            inputMode="decimal"
            value={value.vacancyRatePct}
            onChange={(e) => set('vacancyRatePct', e.target.value === '' ? '' : Number(e.target.value) || 0)}
            placeholder={periodLabel('vacancyRatePct')}
            rightAddon={<button type="button" onClick={() => toggle('vacancyRatePct')} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>}
          />
        </div>
        <div>
          <FloatingInput
            label="HOA"
            prefix="$"
            inputMode="decimal"
            value={(() => { const v = displayForKey('hoa', value.hoa); return v === '' ? '' : Number(v).toLocaleString(); })()}
            onChange={(e) => set('hoa', saveFromDisplay('hoa', (e.target.value || '').replace(/,/g,'') ))}
            placeholder={periodLabel('hoa')}
            rightAddon={<button type="button" onClick={() => toggle('hoa')} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>}
          />
        </div>
        <div>
          <FloatingInput
            label="Utilities"
            prefix="$"
            inputMode="decimal"
            value={(() => { const v = displayForKey('utilities', value.utilities); return v === '' ? '' : Number(v).toLocaleString(); })()}
            onChange={(e) => set('utilities', saveFromDisplay('utilities', (e.target.value || '').replace(/,/g,'') ))}
            placeholder={periodLabel('utilities')}
            rightAddon={<button type="button" onClick={() => toggle('utilities')} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>}
          />
        </div>
        <div>
          <FloatingInput
            label="Garbage / Sewer"
            prefix="$"
            inputMode="decimal"
            value={(() => { const v = displayForKey('garbageSewer', value.garbageSewer); return v === '' ? '' : Number(v).toLocaleString(); })()}
            onChange={(e) => set('garbageSewer', saveFromDisplay('garbageSewer', (e.target.value || '').replace(/,/g,'') ))}
            placeholder={periodLabel('garbageSewer')}
            rightAddon={<button type="button" onClick={() => toggle('garbageSewer')} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>}
          />
        </div>

        {ensureCustom().map((item) => (
          <div key={item.id} className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <FloatingInput
                label="Custom Expense Name"
                value={item.name}
                onChange={(e) => updateCustom(item.id, { name: e.target.value })}
                placeholder="e.g., Pest Control, Landscaping"
              />
            </div>
            <div>
              <FloatingInput
                label={`Amount (${customAnnual?.[item.id] ? 'Annual' : 'Monthly'})`}
                prefix="$"
                inputMode="decimal"
                value={(() => { if (item.amount === '') return ''; const n = customAnnual?.[item.id] ? Math.round(Number(item.amount)*12*100)/100 : Number(item.amount); return Number(n).toLocaleString(); })()}
                placeholder={customAnnual?.[item.id] ? '(Annual)' : '(Monthly)'}
                onChange={(e) => {
                  const raw = (e.target.value || '').replace(/,/g,'');
                  const entered = raw === '' ? '' : Number(raw) || 0;
                  const monthly = raw === '' ? '' : (customAnnual?.[item.id] ? entered / 12 : entered);
                  updateCustom(item.id, { amount: monthly });
                }}
                rightAddon={<button type="button" onClick={() => toggleCustomAnnual(item.id)} className="px-1.5 py-0.5 text-[10px] leading-none bg-blue-600 hover:bg-blue-700 text-white rounded">M/A</button>}
              />
            </div>
            <div>
              <button type="button" onClick={() => removeCustom(item.id)} className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100">Remove</button>
            </div>
          </div>
        ))}
      </div>
      )}
      </>
      )}
    </Card>
    </div>
  );
}

