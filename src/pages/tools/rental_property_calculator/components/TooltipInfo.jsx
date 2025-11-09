import React from 'react';

export default function TooltipInfo({ text }) {
  return (
    <span className="relative inline-flex items-center group">
      <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary-700 text-white text-[10px]">i</span>
      <span className="pointer-events-none absolute left-1/2 top-full z-10 hidden w-64 -translate-x-1/2 rounded-md bg-slate-800 p-2 text-xs text-white shadow-lg group-hover:block">
        {text}
      </span>
    </span>
  );
}

