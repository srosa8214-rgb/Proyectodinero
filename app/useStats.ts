import { useMemo } from 'react';
import { Transaction } from './types';
import { monthKey, currentMonthKey } from './theme';

export function useStats(transactions: Transaction[]) {
  return useMemo(() => {
    const curMonth = currentMonthKey();

    const monthTransactions = transactions.filter((t) => monthKey(t.date) === curMonth);
    const ingresosMes = monthTransactions
      .filter((t) => t.type === 'ingreso')
      .reduce((s, t) => s + t.amount, 0);
    const gastosMes = monthTransactions
      .filter((t) => t.type === 'gasto')
      .reduce((s, t) => s + t.amount, 0);

    const totalIngresos = transactions
      .filter((t) => t.type === 'ingreso')
      .reduce((s, t) => s + t.amount, 0);
    const totalGastos = transactions
      .filter((t) => t.type === 'gasto')
      .reduce((s, t) => s + t.amount, 0);
    const disponible = totalIngresos - totalGastos;
    const ahorroMes = ingresosMes - gastosMes;

    // Category breakdown for current month (gastos)
    const categoryBreakdown: Record<string, number> = {};
    monthTransactions
      .filter((t) => t.type === 'gasto')
      .forEach((t) => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] ?? 0) + t.amount;
      });

    // Last 6 months stats
    const monthlyStats: { key: string; label: string; ingresos: number; gastos: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('es-MX', { month: 'short' });
      const monthTxs = transactions.filter((t) => monthKey(t.date) === key);
      const ing = monthTxs.filter((t) => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0);
      const gas = monthTxs.filter((t) => t.type === 'gasto').reduce((s, t) => s + t.amount, 0);
      monthlyStats.push({ key, label, ingresos: ing, gastos: gas });
    }

    return {
      disponible,
      ingresosMes,
      gastosMes,
      ahorroMes,
      totalIngresos,
      totalGastos,
      categoryBreakdown,
      monthlyStats,
    };
  }, [transactions]);
}
