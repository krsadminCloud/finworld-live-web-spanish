import { FICA_LIMITS, FED_STD, FED_BRACKETS, STATE_MODELS } from './taxData';
import { getStateDeductionInfo } from './StateDeductions';

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

const STATUS_MAP = {
  single: 'single',
  mfj: 'mfj',
  mfs: 'single',
  hoh: 'single'
};

function getStateDeductionAmount(state, year, status) {
  const info = getStateDeductionInfo(state, year);
  if (!info || !info.data) {
    return { amount: 0, type: 'none', note: '' };
  }

  const statusKey = STATUS_MAP[status] || 'single';
  const data = info.data;
  let amount = 0;
  let type = 'none';
  let note = data.phaseOut || info.notes || '';

  if (data.standard && typeof data.standard[statusKey] === 'number') {
    amount = data.standard[statusKey];
    type = 'standard';
    note = data.standard.note || note;
  } else if (data.exemptions && typeof data.exemptions[statusKey] === 'number') {
    amount = data.exemptions[statusKey];
    type = 'exemptions';
    note = data.exemptions.note || note;
  } else if (data.credit && typeof data.credit[statusKey] === 'string') {
    type = 'credit';
    note = data.credit.note || note;
  }

  return { amount: Math.max(0, amount || 0), type, note };
}

function buildDeductionSuffix(deduction) {
  if (!deduction) return '';
  if (deduction.amount > 0) {
    return ` (after ${deduction.type} deduction of ${formatCurrency(deduction.amount)})`;
  }
  if (deduction.note) {
    return ` (${deduction.note})`;
  }
  return '';
}

export function calcStateTax(agi, state, year = 2025, status = 'single') {
  const m = STATE_MODELS[state];

  if (!m) {
    const deduction = getStateDeductionAmount(state, year, status);
    const taxable = Math.max(0, agi - deduction.amount);
    const eff = Math.max(0, Math.min(0.05, (taxable - 40000) / 400000));
    return {
      tax: taxable * eff,
      taxable,
      deductionAmount: deduction.amount,
      deductionType: deduction.type,
      info: `Estimated ${Math.round(eff * 1000) / 10}%${buildDeductionSuffix(deduction)}`,
      marginalRate: eff
    };
  }

  if (m.type === 'flat') {
    const deduction = getStateDeductionAmount(state, year, status);
    const taxable = Math.max(0, agi - deduction.amount);
    const rate = m.rate || 0;

    return {
      tax: taxable * rate,
      taxable,
      deductionAmount: deduction.amount,
      deductionType: deduction.type,
      info: `Flat ${((m.rate || 0) * 100).toFixed(2)}%${buildDeductionSuffix(deduction)}`,
      marginalRate: m.rate || 0
    };
  }

  let tax = 0;
  let last = 0;
  let marginal = 0;
  const deduction = getStateDeductionAmount(state, year, status);
  const taxable = Math.max(0, agi - deduction.amount);

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

  const deductionSuffix = buildDeductionSuffix(deduction);

  return {
    tax,
    taxable,
    deductionAmount: deduction.amount,
    deductionType: deduction.type,
    info: `Marginal ${(marginal * 100).toFixed(2)}%${deductionSuffix}`,
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
