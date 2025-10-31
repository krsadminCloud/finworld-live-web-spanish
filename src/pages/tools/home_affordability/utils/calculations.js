/**
 * Utility functions for home affordability calculations
 * Based on standard mortgage underwriting guidelines
 */

/**
 * Calculate monthly mortgage payment using standard formula
 * P = r * [1 + r]^n / [1 + r]^n - 1
 * Where: P = Payment, r = monthly interest rate, n = number of payments
 */
export function calculateMonthlyPayment(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numPayments;
  }
  
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                  (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return payment;
}

/**
 * Calculate maximum affordable home price based on debt-to-income ratios
 */
export function calculateMaxAffordablePrice(inputs) {
  const {
    annualIncome,
    monthlyDebts,
    interestRate,
    loanTerm,
    downPayment,
    propertyTaxRate,
    insuranceAmount,
    hoaFees,
    mortgageToIncomeRatio = 28,
    debtToIncomeRatio = 36
  } = inputs;

  // Calculate monthly income
  const monthlyIncome = annualIncome / 12;

  // Maximum monthly mortgage payment based on DTI ratio
  const maxMortgagePayment = (monthlyIncome * debtToIncomeRatio / 100) - monthlyDebts;

  // Also check mortgage-to-income ratio as secondary constraint
  const mortgageOnlyLimit = monthlyIncome * mortgageToIncomeRatio / 100;
  const allowedMortgagePayment = Math.min(maxMortgagePayment, mortgageOnlyLimit);

  // Estimate monthly taxes, insurance, and HOA
  const monthlyPropertyTax = 0; // Will be calculated based on home price
  const monthlyInsurance = insuranceAmount / 12;
  const monthlyHOA = hoaFees;

  // Available for principal and interest
  const pAndI = allowedMortgagePayment - monthlyPropertyTax - monthlyInsurance - monthlyHOA;

  // Use binary search to find the maximum loan amount
  let low = 0;
  let high = inputs.maxHomePrice || 1000000;
  let maxLoan = 0;

  while (high - low > 1000) {
    const mid = (low + high) / 2;
    const payment = calculateMonthlyPayment(mid, interestRate, loanTerm);
    
    if (payment <= pAndI) {
      maxLoan = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  // Total home price = loan + down payment
  const maxHomePrice = maxLoan + downPayment;
  
  return Math.max(0, maxHomePrice);
}

/**
 * Calculate complete PITI breakdown
 */
export function calculatePITIBreakdown(homePrice, inputs) {
  const {
    downPayment,
    interestRate,
    loanTerm,
    propertyTaxRate,
    insuranceAmount,
    hoaFees
  } = inputs;

  const loanAmount = homePrice - downPayment;
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
  const principalAndInterest = monthlyPayment;
  const monthlyPropertyTax = (homePrice * propertyTaxRate / 100) / 12;
  const monthlyInsurance = insuranceAmount / 12;
  const monthlyHOA = hoaFees;
  const totalMonthlyPayment = principalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyHOA;

  return {
    loanAmount,
    principalAndInterest,
    propertyTax: monthlyPropertyTax,
    insurance: monthlyInsurance,
    hoa: monthlyHOA,
    totalMonthlyPayment
  };
}

/**
 * Calculate debt-to-income ratios
 */
export function calculateRatios(inputs, homePrice) {
  const { annualIncome, monthlyDebts } = inputs;
  const monthlyIncome = annualIncome / 12;
  const piti = calculatePITIBreakdown(homePrice, inputs);
  
  const debtToIncomeRatio = ((piti.totalMonthlyPayment + monthlyDebts) / monthlyIncome) * 100;
  const mortgageToIncomeRatio = (piti.totalMonthlyPayment / monthlyIncome) * 100;

  return {
    debtToIncomeRatio,
    mortgageToIncomeRatio
  };
}

/**
 * Get lender recommendations based on ratios
 */
export function getLenderRecommendations(dti, mti) {
  const recommendations = [];
  
  if (dti <= 28 && mti <= 28) {
    recommendations.push({
      type: 'success',
      title: 'Excellent Position',
      message: 'Your debt-to-income ratios are well within conventional lending guidelines. You should have access to the best rates.'
    });
  } else if (dti <= 36 && mti <= 36) {
    recommendations.push({
      type: 'warning',
      title: 'Good Position',
      message: 'Your ratios are acceptable for most lenders, though you may want to consider reducing debt to qualify for better rates.'
    });
  } else if (dti <= 43) {
    recommendations.push({
      type: 'warning',
      title: 'Consider Reducing Debt',
      message: 'Your debt-to-income ratio is approaching the maximum for conventional loans. Consider paying down existing debts.'
    });
  } else {
    recommendations.push({
      type: 'error',
      title: 'High DTI Ratio',
      message: 'Your debt-to-income ratio exceeds conventional lending guidelines. You may need to reduce debts or increase income.'
    });
  }

  // Add specific recommendations
  if (dti > 36) {
    recommendations.push({
      type: 'info',
      title: 'Tip: Debt Reduction',
      message: 'Paying down high-interest debt can significantly improve your borrowing power and interest rates.'
    });
  }

  return recommendations;
}

/**
 * Compare affordability at different interest rates
 */
export function compareScenarios(baseInputs, comparisonRate) {
  const basePrice = calculateMaxAffordablePrice(baseInputs);
  const comparisonInputs = { ...baseInputs, interestRate: comparisonRate };
  const comparisonPrice = calculateMaxAffordablePrice(comparisonInputs);
  
  return {
    basePrice,
    comparisonPrice,
    difference: comparisonPrice - basePrice,
    impact: ((comparisonPrice - basePrice) / basePrice) * 100
  };
}
