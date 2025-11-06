import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Topbar from "../../../components/calculators_shared_files/topBar";
import InputSection from "./components/InputSection";
import Insights from "./components/Insights";
import { calculateBuyVsLease } from "./utils/calc";

export default function BuyVsLeaseAuto() {
  const [scenario, setScenario] = useState({
    vehiclePrice: 35000,
    ownershipYears: 5,
    taxRate: 7.5,
    depreciation: { mode: "simple", finalPercent: 50 },
  });

  const [lease, setLease] = useState({
    termMonths: 36,
    monthlyPayment: 450,
    downPayment: 2000,
    totalFees: 0,
    advanced: {
      capCost: undefined,
      residualMode: "percent",
      residualValue: 55,
      moneyFactor: 0.0015,
      acquisitionFee: 0,
      dispositionFee: 0,
      taxMode: "on_payment",
      taxRateOverride: undefined,
      allowedMilesPerYear: 12000,
      expectedMilesPerYear: 12000,
      overMileFee: 0.25,
    },
  });

  const [buy, setBuy] = useState({
    purchasePrice: 35000,
    downPayment: 5000,
    termMonths: 60,
    apr: 4.5,
    advanced: {
      docFee: 0,
      registrationFee: 0,
      maintenanceDeltaPerYear: 0,
      insuranceDeltaPerYear: 0,
      resaleOverridePercent: undefined,
    },
  });

  const [results, setResults] = useState(() => calculateBuyVsLease({ scenario, lease, buy }));

  const cheaperText = useMemo(() => {
    if (!results) return "";
    if (results.comparison.cheaper === "tie") return "Over the selected period, both options cost about the same.";
    const winner = results.comparison.cheaper === "buy" ? "Buying" : "Leasing";
    return `${winner} is $${results.comparison.difference.toLocaleString()} cheaper over ${Math.round(results.ownershipMonths / 12)} years.`;
  }, [results]);

  function handleCalculate() {
    const r = calculateBuyVsLease({ scenario, lease, buy });
    setResults(r);
  }

  function handleReset() {
    const s = { vehiclePrice: 35000, ownershipYears: 5, taxRate: 7.5, depreciation: { mode: "simple", finalPercent: 50 } };
    const l = { termMonths: 36, monthlyPayment: 450, downPayment: 2000, totalFees: 0, advanced: { capCost: undefined, residualMode: "percent", residualValue: 55, moneyFactor: 0.0015, acquisitionFee: 0, dispositionFee: 0, taxMode: "on_payment", taxRateOverride: undefined, allowedMilesPerYear: 12000, expectedMilesPerYear: 12000, overMileFee: 0.25 } };
    const b = { purchasePrice: 35000, downPayment: 5000, termMonths: 60, apr: 4.5, advanced: { docFee: 0, registrationFee: 0, maintenanceDeltaPerYear: 0, insuranceDeltaPerYear: 0, resaleOverridePercent: undefined } };
    setScenario(s); setLease(l); setBuy(b);
    setResults(calculateBuyVsLease({ scenario: s, lease: l, buy: b }));
  }

  return (
    <div className="min-h-screen bg-bg-page text-neutral-900">
      <Topbar />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-h1 font-bold text-neutral-900">Buy vs Lease Auto Calculator</h1>
          <p className="text-neutral-600 mt-1 max-w-2xl">Compare the financial implications of leasing versus buying a car to make an informed decision.</p>
        </motion.section>

        <motion.section
          className=""
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <InputSection
            scenario={scenario}
            lease={lease}
            buy={buy}
            onScenarioChange={setScenario}
            onLeaseChange={setLease}
            onBuyChange={setBuy}
            onCalculate={handleCalculate}
            onReset={handleReset}
          />
        </motion.section>

        <Insights results={results} cheaperText={cheaperText} />
      </main>
    </div>
  );
}
