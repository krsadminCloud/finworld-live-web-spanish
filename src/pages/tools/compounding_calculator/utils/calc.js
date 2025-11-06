// Core calculations for compounding calculator

const COMPOUNDING_PER_YEAR = {
  yearly: 1,
  semiannual: 2,
  quarterly: 4,
  monthly: 12,
  weekly: 52,
  daily: 365,
};

const CONTRIBUTION_FREQ_PER_YEAR = {
  yearly: 1,
  semiannual: 2,
  quarterly: 4,
  monthly: 12,
  weekly: 52,
};

const RATE_UNIT_MULTIPLIER = {
  annual: 1,
  monthly: 12,
  weekly: 52,
};

export function sanitizeNumber(v, fallback = 0) {
  if (v === null || v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function toAnnualNominal(ratePercent, rateUnit) {
  const r = sanitizeNumber(ratePercent, 0) / 100;
  const mult = RATE_UNIT_MULTIPLIER[rateUnit] ?? 1;
  return r * mult; // nominal annual rate
}

export function effectiveAnnualYield(annualNominal, m) {
  return Math.pow(1 + annualNominal / m, m) - 1;
}

export function timeToDoubleYears(annualNominal, m) {
  if (annualNominal <= 0) return Infinity;
  const per = Math.log(1 + annualNominal / m);
  return Math.log(2) / (m * per);
}

// Future value of lump sum with discrete compounding
export function futureValuePrincipal(P, annualNominal, years, m) {
  return P * Math.pow(1 + annualNominal / m, m * years);
}

// Future value of contributions bridging to contribution frequency
export function futureValueContrib(C, annualNominal, years, m, f, due) {
  if (!C || C <= 0 || years <= 0) return 0;
  const ic = Math.pow(1 + annualNominal / m, m / f) - 1; // effective per contribution period
  const n = Math.round(years * f);
  if (ic === 0) return C * n;
  const factor = (Math.pow(1 + ic, n) - 1) / ic;
  return C * factor * (due ? 1 + ic : 1);
}

export function buildSchedule({
  initial,
  annualNominal,
  years,
  compounding, // per year (m)
  contribution = 0,
  contribFreq = 12, // per year (f)
  due = false,
  granularity = "yearly", // or "monthly"
  maxMonthlySteps = 600,
}) {
  const stepsPerYear = granularity === "monthly" ? 12 : 1;
  const requestedSteps = Math.round(years * stepsPerYear);
  let totalSteps = requestedSteps;
  let capped = false;
  if (granularity === "monthly" && totalSteps > maxMonthlySteps) {
    totalSteps = maxMonthlySteps;
    capped = true;
  }
  const m = compounding;
  const stepRate = Math.pow(1 + annualNominal / m, m / stepsPerYear) - 1;

  const contribEverySteps = Math.round(stepsPerYear / contribFreq);

  let balance = sanitizeNumber(initial, 0);
  const rows = [];
  let totalContrib = 0;
  let totalInterest = 0;
  let cumContrib = 0;
  let cumInterest = 0;

  for (let i = 1; i <= totalSteps; i++) {
    let contribThisStep = 0;
    const isContribStep = contribEverySteps > 0 && i % contribEverySteps === 0;
    if (contribution > 0 && isContribStep && due) {
      contribThisStep = contribution;
      balance += contribThisStep;
      totalContrib += contribThisStep;
    }

    const interest = balance * stepRate;
    balance += interest;
    totalInterest += interest;

    if (contribution > 0 && isContribStep && !due) {
      contribThisStep = contribution;
      balance += contribThisStep;
      totalContrib += contribThisStep;
    }

    cumContrib += contribThisStep;
    cumInterest += interest;
    rows.push({ period: i, contribution: contribThisStep, interest, balance, cumContribution: cumContrib, cumInterest });
  }

  return {
    rows,
    totalContrib,
    totalInterest,
    finalBalance: balance,
    meta: { granularity, stepsGenerated: totalSteps, stepsRequested: requestedSteps, capped },
  };
}

export function calculateAll(params) {
  const {
    initialInvestment,
    ratePercent,
    rateUnit = "annual",
    compoundingFrequency = "monthly",
    years = 5,
    months = 0,
    contribution = 0,
    contributionFrequency = "monthly",
    timing = "end",
    chartGranularity = "yearly",
  } = params;

  const m = COMPOUNDING_PER_YEAR[compoundingFrequency] ?? 12;
  const f = CONTRIBUTION_FREQ_PER_YEAR[contributionFrequency] ?? 12;
  const due = timing === "begin";
  const yrs = sanitizeNumber(years, 0) + sanitizeNumber(months, 0) / 12;
  const P = sanitizeNumber(initialInvestment, 0);
  const C = sanitizeNumber(contribution, 0);

  const nominalAnnual = toAnnualNominal(ratePercent, rateUnit);
  const ear = effectiveAnnualYield(nominalAnnual, m);

  const fvPrincipal = futureValuePrincipal(P, nominalAnnual, yrs, m);
  const fvContrib = futureValueContrib(C, nominalAnnual, yrs, m, f, due);
  const FV = fvPrincipal + fvContrib;

  const totalContrib = C > 0 ? Math.round(yrs * f) * C : 0;
  const totalInterest = FV - (P + totalContrib);

  const ror = (FV - (P + totalContrib)) / Math.max(P + totalContrib, 1);
  const tDoubleYears = timeToDoubleYears(nominalAnnual, m);

  const schedule = buildSchedule({
    initial: P,
    annualNominal: nominalAnnual,
    years: yrs,
    compounding: m,
    contribution: C,
    contribFreq: f,
    due,
    granularity: chartGranularity,
  });

  return {
    inputs: {
      initialInvestment: P,
      ratePercent,
      rateUnit,
      compoundingFrequency,
      years: yrs,
      contribution: C,
      contributionFrequency,
      timing,
    },
    outputs: {
      futureValue: FV,
      totalInterest,
      initialInvestment: P,
      totalContributions: totalContrib,
      effectiveAnnualYield: ear,
      compoundedRateEffective: ear,
      rateOfReturn: ror,
      timeToDoubleYears: tDoubleYears,
    },
    schedule,
  };
}

export function formatYearsMonths(decimalYears) {
  if (!Number.isFinite(decimalYears) || decimalYears === Infinity) return { years: Infinity, months: 0 };
  const years = Math.floor(decimalYears);
  const months = Math.round((decimalYears - years) * 12);
  return { years, months };
}

