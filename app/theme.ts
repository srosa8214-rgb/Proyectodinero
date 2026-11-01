import { CurrencyCode } from './types';

export interface Theme {
  dark: boolean;
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  success: string;
  error: string;
  warning: string;
  inputBg: string;
  inputBorder: string;
  chartGrid: string;
  tabBg: string;
  overlay: string;
}

export const lightTheme: Theme = {
  dark: false,
  bg: '#f8faf9',
  bgSecondary: '#ffffff',
  bgTertiary: '#f1f5f4',
  card: '#ffffff',
  cardBorder: '#e2e8e0',
  text: '#0f1a14',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  primary: '#16a34a',
  primaryDark: '#15803d',
  primaryLight: '#dcfce7',
  accent: '#059669',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  inputBg: '#f8faf9',
  inputBorder: '#d1d5db',
  chartGrid: '#e2e8e0',
  tabBg: '#ffffff',
  overlay: 'rgba(0,0,0,0.4)',
};

export const darkTheme: Theme = {
  dark: true,
  bg: '#0a0f0c',
  bgSecondary: '#111815',
  bgTertiary: '#161e1a',
  card: '#161e1a',
  cardBorder: '#233029',
  text: '#f0fdf4',
  textSecondary: '#a7c4b5',
  textMuted: '#5a6b62',
  primary: '#22c55e',
  primaryDark: '#16a34a',
  primaryLight: '#14532d',
  accent: '#34d399',
  success: '#22c55e',
  error: '#f87171',
  warning: '#fbbf24',
  inputBg: '#111815',
  inputBorder: '#2d3b34',
  chartGrid: '#1e2924',
  tabBg: '#111815',
  overlay: 'rgba(0,0,0,0.6)',
};

export function getTheme(dark: boolean): Theme {
  return dark ? darkTheme : lightTheme;
}

export function formatCurrency(amount: number, currencyCode: CurrencyCode): string {
  const symbols: Record<CurrencyCode, string> = { MXN: '$', USD: '$', EUR: '€' };
  const symbol = symbols[currencyCode] ?? '$';
  const formatted = Math.abs(amount).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-');
  const d = new Date(parseInt(y), parseInt(m) - 1, 1);
  return d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function currentMonthKey(): string {
  return todayISO().slice(0, 7);
}
