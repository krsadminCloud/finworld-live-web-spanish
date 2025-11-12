import React from 'react';

export default function FloatingInput({
  label,
  prefix,
  value,
  onChange,
  type = 'text',
  inputMode,
  placeholder,
  rightAddon,
  className = '',
  formatCurrency = false,
}) {
  const toCurrency = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return '';
    return num.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  };
  const cleaned = (s) => String(s || '').replace(/[^0-9.\-]/g, '');
  const displayValue = (() => {
    if (formatCurrency) {
      if (value === '' || value == null) return '';
      return toCurrency(value);
    }
    return value;
  })();
  const handleChange = (e) => {
    if (!formatCurrency) return onChange(e);
    const raw = e?.target?.value ?? '';
    const next = cleaned(raw);
    onChange({ target: { value: next } });
  };
  return (
    <div className={`relative ${className}`}>
      <label className="absolute -top-2 left-3 px-1 text-[11px] text-slate-600 bg-slate-100">
        {label}
      </label>
      {prefix && !(formatCurrency && value !== '' && value != null) ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pr-1">{prefix}</span>
      ) : null}
      <input
        type={type}
        inputMode={inputMode}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-300 p-2 ${prefix ? 'pl-8' : 'pl-3'} pr-12 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 text-[0.86rem]`}
      />
      {rightAddon ? (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightAddon}</div>
      ) : null}
    </div>
  );
}
