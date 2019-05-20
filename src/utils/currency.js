import { round } from './Math';

export const toLocaleCurrency = (amount, percision = 2) => round(amount).toLocaleString('en-EN', {
  minimumFractionDigits: percision,
  maximumFractionDigits: percision,
});
