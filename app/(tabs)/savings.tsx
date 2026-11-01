import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import { Plus, Target, Trash2, X, Check, TrendingUp, Pencil } from 'lucide-react-native';
import { useTheme, formatCurrency } from '../ThemeContext';
import { useFinance } from '../FinanceContext';
import { SavingsGoal } from '../types';
import { ProgressBar, FadeInCard } from '../../components/Animated';

export default function SavingsScreen() {
  const theme = useTheme();
  const { goals, settings, addGoal, updateGoal, deleteGoal, contributeGoal } = useFinance();
  const [modalVisible, setModalVisible] = useState(false);
  const [contributeModal, setContributeModal] = useState<SavingsGoal | null>(null);
  const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [contributeAmount, setContributeAmount] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function openAdd() {
    setEditGoal(null);
    setTitle('');
    setTarget('');
    setCurrent('');
    setModalVisible(true);
  }

  function openEdit(goal: SavingsGoal) {
    setEditGoal(goal);
    setTitle(goal.title);
    setTarget(String(goal.target));
    setCurrent(String(goal.current));
    setModalVisible(true);
  }

  function handleSave() {
    const tgt = parseFloat(target);
    const cur = parseFloat(current) || 0;
    if (!title.trim() || !tgt || tgt <= 0) return;

    if (editGoal) {
      updateGoal(editGoal.id, { title: title.trim(), target: tgt, current: Math.min(cur, tgt) });
    } else {
      addGoal({ title: title.trim(), target: tgt, current: Math.min(cur, tgt) });
    }
    setModalVisible(false);
  }

  function handleContribute() {
    if (!contributeModal) return;
    const amt = parseFloat(contributeAmount);
    if (!amt) return;
    contributeGoal(contributeModal.id, amt);
    setContributeModal(null);
    setContributeAmount('');
  }

  const totalSaved = goals.reduce((s, g) => s + g.current, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Metas de ahorro</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={openAdd}
        >
          <Plus size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Summary card */}
      {goals.length > 0 && (
        <View style={[styles.summaryCard, { backgroundColor: theme.primary }]}>
          <View style={styles.summaryTop}>
            <TrendingUp size={20} color="#fff" strokeWidth={2} />
            <Text style={styles.summaryLabel}>Total ahorrado</Text>
          </View>
          <Text style={styles.summaryAmount}>
            {formatCurrency(totalSaved, settings.currency)}
          </Text>
          <Text style={styles.summarySub}>
            de {formatCurrency(totalTarget, settings.currency)} ({totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%)
          </Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress = Math.min(goal.current / goal.target, 1);
            const remaining = Math.max(goal.target - goal.current, 0);
            return (
              <FadeInCard
                key={goal.id}
                delay={goals.indexOf(goal) * 60}
                style={[styles.goalCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              >
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitleRow}>
                    <View style={[styles.goalIcon, { backgroundColor: theme.primaryLight }]}>
                      <Target size={18} color={theme.primary} strokeWidth={2} />
                    </View>
                    <Text style={[styles.goalTitle, { color: theme.text }]}>{goal.title}</Text>
                  </View>
                  <View style={styles.goalActions}>
                    <TouchableOpacity
                      onPress={() => openEdit(goal)}
                      style={[styles.deleteGoalBtn, { borderColor: theme.cardBorder }]}
                    >
                      <Pencil size={15} color={theme.textSecondary} strokeWidth={2} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setConfirmDelete(goal.id)}
                      style={[styles.deleteGoalBtn, { borderColor: theme.error + '40' }]}
                    >
                      <Trash2 size={15} color={theme.error} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.progressInfo}>
                  <Text style={[styles.progressCurrent, { color: theme.primary }]}>
                    {formatCurrency(goal.current, settings.currency)}
                  </Text>
                  <Text style={[styles.progressTarget, { color: theme.textMuted }]}>
                    / {formatCurrency(goal.target, settings.currency)}
                  </Text>
                </View>

                {/* Progress bar */}
                <ProgressBar
                  progress={progress}
                  color={progress >= 1 ? theme.primary : theme.accent}
                  trackColor={theme.bgTertiary}
                />

                <View style={styles.progressFooter}>
                  <Text style={[styles.progressPercent, { color: theme.textSecondary }]}>
                    {Math.round(progress * 100)}% completado
                  </Text>
                  <Text style={[styles.progressRemaining, { color: theme.textMuted }]}>
                    {progress >= 1
                      ? '¡Meta alcanzada!'
                      : `Faltan ${formatCurrency(remaining, settings.currency)}`}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.contributeBtn, { backgroundColor: theme.primaryLight }]}
                  onPress={() => {
                    setContributeModal(goal);
                    setContributeAmount('');
                  }}
                >
                  <Text style={[styles.contributeBtnText, { color: theme.primary }]}>
                    {progress >= 1 ? 'Meta alcanzada' : 'Agregar ahorro'}
                  </Text>
                </TouchableOpacity>
              </FadeInCard>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Target size={48} color={theme.textMuted} strokeWidth={1.5} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No tienes metas de ahorro todavía.
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textMuted }]}>
              Crea tu primera meta y empieza a ahorrar.
            </Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: theme.primary }]}
              onPress={openAdd}
            >
              <Plus size={18} color="#fff" strokeWidth={2.5} />
              <Text style={styles.emptyBtnText}>Crear meta</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit goal modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.sheet, { backgroundColor: theme.bgSecondary }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>
                {editGoal ? 'Editar meta' : 'Nueva meta de ahorro'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={22} color={theme.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Nombre de la meta</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Ej: Viaje a la playa"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Cantidad a ahorrar</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
              keyboardType="decimal-pad"
              value={target}
              onChangeText={setTarget}
            />

            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Cantidad inicial (opcional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
              keyboardType="decimal-pad"
              value={current}
              onChangeText={setCurrent}
            />

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={handleSave}
            >
              <Check size={18} color="#fff" />
              <Text style={styles.saveBtnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Contribute modal */}
      <Modal visible={!!contributeModal} transparent animationType="slide" onRequestClose={() => setContributeModal(null)}>
        <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.sheet, { backgroundColor: theme.bgSecondary }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>Agregar ahorro</Text>
              <TouchableOpacity onPress={() => setContributeModal(null)} style={styles.closeBtn}>
                <X size={22} color={theme.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.contributeHint, { color: theme.textSecondary }]}>
              {contributeModal?.title}
            </Text>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Cantidad a agregar</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
              keyboardType="decimal-pad"
              value={contributeAmount}
              onChangeText={setContributeAmount}
              autoFocus
            />
            <View style={styles.quickContributeRow}>
              {[100, 500, 1000].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.quickContributeBtn, { borderColor: theme.cardBorder }]}
                  onPress={() => setContributeAmount(String(v))}
                >
                  <Text style={[styles.quickContributeText, { color: theme.textSecondary }]}>
                    {formatCurrency(v, settings.currency)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={handleContribute}
            >
              <Check size={18} color="#fff" />
              <Text style={styles.saveBtnText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete confirmation */}
      {confirmDelete && (
        <View style={[styles.confirmOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.confirmSheet, { backgroundColor: theme.bgSecondary }]}>
            <Text style={[styles.confirmTitle, { color: theme.text }]}>¿Eliminar meta?</Text>
            <Text style={[styles.confirmText, { color: theme.textSecondary }]}>
              Esta acción no se puede deshacer.
            </Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity
                style={[styles.confirmBtn, { borderColor: theme.cardBorder }]}
                onPress={() => setConfirmDelete(null)}
              >
                <Text style={[styles.confirmCancelText, { color: theme.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: theme.error, borderColor: theme.error }]}
                onPress={() => {
                  deleteGoal(confirmDelete);
                  setConfirmDelete(null);
                }}
              >
                <Text style={styles.confirmDeleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  summaryCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  summaryAmount: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  summarySub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  goalCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  goalIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    flexShrink: 1,
  },
  deleteGoalBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 10,
  },
  progressCurrent: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  progressTarget: {
    fontSize: 14,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 14,
  },
  progressPercent: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  progressRemaining: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  contributeBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  contributeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  emptySubtext: {
    fontSize: 14,
    marginBottom: 12,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
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
  contributeHint: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  quickContributeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  quickContributeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickContributeText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
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
