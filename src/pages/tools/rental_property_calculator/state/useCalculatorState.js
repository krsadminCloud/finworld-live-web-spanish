import { useMemo, useState, useCallback } from 'react';
import { fullAnalysis, roiSeriesOverYears } from '../utils/calculations';

export const DEFAULTS = {
  property: {
    address: '',
    purchasePrice: 350000,
    closingCosts: 5000,
  },
  loan: {
    downPaymentPct: 20,
    interestRatePct: 6.5,
    termYears: 30,
    points: 0,
  },
  income: {
    monthlyRent: 2500,
    otherIncome: 0,
    custom: [],
  },
  expenses: {
    propertyTaxes: 3500, // annual
    insurance: 1200, // annual
    maintenance: 150, // monthly
    capex: 150, // monthly
    managementPct: 8,
    hoa: 0,
    utilities: 0,
    garbageSewer: 0,
    vacancyRatePct: 5,
  },
};

export function useCalculatorState(initial = DEFAULTS) {
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

