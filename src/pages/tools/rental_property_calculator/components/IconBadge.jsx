import React from 'react';

export default function IconBadge({ children, color = 'bg-slate-100', ring = 'ring-slate-200', fg = 'text-slate-600' }) {
  return (
    <span className={`inline-flex items-center justify-center h-7 w-7 rounded-lg ${color} ${fg} ring-1 ${ring} mr-2`}>
      {children}
    </span>
  );
}

