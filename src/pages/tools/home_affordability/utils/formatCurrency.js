/**
 * Currency and number formatting utilities
 */

/**
 * Format currency with proper locale formatting
 */
export function formatCurrency(amount, options = {}) {
  const {
    locale = 'en-US',
    currency = 'USD',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    compact = false
  } = options;

  // Handle null, undefined, or invalid amounts
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0';
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: 'short'
  });

  return formatter.format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  });

  return formatter.format(value);
}

/**
 * Format input values for display in sliders
 */
export function formatSliderValue(value, type = 'currency') {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  switch (type) {
    case 'currency':
      if (value >= 1000000) {
        return formatCurrency(value / 1000000, { maximumFractionDigits: 1 }) + 'M';
      } else if (value >= 1000) {
        return formatCurrency(value / 1000, { maximumFractionDigits: 1 }) + 'K';
      } else {
        return formatCurrency(value, { maximumFractionDigits: 0 });
      }
    case 'percentage':
      return formatPercentage(value, 1);
    case 'number':
      return new Intl.NumberFormat('en-US').format(Math.round(value));
    default:
      return value.toString();
  }
}

/**
 * Parse formatted input value back to number
 */
export function parseInputValue(value, type = 'currency') {
  if (!value) return 0;

  // Remove currency symbols, commas, and other formatting
  const cleanValue = value.toString().replace(/[$,%\s]/g, '');
  
  const num = parseFloat(cleanValue);
  return isNaN(num) ? 0 : num;
}

/**
 * Format number for display in input fields
 */
export function formatInputValue(value, type = 'currency') {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }

  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    case 'percentage':
      return value.toFixed(1);
    case 'number':
      return new Intl.NumberFormat('en-US').format(Math.round(value));
    default:
      return value.toString();
  }
}
