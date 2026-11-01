import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, formatCurrency, formatDate, currentMonthKey, monthLabel } from '../ThemeContext';
import { useFinance } from '../FinanceContext';
import { useStats } from '../useStats';
import { getCategory } from '../constants';import { BarChart, DonutChart } from '../../components/Charts';
import { CategoryIcon } from '../../components/CategoryIcon';
import { TransactionModal } from '../../components/TransactionModal';
import { FadeInCard } from '../../components/Animated';
import { Transaction } from '../types';

export default function DashboardScreen() {
  const theme = useTheme();
  const { transactions, settings } = useFinance();
  const stats = useStats(transactions);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'ingreso' | 'gasto'>('gasto');
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const donutData = useMemo(() => {
    return Object.entries(stats.categoryBreakdown)
      .map(([catId, value]) => {
        const cat = getCategory(catId);
        return {
          label: cat?.label ?? catId,
          value,
          color: cat?.color ?? '#64748b',
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [stats.categoryBreakdown]);

  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    [transactions]
  );

  function openAdd(type: 'ingreso' | 'gasto') {
    setEditTx(null);
    setModalType(type);
    setModalVisible(true);
  }

  function openEdit(tx: Transaction) {
    setEditTx(tx);
    setModalVisible(true);
  }

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>Mi Dinero</Text>
            <Text style={[styles.monthLabel, { color: theme.text }]}>
              {monthLabel(currentMonthKey())}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => openAdd('gasto')}
          >
            <Plus size={20} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Balance card */}
        <LinearGradient
          colors={[theme.primary, theme.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceTop}>
            <Wallet size={24} color="#fff" strokeWidth={2} />
            <Text style={styles.balanceLabel}>Dinero disponible</Text>
          </View>
          <Text style={styles.balanceAmount}>
            {formatCurrency(stats.disponible, settings.currency)}
          </Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceSubItem}>
              <View style={styles.balanceSubLeft}>
                <TrendingUp size={16} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
                <Text style={styles.balanceSubLabel}>Ingresos</Text>
              </View>
              <Text style={styles.balanceSubValue}>
                {formatCurrency(stats.totalIngresos, settings.currency)}
              </Text>
            </View>
            <View style={styles.balanceSubItem}>
              <View style={styles.balanceSubLeft}>
                <TrendingDown size={16} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
                <Text style={styles.balanceSubLabel}>Gastos</Text>
              </View>
              <Text style={styles.balanceSubValue}>
                {formatCurrency(stats.totalGastos, settings.currency)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Month stats */}
        <View style={styles.statsRow}>
          <FadeInCard delay={0} style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={[styles.statIconBox, { backgroundColor: theme.primaryLight }]}>
              <TrendingUp size={18} color={theme.primary} strokeWidth={2.5} />
            </View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Ingresos del mes</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {formatCurrency(stats.ingresosMes, settings.currency)}
            </Text>
          </FadeInCard>

          <FadeInCard delay={80} style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#fee2e2' }]}>
              <TrendingDown size={18} color={theme.error} strokeWidth={2.5} />
            </View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Gastos del mes</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {formatCurrency(stats.gastosMes, settings.currency)}
            </Text>
          </FadeInCard>
        </View>

        <View style={[styles.savingsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={[styles.statIconBox, { backgroundColor: stats.ahorroMes >= 0 ? '#dcfce7' : '#fee2e2' }]}>
            <PiggyBank size={18} color={stats.ahorroMes >= 0 ? theme.primary : theme.error} strokeWidth={2.5} />
          </View>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Ahorro del mes</Text>
          <Text style={[styles.statValue, { color: stats.ahorroMes >= 0 ? theme.primary : theme.error }]}>
            {formatCurrency(stats.ahorroMes, settings.currency)}
          </Text>
        </View>

        {/* Quick add buttons */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: theme.primary }]}
            onPress={() => openAdd('ingreso')}
          >
            <ArrowDownCircle size={20} color="#fff" strokeWidth={2} />
            <Text style={styles.quickBtnText}>Agregar ingreso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: theme.error }]}
            onPress={() => openAdd('gasto')}
          >
            <ArrowUpCircle size={20} color="#fff" strokeWidth={2} />
            <Text style={styles.quickBtnText}>Agregar gasto</Text>
          </TouchableOpacity>
        </View>

        {/* Bar chart - last 6 months */}
        <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Últimos 6 meses</Text>
          <BarChart data={stats.monthlyStats} currency={settings.currency} />
        </View>

        {/* Donut chart - category breakdown */}
        <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Gastos por categoría</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>
            {monthLabel(currentMonthKey())}
          </Text>
          <DonutChart data={donutData} currency={settings.currency} />
        </View>

        {/* Recent transactions */}
        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Movimientos recientes</Text>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => {
              const cat = getCategory(tx.category);
              return (
                <TouchableOpacity
                  key={tx.id}
                  style={[styles.txItem, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                  onPress={() => openEdit(tx)}
                >
                  <View style={[styles.txIcon, { backgroundColor: (cat?.color ?? '#64748b') + '20' }]}>
                    <CategoryIcon name={cat?.icon ?? 'Package'} size={18} color={cat?.color ?? '#64748b'} />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={[styles.txDesc, { color: theme.text }]} numberOfLines={1}>
                      {tx.description}
                    </Text>
                    <Text style={[styles.txDate, { color: theme.textMuted }]}>
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
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No hay movimientos aún. ¡Agrega tu primer ingreso o gasto!
            </Text>
          )}
        </View>
      </ScrollView>

      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        editTransaction={editTx}
        initialType={modalType}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  monthLabel: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textTransform: 'capitalize',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  balanceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceSubItem: {
    flex: 1,
  },
  balanceSubLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  balanceSubLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  balanceSubValue: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  savingsCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginTop: 10,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  quickBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  recentSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
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
  txDate: {
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
    paddingVertical: 20,
  },
});
