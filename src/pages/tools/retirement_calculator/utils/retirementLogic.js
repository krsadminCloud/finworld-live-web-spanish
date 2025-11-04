/**
 * Retirement Calculator Logic
 * Contains functions for calculating retirement projections and formatting values
 */

/**
 * Calculate the total monthly savings from an array of saving entries
 * @param {Array} monthlySavings - Array of saving entries with {id, name, value}
 * @returns {number} Total monthly savings amount
 */
export const calculateTotalSavings = (monthlySavings) => {
  return monthlySavings.reduce((total, saving) => total + saving.value, 0);
};

/**
 * Calculate the projected retirement income based on current income and savings
 * @param {number} currentIncome - Current monthly income
 * @param {Array} monthlySavings - Array of saving entries with {id, name, value}
 * @returns {number} Projected retirement income
 */
export const calculateRetirementProjection = (currentIncome, monthlySavings) => {
  const totalSavings = calculateTotalSavings(monthlySavings);
  return currentIncome - totalSavings;
};

/**
 * Calculate the percentage of income that goes to savings
 * @param {number} currentIncome - Current monthly income
 * @param {Array} monthlySavings - Array of saving entries with {id, name, value}
 * @returns {number} Percentage of income saved (0-100)
 */
export const calculateSavingsPercentage = (currentIncome, monthlySavings) => {
  if (currentIncome === 0) return 0;
  return (calculateTotalSavings(monthlySavings) / currentIncome) * 100;
};

/**
 * Calculate the percentage of income kept as retirement income
 * @param {number} currentIncome - Current monthly income
 * @param {Array} monthlySavings - Array of saving entries with {id, name, value}
 * @returns {number} Percentage of income kept (0-100)
 */
export const calculateRetirementIncomePercentage = (currentIncome, monthlySavings) => {
  if (currentIncome === 0) return 0;
  const retirementProjection = calculateRetirementProjection(currentIncome, monthlySavings);
  return (retirementProjection / currentIncome) * 100;
};

/**
 * Format a currency value
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};
