import { CurrencySymbol } from '../enums/currency.enum';

export function getCurrencySymbol(code: string): string {
  if (!code) {
    return '';
  }
  const upper = code?.toUpperCase() as keyof typeof CurrencySymbol;
  return CurrencySymbol[upper] || code; // fallback to showing the code if not found
}
