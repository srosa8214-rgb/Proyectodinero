import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ViewStyle,
} from 'react-native';
import { Plus, ArrowDownCircle, ArrowUpCircle, Pencil, Trash2 } from 'lucide-react-native';
import { useTheme, formatCurrency, formatDate } from '../ThemeContext';
import { useFinance } from '../FinanceContext';
import { getCategory, getCurrency } from '../constants';
import { CategoryIcon } from '../../components/CategoryIcon';
import { TransactionModal } from '../../components/TransactionModal';
import { Transaction, TransactionType } from '../types';

type FilterType = 'todos' | 'ingresos' | 'gastos';

export default function MovementsScreen() {
  const theme = useTheme();
  const { transactions, settings, deleteTransaction } = useFinance();
  const [modalVisible, setModalVisible] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<FilterType>('todos');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...transactions].sort((a, b) => b.createdAt - a.createdAt);
    if (filter === 'ingresos') list = list.filter((t) => t.type === 'ingreso');
    if (filter === 'gastos') list = list.filter((t) => t.type === 'gasto');
    return list;
  }, [transactions, filter]);

  function openAdd() {
    setEditTx(null);
    setModalVisible(true);
  }

  function openEdit(tx: Transaction) {
    setEditTx(tx);
    setModalVisible(true);
  }

  const filterBtnStyle = (active: boolean): ViewStyle => ({
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: active ? theme.primary : 'transparent',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Movimientos</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={openAdd}
        >
          <Plus size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={[styles.filterRow, { backgroundColor: theme.bgTertiary }]}>
        <TouchableOpacity
          style={filterBtnStyle(filter === 'todos')}
          onPress={() => setFilter('todos')}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              fontFamily: 'Inter-SemiBold',
              color: filter === 'todos' ? '#fff' : theme.textSecondary,
            }}
          >
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={filterBtnStyle(filter === 'ingresos')}
          onPress={() => setFilter('ingresos')}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              fontFamily: 'Inter-SemiBold',
              color: filter === 'ingresos' ? '#fff' : theme.textSecondary,
            }}
          >
            Ingresos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={filterBtnStyle(filter === 'gastos')}
          onPress={() => setFilter('gastos')}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              fontFamily: 'Inter-SemiBold',
              color: filter === 'gastos' ? '#fff' : theme.textSecondary,
            }}
          >
            Gastos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filtered.length > 0 ? (
          filtered.map((tx) => {
            const cat = getCategory(tx.category);
            return (
              <View
                key={tx.id}
                style={[styles.txItem, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              >
                <View style={[styles.txIcon, { backgroundColor: (cat?.color ?? '#64748b') + '20' }]}>
                  {tx.type === 'ingreso' ? (
                    <ArrowDownCircle size={20} color={theme.primary} strokeWidth={2} />
                  ) : (
                    <ArrowUpCircle size={20} color={theme.error} strokeWidth={2} />
                  )}
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
                <View style={styles.txActions}>
                  <TouchableOpacity
                    onPress={() => openEdit(tx)}
                    style={[styles.actionBtn, { borderColor: theme.cardBorder }]}
                  >
                    <Pencil size={15} color={theme.textSecondary} strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setConfirmDelete(tx.id)}
                    style={[styles.actionBtn, { borderColor: theme.error + '40' }]}
                  >
                    <Trash2 size={15} color={theme.error} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No hay movimientos registrados.
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: theme.primary }]}
              onPress={openAdd}
            >
              <Plus size={18} color="#fff" strokeWidth={2.5} />
              <Text style={styles.emptyBtnText}>Agregar movimiento</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Delete confirmation */}
      {confirmDelete && (
        <View style={[styles.confirmOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.confirmSheet, { backgroundColor: theme.bgSecondary }]}>
            <Text style={[styles.confirmTitle, { color: theme.text }]}>¿Eliminar movimiento?</Text>
            <Text style={[styles.confirmText, { color: theme.textSecondary }]}>
              Esta acción no se puede deshacer.
            </Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity
                style={[styles.confirmBtn, { borderColor: theme.cardBorder }]}
                onPress={() => setConfirmDelete(null)}
              >
                <Text style={[styles.confirmCancelText, { color: theme.textSecondary }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: theme.error, borderColor: theme.error }]}
                onPress={() => {
                  deleteTransaction(confirmDelete);
                  setConfirmDelete(null);
                }}
              >
                <Text style={styles.confirmDeleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        editTransaction={editTx}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  txActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  confirmSheet: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
  },
  confirmTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    marginBottom: 20,
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  confirmCancelText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  confirmDeleteText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
});
