function monthlyPayment(principal, annualRatePct, termMonths) {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = (annualRatePct / 100) / 12;
  if (r === 0) return principal / termMonths;
  const n = termMonths;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

function buildDepreciationCurve(price, years, mode) {
  const months = Math.max(1, Math.round(years * 12));
  const values = new Array(months + 1).fill(0);
  if (mode?.mode === "schedule" && Array.isArray(mode.yearlyDrops) && mode.yearlyDrops.length) {
    let value = price;
    values[0] = value;
    for (let m = 1; m <= months; m++) {
      const yearIdx = Math.ceil(m / 12) - 1;
      const dropPct = Math.max(0, Math.min(100, mode.yearlyDrops[yearIdx] ?? mode.yearlyDrops[mode.yearlyDrops.length - 1])) / 100;
      const monthlyDrop = dropPct / 12; // linearized within year
      value = Math.max(0, value * (1 - monthlyDrop));
      values[m] = value;
    }
  } else {
    const finalPct = Math.max(0, Math.min(100, mode?.finalPercent ?? 50)) / 100;
    const finalValue = price * finalPct;
    const monthsN = months;
    const monthlyDecay = monthsN > 0 ? (price - finalValue) / monthsN : 0;
    for (let m = 0; m <= monthsN; m++) values[m] = Math.max(0, price - monthlyDecay * m);
  }
  return values;
}

function computeLeaseAdvancedMonthly({ capCost, residualMode, residualValue, termMonths, moneyFactor, taxMode, taxRate, downPayment }) {
  const term = Math.max(1, Number(termMonths || 36));
  const cap = Math.max(0, Number(capCost || 0));
  const down = Math.max(0, Number(downPayment || 0));
  const capAdj = Math.max(0, cap - down);
  const residual = Math.max(0, residualMode === "percent" ? cap * (Math.max(0, Math.min(100, Number(residualValue || 0))) / 100) : Number(residualValue || 0));
  const mf = Math.max(0, Number(moneyFactor || 0));
  const baseDep = (capAdj - residual) / term;
  const baseFin = (capAdj + residual) * mf;
  const base = Math.max(0, baseDep + baseFin);
  const tRate = Math.max(0, Number(taxRate || 0));
  const monthly = taxMode === "on_payment" ? base * (1 + tRate) : base;
  return { monthly, base, capAdj, residual };
}

function calcBreakEven(cLease, cBuy) {
  const months = Math.min(cLease.length, cBuy.length) - 1;
  for (let m = 0; m <= months; m++) {
    if (cBuy[m] <= cLease[m]) return m;
  }
  return null;
}

export function calculateBuyVsLease({ scenario, lease, buy }) {
  const vehiclePrice = Number(scenario.vehiclePrice ?? 30000);
  const ownershipYears = Number(scenario.ownershipYears ?? 5);
  const ownershipMonths = Math.max(1, Math.round(ownershipYears * 12));
  const taxRateScenario = Math.max(0, Number(scenario.taxRate ?? 0)) / 100;
  const depreciation = scenario.depreciation || { mode: "simple", finalPercent: 50 };

  const curve = buildDepreciationCurve(vehiclePrice, ownershipYears, depreciation);
  const endValue = curve[curve.length - 1];

  // Lease inputs
  const leaseTerm = Math.max(1, Number(lease.termMonths ?? 36));
  const leaseDown = Math.max(0, Number(lease.downPayment ?? 0));
  const leaseFees = Math.max(0, Number(lease.totalFees ?? 0));
  const la = lease.advanced || {};
  const taxMode = la.taxMode === "on_price" ? "on_price" : "on_payment";
  const leaseTaxRate = Math.max(0, Number(la.taxRateOverride != null ? la.taxRateOverride : taxRateScenario));
  let leaseMonthly = Math.max(0, Number(lease.monthlyPayment ?? 450));
  const acquisitionFee = Math.max(0, Number(la.acquisitionFee ?? 0));
  const dispositionFee = Math.max(0, Number(la.dispositionFee ?? 0));
  const allowedMiles = Math.max(0, Number(la.allowedMilesPerYear ?? 12000));
  const expectedMiles = Math.max(0, Number(la.expectedMilesPerYear ?? 12000));
  const overMileFee = Math.max(0, Number(la.overMileFee ?? 0));

  const useAdvancedLease = la && (la.capCost != null || la.residualValue != null || la.moneyFactor != null || la.taxMode != null);
  let upfrontTaxPerTerm = 0;
  if (useAdvancedLease) {
    const capCost = Number(la.capCost ?? vehiclePrice);
    const adv = computeLeaseAdvancedMonthly({
      capCost,
      residualMode: la.residualMode || "percent",
      residualValue: la.residualValue ?? 55,
      termMonths: leaseTerm,
      moneyFactor: la.moneyFactor ?? 0.0015,
      taxMode,
      taxRate: leaseTaxRate,
      downPayment: leaseDown,
    });
    leaseMonthly = adv.monthly;
    if (taxMode === "on_price") {
      upfrontTaxPerTerm = capCost * leaseTaxRate; // approximate
    }
  }

  // Build lease cumulative series
  const leaseCum = [];
  let lCum = 0;
  const termsCount = Math.ceil(ownershipMonths / leaseTerm);
  for (let m = 0; m <= ownershipMonths; m++) {
    if (m > 0) {
      lCum += leaseMonthly;
      // term boundaries
      if ((m - 1) % leaseTerm === 0) {
        // start of a term
        lCum += leaseDown + leaseFees + acquisitionFee + upfrontTaxPerTerm;
      }
      // over-mile fees at end of each full term
      if (m % leaseTerm === 0) {
        const extraMilesPerYear = Math.max(0, expectedMiles - allowedMiles);
        const extraMilesThisTerm = (extraMilesPerYear * 12) * (leaseTerm / 12);
        lCum += (extraMilesThisTerm / 12) * (overMileFee / 1); // distribute per month effectively
      }
    }
    leaseCum.push(lCum);
  }
  // disposition at the very end
  leaseCum[leaseCum.length - 1] += dispositionFee;

  // Buy inputs
  const purchasePrice = Number(buy.purchasePrice ?? vehiclePrice);
  const downPaymentBuy = Math.max(0, Number(buy.downPayment ?? 0));
  const termMonthsBuy = Math.max(0, Number(buy.termMonths ?? 60));
  const aprBuy = Math.max(0, Number(buy.apr ?? 0));
  const ba = buy.advanced || {};
  const docFee = Math.max(0, Number(ba.docFee ?? 0));
  const registrationFee = Math.max(0, Number(ba.registrationFee ?? 0));
  const maintDelta = Number(ba.maintenanceDeltaPerYear ?? 0);
  const insDelta = Number(ba.insuranceDeltaPerYear ?? 0);
  const resaleOverridePercent = ba.resaleOverridePercent != null ? Math.max(0, Math.min(100, Number(ba.resaleOverridePercent))) / 100 : null;

  const upfrontTaxBuy = purchasePrice * taxRateScenario;
  const principal = Math.max(0, purchasePrice - downPaymentBuy + docFee + registrationFee + upfrontTaxBuy);
  const buyMonthlyPayment = monthlyPayment(principal, aprBuy, termMonthsBuy);

  // Build buy cumulative series
  const buyCum = [];
  let bCum = 0;
  for (let m = 0; m <= ownershipMonths; m++) {
    if (m === 1) {
      bCum += downPaymentBuy + docFee + registrationFee + upfrontTaxBuy;
    }
    if (m > 0 && m <= termMonthsBuy) {
      bCum += buyMonthlyPayment;
    }
    // annual adjustments distributed monthly
    bCum += (maintDelta + insDelta) / 12;
    buyCum.push(bCum);
  }

  // Apply resale value at the end
  const resaleValue = resaleOverridePercent != null ? purchasePrice * resaleOverridePercent : endValue;
  buyCum[buyCum.length - 1] = Math.max(0, buyCum[buyCum.length - 1] - resaleValue);

  const totalLease = leaseCum[leaseCum.length - 1];
  const totalBuy = buyCum[buyCum.length - 1];
  let cheaper = "tie";
  if (totalBuy < totalLease - 1e-6) cheaper = "buy";
  else if (totalLease < totalBuy - 1e-6) cheaper = "lease";
  const difference = Math.round(Math.abs(totalBuy - totalLease));
  const breakEvenMonth = calcBreakEven(leaseCum, buyCum);

  return {
    ownershipMonths,
    depreciation: { endValue, valueLost: Math.max(0, vehiclePrice - endValue) },
    lease: { totalCost: Math.round(totalLease), monthly: Math.round(leaseMonthly), termsCount },
    buy: { totalCost: Math.round(totalBuy), monthly: Math.round(buyMonthlyPayment) },
    comparison: { cheaper, difference, breakEvenMonth },
    series: { lease: leaseCum, buy: buyCum },
  };
}

