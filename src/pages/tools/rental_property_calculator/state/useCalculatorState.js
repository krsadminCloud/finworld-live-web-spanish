import { useMemo, useState, useCallback } from 'react';
import { fullAnalysis, roiSeriesOverYears } from '../utils/calculations';

export const DEFAULTS = {
  property: {
    address: '123 Main St',
    purchasePrice: 500000,
    closingCosts: 5,
    closingIsDollar: false,
    allCash: false,
  },
  loan: {
    downPaymentPct: 20,
    interestRatePct: 5.5,
    termYears: 30,
    points: 0,
  },
  income: {
    monthlyRent: 4500,
    otherIncome: 0,
    custom: [],
  },
  expenses: {
    propertyTaxes: 8000, // annual
    insurance: 1200, // annual
    maintenance: 150, // monthly
    capex: 150, // monthly
    managementPct: 8,
    hoa: 150,
    utilities: 200,
    garbageSewer: 50,
    vacancyRatePct: 5,
    custom: [],
  },
};

export const BLANKS = {
  property: { address: '', purchasePrice: '', closingCosts: '', closingIsDollar: false, allCash: false },
  loan: { downPaymentPct: '', interestRatePct: '', termYears: '', points: '' },
  income: { monthlyRent: '', otherIncome: '', custom: [] },
  expenses: {
    propertyTaxes: '',
    insurance: '',
    maintenance: '',
    capex: '',
    managementPct: '',
    hoa: '',
    utilities: '',
    garbageSewer: '',
    vacancyRatePct: '',
    overrideOperatingMonthly: '',
    custom: [],
  },
};

export function useCalculatorState(initial = BLANKS) {
  const [property, setProperty] = useState(initial.property);
  const [loan, setLoan] = useState(initial.loan);
  const [income, setIncome] = useState(initial.income);
  const [expenses, setExpenses] = useState(initial.expenses);

  const inputs = useMemo(() => ({ property, loan, income, expenses }), [property, loan, income, expenses]);

  const analysis = useMemo(() => fullAnalysis(inputs), [inputs]);
  const roiSeries = useMemo(() => roiSeriesOverYears(inputs), [inputs]);

  const reset = useCallback(() => {
    setProperty(DEFAULTS.property);
    setLoan(DEFAULTS.loan);
    setIncome(DEFAULTS.income);
    setExpenses(DEFAULTS.expenses);
  }, []);

  return {
    inputs,
    setProperty,
    setLoan,
    setIncome,
    setExpenses,
    analysis,
    roiSeries,
    reset,
  };
}
