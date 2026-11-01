import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Transaction, SavingsGoal, Settings } from './types';
import {
  loadTransactions,
  saveTransactions,
  loadGoals,
  saveGoals,
  loadSettings,
  saveSettings,
  isInitialized,
  setInitialized,
  clearAll,
  DEFAULT_SETTINGS,
} from './storage';
import { SAMPLE_TRANSACTIONS, SAMPLE_GOALS } from './sampleData';

interface FinanceContextType {
  transactions: Transaction[];
  goals: SavingsGoal[];
  settings: Settings;
  loading: boolean;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
  contributeGoal: (id: string, amount: number) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  clearAllData: () => Promise<void>;
  loadSampleData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const initialized = await isInitialized();
      if (!initialized) {
        await saveTransactions(SAMPLE_TRANSACTIONS);
        await saveGoals(SAMPLE_GOALS);
        await setInitialized();
        setTransactions(SAMPLE_TRANSACTIONS);
        setGoals(SAMPLE_GOALS);
      } else {
        const txs = await loadTransactions();
        const gls = await loadGoals();
        setTransactions(txs);
        setGoals(gls);
      }
      const s = await loadSettings();
      setSettings(s);
      setLoading(false);
    })();
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = { ...tx, id: genId(), createdAt: Date.now() };
    setTransactions((prev) => {
      const next = [newTx, ...prev];
      saveTransactions(next);
      return next;
    });
  }, []);

  const updateTransaction = useCallback(
    (id: string, tx: Omit<Transaction, 'id' | 'createdAt'>) => {
      setTransactions((prev) => {
        const next = prev.map((t) =>
          t.id === id ? { ...tx, id, createdAt: t.createdAt } : t
        );
        saveTransactions(next);
        return next;
      });
    },
    []
  );

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveTransactions(next);
      return next;
    });
  }, []);

  const addGoal = useCallback((goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = { ...goal, id: genId(), createdAt: Date.now() };
    setGoals((prev) => {
      const next = [...prev, newGoal];
      saveGoals(next);
      return next;
    });
  }, []);

  const updateGoal = useCallback((id: string, goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    setGoals((prev) => {
      const next = prev.map((g) =>
        g.id === id ? { ...goal, id, createdAt: g.createdAt } : g
      );
      saveGoals(next);
      return next;
    });
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => {
      const next = prev.filter((g) => g.id !== id);
      saveGoals(next);
      return next;
    });
  }, []);

  const contributeGoal = useCallback((id: string, amount: number) => {
    setGoals((prev) => {
      const next = prev.map((g) =>
        g.id === id ? { ...g, current: Math.max(0, g.current + amount) } : g
      );
      saveGoals(next);
      return next;
    });
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  const clearAllData = useCallback(async () => {
    await clearAll();
    setTransactions([]);
    setGoals([]);
    setSettings(DEFAULT_SETTINGS);
    await setInitialized();
  }, []);

  const loadSampleData = useCallback(async () => {
    await saveTransactions(SAMPLE_TRANSACTIONS);
    await saveGoals(SAMPLE_GOALS);
    await setInitialized();
    setTransactions(SAMPLE_TRANSACTIONS);
    setGoals(SAMPLE_GOALS);
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        goals,
        settings,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        contributeGoal,
        updateSettings,
        clearAllData,
        loadSampleData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextType {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
