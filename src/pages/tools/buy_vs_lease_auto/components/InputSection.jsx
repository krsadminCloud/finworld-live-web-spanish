import React, { useState, useId } from "react";
import { Settings } from "lucide-react";
import { computeLeaseAdvancedMonthly } from "../utils/calc";

export default function InputSection({ scenario, lease, buy, onScenarioChange, onLeaseChange, onBuyChange, onCalculate, onReset }) {
  const [showScenarioAdvanced, setShowScenarioAdvanced] = useState(scenario?.depreciation?.mode === "schedule");
  const [showLeaseAdvanced, setShowLeaseAdvanced] = useState(false);
  const [showBuyAdvanced, setShowBuyAdvanced] = useState(false);
  const inputCls = "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 input-focus";


  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Card */}
        <section className="bg-bg-surface rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Scenario & Vehicle</h2>
          <div className="space-y-5">
            <Field label="Vehicle MSRP ($)"><input type="number" className={inputCls} value={scenario.vehiclePrice} onChange={(e) => onScenarioChange({ ...scenario, vehiclePrice: Number(e.target.value) })} /></Field>
            <Field label="Sales Tax (%)"><input type="number" className={inputCls} value={scenario.taxRate} onChange={(e) => onScenarioChange({ ...scenario, taxRate: Number(e.target.value) })} /></Field>
            <Field label="Ownership Duration (Years)"><input type="number" className={inputCls} value={scenario.ownershipYears} onChange={(e) => onScenarioChange({ ...scenario, ownershipYears: Number(e.target.value) })} /></Field>
          </div>
          <div className="border-t border-neutral-200 my-5" />
          <AdvancedRow enabled={showScenarioAdvanced} onToggle={() => setShowScenarioAdvanced((s) => !s)} />
          {showScenarioAdvanced && (
            <div className="mt-4 space-y-4">
              <Field label="Depreciation Mode">
                <select className={inputCls} value={scenario.depreciation?.mode} onChange={(e) => {
                  const mode = e.target.value;
                  setShowScenarioAdvanced(mode === "schedule");
                  onScenarioChange({ ...scenario, depreciation: mode === "schedule" ? { mode, yearlyDrops: [20, 15, 12, 10, 8] } : { mode: "simple", finalPercent: 50, autoFinal: true } });
                }}>
                  <option value="simple">Simple (final %)</option>
                  <option value="schedule">Schedule (yearly drops)</option>
                </select>
              </Field>
              {scenario.depreciation?.mode === "simple" && (
                <Field label="Final value (%)">
                  <input
                    type="number"
                    className={inputCls}
                    value={scenario.depreciation?.finalPercent ?? 50}
                    onChange={(e) => onScenarioChange({ ...scenario, depreciation: { ...scenario.depreciation, mode: "simple", finalPercent: Number(e.target.value), autoFinal: false } })}
                  />
                </Field>
              )}
              {scenario.depreciation?.mode === "schedule" && (
                <Field label="Yearly drops (%) comma-separated"><input type="text" className={inputCls} value={(scenario.depreciation?.yearlyDrops || []).join(",")} onChange={(e) => onScenarioChange({ ...scenario, depreciation: { mode: "schedule", yearlyDrops: e.target.value.split(",").map((v) => Number(v.trim())).filter((v) => !isNaN(v)) } })} /></Field>
              )}
            </div>
          )}
        </section>

        {/* Lease Card */}
        <section className="bg-bg-surface rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Lease Option</h2>
          <div className="space-y-5">
            {(() => {
              const advancedActive = lease?.advanced?.useAdvanced !== false;
              let autoMonthly = 0;
              if (advancedActive) {
                const la = lease?.advanced || {};
                const capCost = Number(la.capCost ?? scenario.vehiclePrice ?? 0);
                const term = Math.max(1, Number(lease.termMonths || 36));
                const tRatePct = la.taxRateOverride != null ? Number(la.taxRateOverride) : Number(scenario?.taxRate || 0);
                const adv = computeLeaseAdvancedMonthly({
                  capCost,
                  residualMode: la.residualMode || "percent",
                  residualValue: la.residualValue ?? 58,
                  termMonths: term,
                  moneyFactor: la.moneyFactor ?? 0.0015,
                  taxMode: la.taxMode || "on_payment",
                  taxRate: Math.max(0, tRatePct) / 100,
                  downPayment: Number(lease.downPayment || 0),
                });
                autoMonthly = adv.monthly || 0;
              }
              return (
                <div>
                  <Field label="Monthly Payment ($)">
                    <input
                      type="number"
                      className={inputCls}
                      value={advancedActive ? Math.round(autoMonthly) : lease.monthlyPayment}
                      disabled={advancedActive}
                      onChange={(e) => onLeaseChange({ ...lease, monthlyPayment: Number(e.target.value) })}
                    />
                  </Field>
                  {advancedActive && (
                    <div className="mt-1 text-xs text-neutral-500">Auto-calculated from Cap cost, Residual, and Money Factor. Toggle off "Use advanced math" to enter a custom amount.</div>
                  )}
                </div>
              );
            })()}
            <Field label="Down Payment ($)"><input type="number" className={inputCls} value={lease.downPayment} onChange={(e) => onLeaseChange({ ...lease, downPayment: Number(e.target.value) })} /></Field>
            <Field label="Lease Term (Months)"><input type="number" className={inputCls} value={lease.termMonths} onChange={(e) => onLeaseChange({ ...lease, termMonths: Number(e.target.value) })} /></Field>
          </div>
          <div className="border-t border-neutral-200 my-5" />
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-neutral-700">Use advanced math</div>
            <button
              type="button"
              onClick={() => onLeaseChange({ ...lease, advanced: { ...lease.advanced, useAdvanced: !(lease?.advanced?.useAdvanced !== false) } })}
              aria-pressed={lease?.advanced?.useAdvanced !== false}
              className={`w-11 h-6 rounded-full transition-colors ${lease?.advanced?.useAdvanced !== false ? 'bg-primary-500' : 'bg-neutral-300'} relative`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${lease?.advanced?.useAdvanced !== false ? 'translate-x-5' : ''}`}></span>
            </button>
          </div>
          <AdvancedRow enabled={showLeaseAdvanced} onToggle={() => setShowLeaseAdvanced((s) => !s)} />
          {showLeaseAdvanced && (
            <div className="mt-4 space-y-5">
              <Field label="Cap cost ($)"><input type="number" className={inputCls} value={lease.advanced?.capCost ?? ""} onChange={(e) => onLeaseChange({ ...lease, advanced: { ...lease.advanced, capCost: e.target.value === "" ? undefined : Number(e.target.value) } })} /></Field>
              <Field label="Residual mode">
                <select className={inputCls} value={lease.advanced?.residualMode || "percent"} onChange={(e) => onLeaseChange({ ...lease, advanced: { ...lease.advanced, residualMode: e.target.value } })}>
                  <option value="percent">Percent</option>
                  <option value="absolute">Absolute</option>
                </select>
              </Field>
              <Field label="Residual value (%)">
                <input
                  type="number"
                  className={inputCls}
                  value={lease.advanced?.residualValue ?? 55}
                  onChange={(e) => onLeaseChange({ ...lease, advanced: { ...lease.advanced, residualValue: Number(e.target.value), autoResidual: false } })}
                />
              </Field>
              <Field label="Money factor"><input type="number" className={inputCls} step="0.0001" value={lease.advanced?.moneyFactor ?? ""} onChange={(e) => onLeaseChange({ ...lease, advanced: { ...lease.advanced, moneyFactor: e.target.value === '' ? undefined : Number(e.target.value) } })} /></Field>
              <Field label="Acquisition fee ($)"><input type="number" className={inputCls} value={lease.advanced?.acquisitionFee ?? 0} onChange={(e) => onLeaseChange({ ...lease, advanced: { ...lease.advanced, acquisitionFee: Number(e.target.value) } })} /></Field>
              <Field label="Disposition fee ($)"><input type="number" className={inputCls} value={lease.advanced?.dispositionFee ?? 0} onChange={(e) => onLeaseChange({ ...lease, advanced: { ...lease.advanced, dispositionFee: Number(e.target.value) } })} /></Field>
              <Field label="Tax mode">
                <select className={inputCls} value={lease.advanced?.taxMode || "on_payment"} onChange={(e) => onLeaseChange({ ...lease, advanced: { ...lease.advanced, taxMode: e.target.value } })}>
                  <option value="on_payment">On payment</option>
                  <option value="on_price">On price</option>
                </select>
              </Field>
              <Field label="Tax rate override (%)"><input type="number" className={inputCls} value={lease.advanced?.taxRateOverride ?? ""} onChange={(e) => onLeaseChange({ ...lease, advanced: { ...lease.advanced, taxRateOverride: e.target.value === "" ? undefined : Number(e.target.value) } })} /></Field>
              <Field label="Allowed miles / yr"><input type="number" className={inputCls} value={lease.advanced?.allowedMilesPerYear ?? 12000} onChange={(e) => onLeaseChange({ ...lease, advanced: { ...lease.advanced, allowedMilesPerYear: Number(e.target.value) } })} /></Field>
              <Field label="Expected miles / yr"><input type="number" className={inputCls} value={lease.advanced?.expectedMilesPerYear ?? 12000} onChange={(e) => onLeaseChange({ ...lease, advanced: { ...lease.advanced, expectedMilesPerYear: Number(e.target.value) } })} /></Field>
              <Field label="Over-mile fee ($/mile)"><input type="number" className={inputCls} step="0.01" value={lease.advanced?.overMileFee ?? 0.25} onChange={(e) => onLeaseChange({ ...lease, advanced: { ...lease.advanced, overMileFee: Number(e.target.value) } })} /></Field>
            </div>
          )}
        </section>

        {/* Buy Card */}
        <section className="bg-bg-surface rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Buy Option</h2>
          <div className="space-y-5">
            <Field label="Down Payment ($)"><input type="number" className={inputCls} value={buy.downPayment} onChange={(e) => onBuyChange({ ...buy, downPayment: Number(e.target.value) })} /></Field>
            <Field label="Loan Term (Months)"><input type="number" className={inputCls} value={buy.termMonths} onChange={(e) => onBuyChange({ ...buy, termMonths: Number(e.target.value) })} /></Field>
            <Field label="APR (%)"><input type="number" className={inputCls} step="0.01" value={buy.apr} onChange={(e) => onBuyChange({ ...buy, apr: Number(e.target.value) })} /></Field>
          </div>
          <div className="border-t border-neutral-200 my-5" />
          <AdvancedRow enabled={showBuyAdvanced} onToggle={() => setShowBuyAdvanced((s) => !s)} />
          {showBuyAdvanced && (
            <div className="mt-4 space-y-5">
              <Field label="Doc fee ($)"><input type="number" className={inputCls} value={buy.advanced?.docFee ?? 0} onChange={(e) => onBuyChange({ ...buy, advanced: { ...buy.advanced, docFee: Number(e.target.value) } })} /></Field>
              <Field label="Registration fee ($)"><input type="number" className={inputCls} value={buy.advanced?.registrationFee ?? 0} onChange={(e) => onBuyChange({ ...buy, advanced: { ...buy.advanced, registrationFee: Number(e.target.value) } })} /></Field>
              <Field label="Maintenance delta ($/yr)"><input type="number" className={inputCls} value={buy.advanced?.maintenanceDeltaPerYear ?? 0} onChange={(e) => onBuyChange({ ...buy, advanced: { ...buy.advanced, maintenanceDeltaPerYear: Number(e.target.value) } })} /></Field>
              <Field label="Insurance delta ($/yr)"><input type="number" className={inputCls} value={buy.advanced?.insuranceDeltaPerYear ?? 0} onChange={(e) => onBuyChange({ ...buy, advanced: { ...buy.advanced, insuranceDeltaPerYear: Number(e.target.value) } })} /></Field>
              <Field label="Resale override (%)"><input type="number" className={inputCls} value={buy.advanced?.resaleOverridePercent ?? ""} onChange={(e) => onBuyChange({ ...buy, advanced: { ...buy.advanced, resaleOverridePercent: e.target.value === "" ? undefined : Number(e.target.value) } })} /></Field>
            </div>
          )}
        </section>
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-3 mt-4">
        <button type="button" className="btn-primary" onClick={onCalculate}>Calculate Comparison</button>
        <button type="button" className="border border-neutral-300 text-neutral-700 bg-white px-6 py-2 rounded-md font-medium hover:bg-neutral-50 transition" onClick={onReset}>Reset</button>
      </div>
    </>
  );
}

function Field({ label, children, hidden }) {
  if (hidden) return null;

  // If the child is a standard input, render with floating label UI
  const isValidChild = React.isValidElement(children);
  const isInput = isValidChild && children.type === "input";
  const isSelect = isValidChild && children.type === "select";

  const id = useId();

  if (isInput) {
    const childValue = children.props?.value;
    const hasValue = childValue !== undefined && childValue !== null && childValue !== "";

    const cloned = React.cloneElement(children, {
      id,
      placeholder: children.props?.placeholder ?? " ",
      className: `${children.props?.className || ""} peer placeholder-transparent pt-5`,
      "data-has-value": hasValue ? "true" : "false",
    });

    return (
      <div className="relative">
        {cloned}
        <label
          htmlFor={id}
          className={
            "pointer-events-none absolute left-3 top-2 px-1 bg-white text-neutral-500 transition-all " +
            "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary-600 " +
            "peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm " +
            "peer-data-[has-value=true]:-top-2 peer-data-[has-value=true]:text-xs"
          }
        >
          {label}
        </label>
      </div>
    );
  }

  // Keep standard stacked label for selects and any other elements
  return (
    <label className="block">
      <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{label}</span>
      {children}
    </label>
  );
}

function AdvancedRow({ enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-neutral-700">
        <Settings className="w-4 h-4 text-neutral-500" />
        <span className="text-sm font-medium">Advanced options</span>
      </div>
      <button type="button" onClick={onToggle} aria-pressed={enabled} className={`w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-neutral-300'} relative`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : ''}`}></span>
      </button>
    </div>
  );
}


