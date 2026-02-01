import i18n from '../i18n';

export const formatCurrency = (value, currency = 'USD') => {
  const lang = i18n.language || 'en-US';
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value, options = {}) => {
  const lang = i18n.language || 'en-US';
  return new Intl.NumberFormat(lang, options).format(value);
};

export const formatPercent = (value, decimals = 2) => {
  const lang = i18n.language || 'en-US';
  // Assumes value is like 5.5 for 5.5% (not 0.055)
  return new Intl.NumberFormat(lang, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};