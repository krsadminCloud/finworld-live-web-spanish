import React, { useState } from "react";
import ComparisonChart from "./ComparisonChart";
import ResultsPanel from "./ResultsPanel";

export default function Insights({ results, cheaperText }) {
  const [tab, setTab] = useState("overall");

  return (
    <section className="mt-8">
      <div className="bg-bg-surface rounded-lg shadow-card">
        <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Financial Insights</h3>
          <div className="flex items-center gap-2 text-sm">
            <TabButton active={tab === "overall"} onClick={() => setTab("overall")}>Overall Cost</TabButton>
            <TabButton active={tab === "breakeven"} onClick={() => setTab("breakeven")}>Break-Even Point</TabButton>
            <TabButton active={tab === "cashflow"} onClick={() => setTab("cashflow")}>Cash Flow</TabButton>
            <TabButton active={tab === "depr"} onClick={() => setTab("depr")}>Depreciation</TabButton>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {tab === "overall" && (
            <>
              <ResultsPanel results={results} cheaperText={cheaperText} />
              <ComparisonChart series={results.series} breakEven={results.comparison.breakEvenMonth} />
            </>
          )}
          {tab === "breakeven" && (
            <div className="bg-white rounded-lg border border-neutral-200 p-5">
              <div className="text-sm text-neutral-600">Break-even month</div>
              <div className="text-3xl font-bold">{results.comparison.breakEvenMonth != null ? results.comparison.breakEvenMonth : '—'}</div>
              <div className="mt-4">
                <ComparisonChart series={results.series} breakEven={results.comparison.breakEvenMonth} />
              </div>
            </div>
          )}
          {tab === "cashflow" && (
            <Placeholder text="Cash flow table and month-by-month comparison can go here." />
          )}
          {tab === "depr" && (
            <Placeholder text={`Estimated end value $${Math.round(results.depreciation.endValue).toLocaleString()} (lost $${Math.round(results.depreciation.valueLost).toLocaleString()}).`} />
          )}
        </div>
      </div>
    </section>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md border text-sm ${
        active
          ? 'border-primary-500 text-primary-700 bg-primary-100'
          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
      }`}
    >
      {children}
    </button>
  );
}

function Placeholder({ text }) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6 text-neutral-600 text-sm">
      {text}
    </div>
  );
}

