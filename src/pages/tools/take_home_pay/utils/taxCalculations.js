import { FICA_LIMITS, FED_STD, FED_BRACKETS, STATE_MODELS } from './taxData';

export function formatCurrency(n) {
  return (isFinite(n) ? n : 0).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
}

export function calcFederalTax(year, agi, status) {
  const std = (FED_STD[year] || FED_STD[2025])[status] || 0;
  const taxable = Math.max(0, agi - std);
  const brackets = (FED_BRACKETS[year] || FED_BRACKETS[2025])[status] || FED_BRACKETS[2025].single;

  let tax = 0;
  let last = 0;
  let marginalRate = 0;

  for (const [upto, rate] of brackets) {
    const span = Math.min(taxable, upto) - last;
    if (span > 0) {
      tax += span * rate;
      last = upto;
      marginalRate = rate;
    }
    if (taxable <= upto) break;
  }

  return { tax, taxable, marginalRate, std };
}

export function calcStateTax(agi, state) {
  const m = STATE_MODELS[state];

  if (!m) {
    const eff = Math.max(0, Math.min(0.05, (agi - 40000) / 400000));
    return {
      tax: agi * eff,
      info: `Estimated ${Math.round(eff * 1000) / 10}%`,
      marginalRate: eff
    };
  }

  if (m.type === 'flat') {
    return {
      tax: agi * (m.rate || 0),
      info: `Flat ${((m.rate || 0) * 100).toFixed(2)}%`,
      marginalRate: m.rate || 0
    };
  }

  let tax = 0;
  let last = 0;
  let marginal = 0;
  const taxable = agi - (m.std || 0);

  if (m.brackets) {
    for (const [upto, rate] of m.brackets) {
      const span = Math.min(taxable, upto) - last;
      if (span > 0) {
        tax += span * rate;
        last = upto;
        marginal = rate;
      }
      if (taxable <= upto) break;
    }
  }

  return {
    tax,
    info: `Marginal ${(marginal * 100).toFixed(2)}%`,
    marginalRate: marginal
  };
}

export function calcFicaTax(year, income, status) {
  const limits = FICA_LIMITS[year] || FICA_LIMITS[2025];

  let socialSecurityTax = Math.min(income, limits.ss_limit) * limits.ss_rate;
  let medicareTax = income * limits.med_rate;

  if (income > limits.add_med_threshold[status]) {
    medicareTax += (income - limits.add_med_threshold[status]) * 0.009;
  }

  return socialSecurityTax + medicareTax;
}
