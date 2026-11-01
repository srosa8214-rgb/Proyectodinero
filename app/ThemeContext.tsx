import { createContext, useContext, ReactNode } from 'react';
import { useFinance } from './FinanceContext';
import { Theme, getTheme, formatCurrency, formatDate, monthKey, monthLabel, todayISO, currentMonthKey } from './theme';

const ThemeContext = createContext<Theme>(getTheme(false));

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useFinance();
  const theme = getTheme(settings.darkMode);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export { formatCurrency, formatDate, monthKey, monthLabel, todayISO, currentMonthKey };
