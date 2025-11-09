import React from 'react';

export default function Card({ title, subtitle, right, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-md">
      <div className="flex items-start justify-between border-b border-slate-100 p-4">
        <div>
          <h3 className="text-slate-900 font-semibold">{title}</h3>
          {subtitle ? <p className="text-slate-500 text-sm">{subtitle}</p> : null}
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

