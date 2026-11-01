import { Category, Currency, CurrencyCode } from './types';

export const CATEGORIES: Category[] = [
  { id: 'comida', label: 'Comida', icon: 'UtensilsCrossed', color: '#22c55e' },
  { id: 'transporte', label: 'Transporte', icon: 'Bus', color: '#3b82f6' },
  { id: 'entretenimiento', label: 'Entretenimiento', icon: 'Clapperboard', color: '#ec4899' },
  { id: 'compras', label: 'Compras', icon: 'ShoppingBag', color: '#f59e0b' },
  { id: 'escuela', label: 'Escuela', icon: 'GraduationCap', color: '#8b5cf6' },
  { id: 'otros', label: 'Otros', icon: 'Package', color: '#64748b' },
  { id: 'salario', label: 'Salario', icon: 'Wallet', color: '#10b981' },
];

export const CURRENCIES: Currency[] = [
  { code: 'MXN', symbol: '$', label: 'Peso Mexicano (MXN)' },
  { code: 'USD', symbol: '$', label: 'Dólar (USD)' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR)' },
];

export function getCurrency(code: CurrencyCode): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
