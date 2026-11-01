import { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {
  X,
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../app/ThemeContext';
import { useFinance } from '../app/FinanceContext';
import { CATEGORIES } from '../app/constants';
import { Transaction, TransactionType } from '../app/types';
import { todayISO } from '../app/theme';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  visible: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
  initialType?: TransactionType;
}

export function TransactionModal({ visible, onClose, editTransaction, initialType }: Props) {
  const theme = useTheme();
  const { addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [type, setType] = useState<TransactionType>('gasto');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('comida');
  const [date, setDate] = useState(todayISO());

  useEffect(() => {
    if (visible) {
      if (editTransaction) {
        setType(editTransaction.type);
        setAmount(String(editTransaction.amount));
        setDescription(editTransaction.description);
        setCategory(editTransaction.category);
        setDate(editTransaction.date);
      } else {
        setType(initialType ?? 'gasto');
        setAmount('');
        setDescription('');
        setCategory(initialType === 'ingreso' ? 'salario' : 'comida');
        setDate(todayISO());
      }
    }
  }, [visible, editTransaction]);

  function handleSave() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !description.trim()) return;

    const data = {
      type,
      amount: amt,
      description: description.trim(),
      category,
      date,
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  }

  function handleDelete() {
    if (editTransaction) {
      deleteTransaction(editTransaction.id);
      onClose();
    }
  }

  const validCategories = CATEGORIES.filter((c) =>
    type === 'ingreso' ? c.id === 'salario' || c.id === 'otros' : true
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.sheet, { backgroundColor: theme.bgSecondary }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              {editTransaction ? 'Editar movimiento' : 'Nuevo movimiento'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={22} color={theme.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '80%' }}>
            {/* Type toggle */}
            <View style={[styles.typeToggle, { backgroundColor: theme.bgTertiary }]}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === 'gasto' && { backgroundColor: theme.error },
                ]}
                onPress={() => setType('gasto')}
              >
                <ArrowUpCircle size={18} color={type === 'gasto' ? '#fff' : theme.textSecondary} />
                <Text
                  style={[
                    styles.typeBtnText,
                    { color: type === 'gasto' ? '#fff' : theme.textSecondary },
                  ]}
                >
                  Gasto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === 'ingreso' && { backgroundColor: theme.primary },
                ]}
                onPress={() => {
                  setType('ingreso');
                  setCategory('salario');
                }}
              >
                <ArrowDownCircle
                  size={18}
                  color={type === 'ingreso' ? '#fff' : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.typeBtnText,
                    { color: type === 'ingreso' ? '#fff' : theme.textSecondary },
                  ]}
                >
                  Ingreso
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount */}
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Cantidad</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text },
              ]}
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            {/* Description */}
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Descripción</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text },
              ]}
              placeholder="Ej: Comida en el súper"
              placeholderTextColor={theme.textMuted}
              value={description}
              onChangeText={setDescription}
            />

            {/* Category */}
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Categoría</Text>
            <View style={styles.categoryGrid}>
              {validCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: category === cat.id ? cat.color : theme.bgTertiary,
                      borderColor: category === cat.id ? cat.color : theme.cardBorder,
                    },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <CategoryIcon name={cat.icon} size={18} color={category === cat.id ? '#fff' : theme.text} />
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: category === cat.id ? '#fff' : theme.textSecondary },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date */}
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Fecha</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text },
              ]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textMuted}
              value={date}
              onChangeText={setDate}
              keyboardType="numbers-and-punctuation"
            />
            {Platform.OS === 'web' && (
              <Text style={[styles.dateHint, { color: theme.textMuted }]}>
                Formato: Año-Mes-Día (ej: 2026-01-15)
              </Text>
            )}
          </ScrollView>

          <View style={styles.actionRow}>
            {editTransaction && (
              <TouchableOpacity
                style={[styles.deleteBtn, { borderColor: theme.error }]}
                onPress={handleDelete}
              >
                <Trash2 size={18} color={theme.error} />
                <Text style={[styles.deleteBtnText, { color: theme.error }]}>Eliminar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }, !editTransaction && styles.saveBtnFull]}
              onPress={handleSave}
            >
              <Check size={18} color="#fff" />
              <Text style={styles.saveBtnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  typeToggle: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  typeBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  dateHint: {
    fontSize: 12,
    marginBottom: 16,
    marginTop: -10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 20,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    paddingHorizontal: 24,
  },
  saveBtnFull: {
    flex: 1,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
