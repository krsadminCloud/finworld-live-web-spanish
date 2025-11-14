import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Topbar from "../../../components/calculators_shared_files/topBar";
import { Helmet } from 'react-helmet-async';
import InputSection from "./components/InputSection";
import Insights from "./components/Insights";
import { calculateBuyVsLease } from "./utils/calc";

export default function BuyVsLeaseAuto() {
  const canonical = typeof window !== 'undefined' ? (window.location.origin + window.location.pathname) : 'https://www.finworld.live/tools/buy-vs-lease-auto';
  const seoFaq = [
    { q: 'Is it cheaper to lease or buy a car?', a: 'It depends on term length, money factor/APR, fees, and resale value. This calculator compares total costs over your chosen period.' },
    { q: 'What is a money factor?', a: 'Money factor is the leasing equivalent of APR. Multiply by 2400 to approximate APR.' },
    { q: 'How do miles affect a lease?', a: 'Exceeding the allowed miles per year increases cost via per-mile fees. The tool includes this.' }
  ];
  const [scenario, setScenario] = useState({
    vehiclePrice: 38000, // compact SUV MSRP example
    ownershipYears: 5,
    taxRate: 8.5,
    depreciation: { mode: "simple", finalPercent: 50, autoFinal: true },
  });

  const [lease, setLease] = useState({
    termMonths: 36,
    monthlyPayment: 0,
    downPayment: 2500,
    totalFees: 500,
    advanced: {
      useAdvanced: true,
      capCost: undefined,
      residualMode: "percent",
      residualValue: 58,
      autoResidual: true,
      moneyFactor: 0.0020,
      acquisitionFee: 895,
      dispositionFee: 495,
      taxMode: "on_payment",
      taxRateOverride: undefined,
      allowedMilesPerYear: 12000,
      expectedMilesPerYear: 12000,
      overMileFee: 0.25,
    },
  });

  const [buy, setBuy] = useState({
    purchasePrice: 38000,
    downPayment: 4000,
    termMonths: 60,
    apr: 6.9,
    advanced: {
      docFee: 300,
      registrationFee: 400,
      maintenanceDeltaPerYear: 150,
      insuranceDeltaPerYear: 100,
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
    const s = { vehiclePrice: 38000, ownershipYears: 5, taxRate: 8.5, depreciation: { mode: "simple", finalPercent: 50, autoFinal: true } };
    const l = { termMonths: 36, monthlyPayment: 0, downPayment: 2500, totalFees: 500, advanced: { useAdvanced: true, capCost: undefined, residualMode: "percent", residualValue: 58, autoResidual: true, moneyFactor: 0.0020, acquisitionFee: 895, dispositionFee: 495, taxMode: "on_payment", taxRateOverride: undefined, allowedMilesPerYear: 12000, expectedMilesPerYear: 12000, overMileFee: 0.25 } };
    const b = { purchasePrice: 38000, downPayment: 4000, termMonths: 60, apr: 6.9, advanced: { docFee: 300, registrationFee: 400, maintenanceDeltaPerYear: 150, insuranceDeltaPerYear: 100, resaleOverridePercent: undefined } };
    setScenario(s); setLease(l); setBuy(b);
    setResults(calculateBuyVsLease({ scenario: s, lease: l, buy: b }));
  }

  // Estimate residual % based on ownership duration (average market baseline)
  function estimateResidualPercent(years) {
    const anchors = [
      { y: 0, p: 100 },
      { y: 1, p: 80 },
      { y: 2, p: 70 },
      { y: 3, p: 58 },
      { y: 4, p: 48 },
      { y: 5, p: 40 },
      { y: 6, p: 33 },
      { y: 7, p: 28 },
      { y: 8, p: 24 },
    ];
    const x = Math.max(0, Math.min(8, Number(years || 0)));
    // find segment
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      if (x >= a.y && x <= b.y) {
        const t = (x - a.y) / (b.y - a.y || 1);
        return Math.round((a.p + (b.p - a.p) * t) * 10) / 10;
      }
    }
    return anchors[anchors.length - 1].p;
  }

  // Auto-update residual percent when ownership duration changes
  useEffect(() => {
    const auto = lease?.advanced?.autoResidual !== false; // default true
    const mode = lease?.advanced?.residualMode || "percent";
    if (!auto || mode !== "percent") return;
    const estimated = estimateResidualPercent(scenario?.ownershipYears ?? 3);
    setLease((prev) => ({
      ...prev,
      advanced: { ...prev.advanced, residualValue: estimated },
    }));
  }, [scenario.ownershipYears, lease?.advanced?.autoResidual, lease?.advanced?.residualMode]);

  // Auto-update depreciation final percent (simple mode) based on ownership duration
  useEffect(() => {
    const dep = scenario?.depreciation || {};
    if (dep.mode !== "simple" || dep.autoFinal === false) return;
    const estimated = estimateResidualPercent(scenario?.ownershipYears ?? 3);
    setScenario((prev) => {
      const curr = prev?.depreciation?.finalPercent;
      if (curr === estimated) return prev;
      return { ...prev, depreciation: { ...prev.depreciation, finalPercent: estimated } };
    });
  }, [scenario.ownershipYears, scenario?.depreciation?.mode, scenario?.depreciation?.autoFinal]);

  return (
    <div className="min-h-screen bg-bg-page text-neutral-900">
      <Helmet>
  <title>Buy vs Lease Car Calculator | FinWorld</title>
  <meta name="description" content="Compare total cost of buying vs leasing a car, including money factor/APR, fees, miles, and resale value." />
  <link rel="canonical" href={canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Buy vs Lease Car Calculator | FinWorld" />
  <meta property="og:description" content="Compare total cost of buying vs leasing a car, including money factor/APR, fees, miles, and resale value." />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content="https://www.finworld.live/assets/finworld-preview.png" />
  <script type="application/ld+json">{JSON.stringify({ '@context':'https://schema.org','@type':'FAQPage', mainEntity: [ { '@type':'Question', name:'Is it cheaper to lease or buy a car?', acceptedAnswer:{'@type':'Answer', text:'It depends on term length, money factor/APR, fees, and resale value. This calculator compares total costs over your chosen period.'}}, { '@type':'Question', name:'What is a money factor?', acceptedAnswer:{'@type':'Answer', text:'Money factor is the leasing equivalent of APR. Multiply by 2400 to approximate APR.'}}, { '@type':'Question', name:'How do miles affect a lease?', acceptedAnswer:{'@type':'Answer', text:'Exceeding the allowed miles per year increases cost via per-mile fees. The tool includes this.'}} ] })}</script>
</Helmet>
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

        <Insights scenario={scenario} results={results} cheaperText={cheaperText} />
      </main>
    </div>
  );
}