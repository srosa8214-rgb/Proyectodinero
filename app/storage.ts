import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, SavingsGoal, Settings } from './types';

const KEYS = {
  transactions: 'mi_dinero_transactions',
  goals: 'mi_dinero_goals',
  settings: 'mi_dinero_settings',
  initialized: 'mi_dinero_initialized',
};

export const DEFAULT_SETTINGS: Settings = {
  currency: 'MXN',
  darkMode: false,
};

export async function loadTransactions(): Promise<Transaction[]> {
  const raw = await AsyncStorage.getItem(KEYS.transactions);
  return raw ? JSON.parse(raw) : [];
}

export async function saveTransactions(txs: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.transactions, JSON.stringify(txs));
}

export async function loadGoals(): Promise<SavingsGoal[]> {
  const raw = await AsyncStorage.getItem(KEYS.goals);
  return raw ? JSON.parse(raw) : [];
}

export async function saveGoals(goals: SavingsGoal[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.goals, JSON.stringify(goals));
}

export async function loadSettings(): Promise<Settings> {
  const raw = await AsyncStorage.getItem(KEYS.settings);
  return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

export async function isInitialized(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.initialized);
  return raw === 'true';
}

export async function setInitialized(): Promise<void> {
  await AsyncStorage.setItem(KEYS.initialized, 'true');
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.transactions);
  await AsyncStorage.removeItem(KEYS.goals);
  await AsyncStorage.removeItem(KEYS.settings);
  await AsyncStorage.removeItem(KEYS.initialized);
}
