/**
 * Loan calculation utilities for auto loan early payoff calculator
 */

/**
 * Calculate monthly payment for a loan
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (as decimal)
 * @param {number} termMonths - Loan term in months
 * @returns {number} Monthly payment amount
 */
export const calculateMonthlyPayment = (principal, annualRate, termMonths) => {
  if (annualRate === 0) return principal / termMonths;
  
  const monthlyRate = annualRate / 12;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  
  return (principal * monthlyRate * factor) / (factor - 1);
};

/**
 * Calculate total payment and interest for standard loan
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (as decimal)
 * @param {number} termMonths - Loan term in months
 * @returns {Object} Payment details
 */
export const calculateStandardLoan = (principal, annualRate, termMonths) => {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - principal;
  
  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    termMonths
  };
};

/**
 * Calculate accelerated loan payoff with extra payments
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (as decimal)
 * @param {number} termMonths - Original loan term in months
 * @param {number} extraPayment - Extra payment amount
 * @param {number} extraPaymentFrequency - 1 for monthly, 2 for biweekly
 * @returns {Object} Accelerated payment details
 */
export const calculateAcceleratedLoan = (principal, annualRate, termMonths, extraPayment = 0, extraPaymentFrequency = 1) => {
  const monthlyRate = annualRate / 12;
  let balance = principal;
  let month = 0;
  let totalInterest = 0;
  const schedule = [];
  
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  
  while (balance > 0.01 && month < termMonths + 120) { // Add safety buffer
    month++;
    const interestPayment = balance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;
    
    // Add extra payment if applicable
    let currentExtraPayment = 0;
    if (extraPayment > 0 && month % extraPaymentFrequency === 0) {
      currentExtraPayment = extraPayment;
      principalPayment += extraPayment;
    }
    
    // Ensure we don't overpay
    if (principalPayment > balance) {
      principalPayment = balance;
    }
    
    balance -= principalPayment;
    totalInterest += interestPayment;
    
    schedule.push({
      month,
      payment: monthlyPayment,
      extraPayment: currentExtraPayment,
      totalPayment: monthlyPayment + currentExtraPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance)
    });
    
    if (balance <= 0.01) break;
  }
  
  const totalPayment = principal + totalInterest;
  const paymentsSaved = termMonths - month;
  const interestSaved = calculateStandardLoan(principal, annualRate, termMonths).totalInterest - totalInterest;
  
  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    actualMonths: month,
    paymentsSaved,
    interestSaved,
    schedule: schedule.slice(0, 24) // Return first 24 months for display
  };
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage for display
 * @param {number} rate - Rate as decimal (e.g., 0.065 for 6.5%)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (rate) => {
  return `${(rate * 100).toFixed(2)}%`;
};

/**
 * Calculate payoff date based on months from start date
 * @param {Date} startDate - Start date
 * @param {number} months - Number of months
 * @returns {Date} Payoff date
 */
export const calculatePayoffDate = (startDate, months) => {
  const payoffDate = new Date(startDate);
  payoffDate.setMonth(payoffDate.getMonth() + months);
  return payoffDate;
};

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Generate comparison data for charts
 * @param {Object} standardLoan - Standard loan details
 * @param {Object} acceleratedLoan - Accelerated loan details
 * @returns {Object} Chart data
 */
export const generateChartData = (standardLoan, acceleratedLoan) => {
  return {
    costBreakdown: [
      {
        name: 'Principal',
        value: standardLoan.principal,
        color: '#00C1B0'
      },
      {
        name: 'Interest',
        value: acceleratedLoan.totalInterest,
        color: '#E0F7F5'
      }
    ],
    timelineComparison: [
      {
        name: 'Standard',
        months: standardLoan.termMonths,
        color: '#697586'
      },
      {
        name: 'Accelerated',
        months: acceleratedLoan.actualMonths,
        color: '#00C1B0'
      }
    ]
  };
};