import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Calendar, Filter, X, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react-native';
import { useTheme, formatCurrency, formatDate, monthKey, monthLabel } from '../ThemeContext';
import { useFinance } from '../FinanceContext';
import { CATEGORIES, getCategory } from '../constants';
import { CategoryIcon } from '../../components/CategoryIcon';
import { BarChart } from '../../components/Charts';
import { Transaction } from '../types';

type FilterType = 'todos' | 'ingresos' | 'gastos';

export default function HistoryScreen() {
  const theme = useTheme();
  const { transactions, settings } = useFinance();
  const [filter, setFilter] = useState<FilterType>('todos');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);

  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map((t) => monthKey(t.date)));
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions].sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return b.createdAt - a.createdAt;
    });
    if (filter === 'ingresos') list = list.filter((t) => t.type === 'ingreso');
    if (filter === 'gastos') list = list.filter((t) => t.type === 'gasto');
    if (categoryFilter) list = list.filter((t) => t.category === categoryFilter);
    if (monthFilter) list = list.filter((t) => monthKey(t.date) === monthFilter);
    return list;
  }, [transactions, filter, categoryFilter, monthFilter]);

  const stats = useMemo(() => {
    const ingresos = filtered.filter((t) => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0);
    const gastos = filtered.filter((t) => t.type === 'gasto').reduce((s, t) => s + t.amount, 0);
    const balance = ingresos - gastos;
    return { ingresos, gastos, balance, count: filtered.length };
  }, [filtered]);

  const monthlyChart = useMemo(() => {
    return availableMonths.slice(0, 6).reverse().map((mk) => {
      const monthTxs = transactions.filter((t) => monthKey(t.date) === mk);
      const [y, m] = mk.split('-');
      const d = new Date(parseInt(y), parseInt(m) - 1, 1);
      return {
        label: d.toLocaleDateString('es-MX', { month: 'short' }),
        ingresos: monthTxs.filter((t) => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0),
        gastos: monthTxs.filter((t) => t.type === 'gasto').reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions, availableMonths]);

  function clearFilters() {
    setCategoryFilter(null);
    setMonthFilter(null);
    setFilter('todos');
  }

  const hasFilters = filter !== 'todos' || categoryFilter || monthFilter;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Historial</Text>
      </View>

      {/* Filter buttons */}
      <View style={styles.filterSection}>
        <View style={[styles.typeFilter, { backgroundColor: theme.bgTertiary }]}>
          {(['todos', 'ingresos', 'gastos'] as FilterType[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor: filter === f ? theme.primary : 'transparent',
              }}
              onPress={() => setFilter(f)}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  fontFamily: 'Inter-SemiBold',
                  color: filter === f ? '#fff' : theme.textSecondary,
                  textTransform: 'capitalize',
                }}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterBtnRow}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                backgroundColor: monthFilter ? theme.primaryLight : theme.bgTertiary,
                borderColor: monthFilter ? theme.primary : theme.cardBorder,
              },
            ]}
            onPress={() => setShowMonthModal(true)}
          >
            <Calendar size={15} color={monthFilter ? theme.primary : theme.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.filterBtnText,
                { color: monthFilter ? theme.primary : theme.textSecondary },
              ]}
              numberOfLines={1}
            >
              {monthFilter ? monthLabel(monthFilter) : 'Mes'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                backgroundColor: categoryFilter ? theme.primaryLight : theme.bgTertiary,
                borderColor: categoryFilter ? theme.primary : theme.cardBorder,
              },
            ]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Filter size={15} color={categoryFilter ? theme.primary : theme.textSecondary} strokeWidth={2} />
            <Text
              style={[
                styles.filterBtnText,
                { color: categoryFilter ? theme.primary : theme.textSecondary },
              ]}
              numberOfLines={1}
            >
              {categoryFilter ? getCategory(categoryFilter)?.label ?? 'Categoría' : 'Categoría'}
            </Text>
          </TouchableOpacity>

          {hasFilters && (
            <TouchableOpacity
              style={[styles.clearBtn, { borderColor: theme.error + '40' }]}
              onPress={clearFilters}
            >
              <X size={15} color={theme.error} strokeWidth={2} />
              <Text style={[styles.clearBtnText, { color: theme.error }]}>Limpiar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary stats */}
        <View style={[styles.statsSummary, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.statSummaryItem}>
            <TrendingUp size={16} color={theme.primary} strokeWidth={2.5} />
            <Text style={[styles.statSummaryValue, { color: theme.primary }]}>
              {formatCurrency(stats.ingresos, settings.currency)}
            </Text>
            <Text style={[styles.statSummaryLabel, { color: theme.textMuted }]}>Ingresos</Text>
          </View>
          <View style={[styles.statSummaryDivider, { backgroundColor: theme.cardBorder }]} />
          <View style={styles.statSummaryItem}>
            <TrendingDown size={16} color={theme.error} strokeWidth={2.5} />
            <Text style={[styles.statSummaryValue, { color: theme.error }]}>
              {formatCurrency(stats.gastos, settings.currency)}
            </Text>
            <Text style={[styles.statSummaryLabel, { color: theme.textMuted }]}>Gastos</Text>
          </View>
          <View style={[styles.statSummaryDivider, { backgroundColor: theme.cardBorder }]} />
          <View style={styles.statSummaryItem}>
            <BarChart3 size={16} color={theme.text} strokeWidth={2.5} />
            <Text style={[styles.statSummaryValue, { color: stats.balance >= 0 ? theme.primary : theme.error }]}>
              {formatCurrency(stats.balance, settings.currency)}
            </Text>
            <Text style={[styles.statSummaryLabel, { color: theme.textMuted }]}>Balance</Text>
          </View>
        </View>

        {/* Monthly chart */}
        {monthlyChart.length > 0 && (
          <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Comparativa mensual</Text>
            <BarChart data={monthlyChart} currency={settings.currency} />
          </View>
        )}

        {/* Transaction list */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {stats.count} {stats.count === 1 ? 'movimiento' : 'movimientos'}
        </Text>

        {filtered.length > 0 ? (
          filtered.map((tx) => {
            const cat = getCategory(tx.category);
            return (
              <View
                key={tx.id}
                style={[styles.txItem, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              >
                <View style={[styles.txIcon, { backgroundColor: (cat?.color ?? '#64748b') + '20' }]}>
                  <CategoryIcon name={cat?.icon ?? 'Package'} size={18} color={cat?.color ?? '#64748b'} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={[styles.txDesc, { color: theme.text }]} numberOfLines={1}>
                    {tx.description}
                  </Text>
                  <Text style={[styles.txMeta, { color: theme.textMuted }]}>
                    {formatDate(tx.date)} · {cat?.label}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    { color: tx.type === 'ingreso' ? theme.primary : theme.error },
                  ]}
                >
                  {tx.type === 'ingreso' ? '+' : '-'}
                  {formatCurrency(tx.amount, settings.currency)}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            No hay movimientos que coincidan con los filtros.
          </Text>
        )}
      </ScrollView>

      {/* Category filter modal */}
      <Modal visible={showCategoryModal} transparent animationType="slide" onRequestClose={() => setShowCategoryModal(false)}>
        <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.sheet, { backgroundColor: theme.bgSecondary }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>Filtrar por categoría</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)} style={styles.closeBtn}>
                <X size={22} color={theme.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              <TouchableOpacity
                style={[styles.optionItem, { borderColor: theme.cardBorder }]}
                onPress={() => {
                  setCategoryFilter(null);
                  setShowCategoryModal(false);
                }}
              >
                <Text style={[styles.optionText, { color: theme.text }]}>Todas las categorías</Text>
                {!categoryFilter && <Text style={{ color: theme.primary }}>✓</Text>}
              </TouchableOpacity>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.optionItem, { borderColor: theme.cardBorder }]}
                  onPress={() => {
                    setCategoryFilter(cat.id);
                    setShowCategoryModal(false);
                  }}
                >
                  <View style={styles.optionLeft}>
                    <View style={[styles.optionIcon, { backgroundColor: cat.color + '20' }]}>
                      <CategoryIcon name={cat.icon} size={18} color={cat.color} />
                    </View>
                    <Text style={[styles.optionText, { color: theme.text }]}>{cat.label}</Text>
                  </View>
                  {categoryFilter === cat.id && <Text style={{ color: theme.primary }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Month filter modal */}
      <Modal visible={showMonthModal} transparent animationType="slide" onRequestClose={() => setShowMonthModal(false)}>
        <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.sheet, { backgroundColor: theme.bgSecondary }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>Filtrar por mes</Text>
              <TouchableOpacity onPress={() => setShowMonthModal(false)} style={styles.closeBtn}>
                <X size={22} color={theme.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              <TouchableOpacity
                style={[styles.optionItem, { borderColor: theme.cardBorder }]}
                onPress={() => {
                  setMonthFilter(null);
                  setShowMonthModal(false);
                }}
              >
                <Text style={[styles.optionText, { color: theme.text }]}>Todos los meses</Text>
                {!monthFilter && <Text style={{ color: theme.primary }}>✓</Text>}
              </TouchableOpacity>
              {availableMonths.map((mk) => (
                <TouchableOpacity
                  key={mk}
                  style={[styles.optionItem, { borderColor: theme.cardBorder }]}
                  onPress={() => {
                    setMonthFilter(mk);
                    setShowMonthModal(false);
                  }}
                >
                  <Text style={[styles.optionText, { color: theme.text, textTransform: 'capitalize' }]}>
                    {monthLabel(mk)}
                  </Text>
                  {monthFilter === mk && <Text style={{ color: theme.primary }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  typeFilter: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },
  filterBtnRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statsSummary: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  statSummaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statSummaryDivider: {
    width: 1,
  },
  statSummaryValue: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  statSummaryLabel: {
    fontSize: 12,
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: {
    flex: 1,
  },
  txDesc: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  txMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 30,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  closeBtn: {
    padding: 6,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
});
