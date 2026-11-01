export type TransactionType = 'ingreso' | 'gasto';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  createdAt: number;
}

export interface Category {
  id: string;
  label: string;
  icon: string; // lucide icon name
  color: string;
}

export type CurrencyCode = 'MXN' | 'USD' | 'EUR';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  label: string;
}

export interface Settings {
  currency: CurrencyCode;
  darkMode: boolean;
}

export interface MonthlyStats {
  monthKey: string; // YYYY-MM
  monthLabel: string;
  ingresos: number;
  gastos: number;
  ahorro: number;
}
