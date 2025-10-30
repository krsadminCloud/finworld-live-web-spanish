export function formatNumberWithCommas(value) {
  if (value === null || value === undefined || isNaN(value)) return '';
  return value.toLocaleString('en-US');
}

export function parseNumberFromFormattedString(stringValue) {
  if (typeof stringValue !== 'string') return stringValue;
  const cleanedString = stringValue.replace(/,/g, '');
  const parsedValue = Number(cleanedString);
  return isNaN(parsedValue) ? undefined : parsedValue;
}
