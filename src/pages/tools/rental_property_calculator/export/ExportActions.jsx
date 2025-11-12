import React, { useState } from 'react';

export default function ExportActions({ inputs, analysis }) {
  const [msg, setMsg] = useState('');

  const handleCopy = async () => {
    const lines = [];
    lines.push('FinWorld Rental Property Summary');
    lines.push('');
    lines.push(`Purchase Price: $${inputs.property.purchasePrice.toLocaleString()}`);
    lines.push(`Down Payment: ${inputs.loan.downPaymentPct}%`);
    lines.push(`Interest Rate: ${inputs.loan.interestRatePct}%`);
    lines.push(`Term: ${inputs.loan.termYears} years`);
    lines.push(`Monthly Rent: $${inputs.income.monthlyRent.toLocaleString()}`);
    lines.push('');
    lines.push(`Monthly Cash Flow: $${Math.round(analysis.monthlyCashFlow).toLocaleString()}`);
    lines.push(`Cap Rate: ${analysis.capRate.toFixed(1)}%`);
    lines.push(`Cash-on-Cash: ${analysis.coc.toFixed(1)}%`);
    lines.push(`Total Investment: $${Math.round(analysis.investBreakdown.totalInvestment).toLocaleString()}`);
    lines.push(`ROI (5y): ${analysis.roi5.toFixed(1)}%`);
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setMsg('Summary copied to clipboard');
    } catch (e) {
      setMsg('Copy failed');
    }
  };

  const handlePdf = () => {
    setMsg('Download as PDF coming soon');
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={handlePdf} className="rounded-md bg-slate-100 px-4 py-2 text-slate-800 hover:bg-slate-200 border border-slate-200">Download Report as PDF</button>
      <button onClick={handleCopy} className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-500/90">Copy Shareable Summary</button>
      {msg ? <span className="text-sm text-slate-500">{msg}</span> : null}
    </div>
  );
}
