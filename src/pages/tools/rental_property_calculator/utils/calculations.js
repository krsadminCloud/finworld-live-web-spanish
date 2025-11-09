// Pure calculation helpers for Rental Property Calculator (FinWorld Edition)

export function clampNumber(value, min = 0, max = Number.POSITIVE_INFINITY) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function toNumber(v) {
  const n = typeof v === 'string' ? parseFloat(v.replace(/,/g, '')) : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function mortgageMonthlyPI({ purchasePrice, downPaymentPct, interestRatePct, termYears }) {
  const loanAmount = toNumber(purchasePrice) * (1 - toNumber(downPaymentPct) / 100);
  const monthlyRate = (toNumber(interestRatePct) / 100) / 12;
  const n = toNumber(termYears) * 12;
  if (n <= 0) return { monthlyPI: 0, loanAmount };
  if (monthlyRate === 0) return { monthlyPI: loanAmount / n, loanAmount };
  const factor = Math.pow(1 + monthlyRate, n);
  const monthlyPI = loanAmount * (monthlyRate * factor) / (factor - 1);
  return { monthlyPI, loanAmount };
}

export function pointsCost({ loanAmount, pointsPct }) {
  return toNumber(loanAmount) * (toNumber(pointsPct) / 100);
}

export function incomeCalcs({ monthlyRent, otherIncome, vacancyRatePct, customIncome = [] }) {
  const customSum = Array.isArray(customIncome)
    ? customIncome.reduce((sum, item) => sum + toNumber(item?.amount), 0)
    : 0;
  const grossMonthlyIncome = toNumber(monthlyRent) + toNumber(otherIncome) + customSum;
  const vacancyMonthly = grossMonthlyIncome * (toNumber(vacancyRatePct) / 100);
  const effectiveMonthlyIncome = grossMonthlyIncome - vacancyMonthly;
  const effectiveAnnualIncome = effectiveMonthlyIncome * 12;
  return { grossMonthlyIncome, vacancyMonthly, effectiveMonthlyIncome, effectiveAnnualIncome };
}

export function expenseCalcs({
  propertyTaxesAnnual,
  insuranceAnnual,
  maintenanceMonthly,
  capexMonthly,
  managementPct,
  hoaMonthly,
  utilitiesMonthly,
  garbageSewerMonthly,
  grossMonthlyIncome,
}) {
  const taxesMonthly = toNumber(propertyTaxesAnnual) / 12;
  const insuranceMonthly = toNumber(insuranceAnnual) / 12;
  const managementMonthly = toNumber(grossMonthlyIncome) * (toNumber(managementPct) / 100);
  const operatingMonthly = taxesMonthly + insuranceMonthly + toNumber(maintenanceMonthly) + toNumber(capexMonthly)
    + toNumber(hoaMonthly) + toNumber(utilitiesMonthly) + toNumber(garbageSewerMonthly) + managementMonthly;
  const operatingAnnual = operatingMonthly * 12;
  return { taxesMonthly, insuranceMonthly, managementMonthly, operatingMonthly, operatingAnnual };
}

export function capRatePct({ noiAnnual, purchasePrice }) {
  const price = toNumber(purchasePrice);
  if (price <= 0) return 0;
  return (toNumber(noiAnnual) / price) * 100;
}

export function totalInvestmentNeeded({ purchasePrice, downPaymentPct, closingCosts, pointsPct }) {
  const downPayment = toNumber(purchasePrice) * (toNumber(downPaymentPct) / 100);
  const { loanAmount } = mortgageMonthlyPI({ purchasePrice, downPaymentPct, interestRatePct: 0, termYears: 30 });
  const points = pointsCost({ loanAmount, pointsPct });
  return { downPayment, points, totalInvestment: downPayment + toNumber(closingCosts) + points };
}

export function cashOnCashPct({ monthlyCashFlow, totalInvestment }) {
  const invest = toNumber(totalInvestment);
  if (invest <= 0) return 0;
  return ((toNumber(monthlyCashFlow) * 12) / invest) * 100;
}

// Compute cumulative principal paid over first `months` of the loan
export function principalPaidOverMonths({ purchasePrice, downPaymentPct, interestRatePct, termYears, months }) {
  const { loanAmount } = mortgageMonthlyPI({ purchasePrice, downPaymentPct, interestRatePct, termYears });
  const monthlyRate = (toNumber(interestRatePct) / 100) / 12;
  const n = toNumber(termYears) * 12;
  if (n <= 0 || loanAmount <= 0) return 0;
  let balance = loanAmount;
  let principalPaid = 0;
  const { monthlyPI } = mortgageMonthlyPI({ purchasePrice, downPaymentPct, interestRatePct, termYears });
  const m = Math.min(months, n);
  for (let i = 0; i < m; i++) {
    const interest = balance * monthlyRate;
    const principal = Math.max(0, monthlyPI - interest);
    balance = Math.max(0, balance - principal);
    principalPaid += principal;
  }
  return principalPaid;
}

export function fiveYearRoiPct({ monthlyCashFlow, totalInvestment, purchasePrice, downPaymentPct, interestRatePct, termYears }) {
  const cumulativeCashFlow5yr = toNumber(monthlyCashFlow) * 12 * 5;
  const equityGain5yr = principalPaidOverMonths({ purchasePrice, downPaymentPct, interestRatePct, termYears, months: 60 });
  const invest = toNumber(totalInvestment);
  if (invest <= 0) return 0;
  return ((cumulativeCashFlow5yr + equityGain5yr) / invest) * 100;
}

export function fullAnalysis(inputs) {
  const { monthlyPI, loanAmount } = mortgageMonthlyPI(inputs.loan);
  const income = incomeCalcs({
    monthlyRent: inputs.income.monthlyRent,
    otherIncome: inputs.income.otherIncome,
    vacancyRatePct: inputs.expenses.vacancyRatePct,
    customIncome: inputs.income.custom,
  });
  const expenses = expenseCalcs({
    propertyTaxesAnnual: inputs.expenses.propertyTaxes,
    insuranceAnnual: inputs.expenses.insurance,
    maintenanceMonthly: inputs.expenses.maintenance,
    capexMonthly: inputs.expenses.capex,
    managementPct: inputs.expenses.managementPct,
    hoaMonthly: inputs.expenses.hoa,
    utilitiesMonthly: inputs.expenses.utilities,
    garbageSewerMonthly: inputs.expenses.garbageSewer,
    grossMonthlyIncome: income.grossMonthlyIncome,
  });
  const noiAnnual = income.effectiveAnnualIncome - expenses.operatingAnnual;
  const capRate = capRatePct({ noiAnnual, purchasePrice: inputs.property.purchasePrice });
  const monthlyCashFlow = income.effectiveMonthlyIncome - expenses.operatingMonthly - monthlyPI;
  const investBreakdown = totalInvestmentNeeded({
    purchasePrice: inputs.property.purchasePrice,
    downPaymentPct: inputs.loan.downPaymentPct,
    closingCosts: inputs.property.closingCosts,
    pointsPct: inputs.loan.points,
  });
  const coc = cashOnCashPct({ monthlyCashFlow, totalInvestment: investBreakdown.totalInvestment });
  const roi5 = fiveYearRoiPct({
    monthlyCashFlow,
    totalInvestment: investBreakdown.totalInvestment,
    purchasePrice: inputs.property.purchasePrice,
    downPaymentPct: inputs.loan.downPaymentPct,
    interestRatePct: inputs.loan.interestRatePct,
    termYears: inputs.loan.termYears,
  });

  return {
    loanAmount,
    monthlyPI,
    income,
    expenses,
    noiAnnual,
    capRate,
    monthlyCashFlow,
    investBreakdown,
    coc,
    roi5,
  };
}

export function roiSeriesOverYears(inputs) {
  const result = [];
  const invest = totalInvestmentNeeded({
    purchasePrice: inputs.property.purchasePrice,
    downPaymentPct: inputs.loan.downPaymentPct,
    closingCosts: inputs.property.closingCosts,
    pointsPct: inputs.loan.points,
  }).totalInvestment;
  const { monthlyPI } = mortgageMonthlyPI(inputs.loan);
  const income = incomeCalcs({
    monthlyRent: inputs.income.monthlyRent,
    otherIncome: inputs.income.otherIncome,
    vacancyRatePct: inputs.expenses.vacancyRatePct,
    customIncome: inputs.income.custom,
  });
  const exp = expenseCalcs({
    propertyTaxesAnnual: inputs.expenses.propertyTaxes,
    insuranceAnnual: inputs.expenses.insurance,
    maintenanceMonthly: inputs.expenses.maintenance,
    capexMonthly: inputs.expenses.capex,
    managementPct: inputs.expenses.managementPct,
    hoaMonthly: inputs.expenses.hoa,
    utilitiesMonthly: inputs.expenses.utilities,
    garbageSewerMonthly: inputs.expenses.garbageSewer,
    grossMonthlyIncome: income.grossMonthlyIncome,
  });
  const monthlyCashFlow = income.effectiveMonthlyIncome - exp.operatingMonthly - monthlyPI;
  for (let year = 0; year <= 5; year++) {
    const months = year * 12;
    const equity = principalPaidOverMonths({
      purchasePrice: inputs.property.purchasePrice,
      downPaymentPct: inputs.loan.downPaymentPct,
      interestRatePct: inputs.loan.interestRatePct,
      termYears: inputs.loan.termYears,
      months,
    });
    const cumulativeCF = monthlyCashFlow * months;
    const roiPct = invest > 0 ? ((cumulativeCF + equity) / invest) * 100 : 0;
    result.push({ year, roiPct });
  }
  return result;
}

