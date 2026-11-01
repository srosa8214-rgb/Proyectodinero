import { Transaction, SavingsGoal } from './types';

function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: 's1', type: 'ingreso', amount: 8500, description: 'Quincena', category: 'salario', date: dateOffset(2), createdAt: Date.now() - 200000 },
  { id: 's2', type: 'gasto', amount: 320, description: 'Súper de la semana', category: 'comida', date: dateOffset(1), createdAt: Date.now() - 180000 },
  { id: 's3', type: 'gasto', amount: 150, description: 'Uber al trabajo', category: 'transporte', date: dateOffset(3), createdAt: Date.now() - 160000 },
  { id: 's4', type: 'gasto', amount: 450, description: 'Cine con amigos', category: 'entretenimiento', date: dateOffset(5), createdAt: Date.now() - 140000 },
  { id: 's5', type: 'gasto', amount: 1200, description: 'Tenis nuevos', category: 'compras', date: dateOffset(7), createdAt: Date.now() - 120000 },
  { id: 's6', type: 'gasto', amount: 600, description: 'Libros y útiles', category: 'escuela', date: dateOffset(10), createdAt: Date.now() - 100000 },
  { id: 's7', type: 'ingreso', amount: 2000, description: 'Venta de artículos', category: 'otros', date: dateOffset(12), createdAt: Date.now() - 80000 },
  { id: 's8', type: 'gasto', amount: 80, description: 'Café', category: 'comida', date: dateOffset(8), createdAt: Date.now() - 60000 },
];

export const SAMPLE_GOALS: SavingsGoal[] = [
  { id: 'g1', title: 'Viaje a la playa', target: 15000, current: 4200, createdAt: Date.now() - 300000 },
  { id: 'g2', title: 'Laptop nueva', target: 25000, current: 12000, createdAt: Date.now() - 250000 },
];
