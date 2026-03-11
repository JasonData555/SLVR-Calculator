// Shared currency/number formatters

const usdFull = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** Format as full USD: $1,234,567 */
export function fmt(value: number): string {
  return usdFull.format(Math.round(value));
}

/** Format as compact USD: $1.2M, $45K */
export function fmtCompact(value: number): string {
  return usdCompact.format(Math.round(value));
}
