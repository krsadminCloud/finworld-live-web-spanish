export default function formatCurrency(value, currency = "USD", decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return "$0.00";

  return value.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
