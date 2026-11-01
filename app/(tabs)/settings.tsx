import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import {
  Moon,
  Sun,
  DollarSign,
  Trash2,
  Database,
  Check,
  X,
  ChevronRight,
  Info,
  Download,
} from 'lucide-react-native';
import { useTheme, formatCurrency } from '../ThemeContext';
import { useFinance } from '../FinanceContext';
import { CURRENCIES } from '../constants';
import { CurrencyCode } from '../types';

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, updateSettings, transactions, goals, clearAllData, loadSampleData } = useFinance();
  const [currencyModal, setCurrencyModal] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmSamples, setConfirmSamples] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Configuración</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Appearance */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Apariencia</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => updateSettings({ darkMode: !settings.darkMode })}
          >
            <View style={[styles.settingIcon, { backgroundColor: settings.darkMode ? '#1e293b' : '#fef3c7' }]}>
              {settings.darkMode ? (
                <Moon size={18} color="#fbbf24" strokeWidth={2} />
              ) : (
                <Sun size={18} color="#f59e0b" strokeWidth={2} />
              )}
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Modo oscuro</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                {settings.darkMode ? 'Activado' : 'Desactivado'}
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                { backgroundColor: settings.darkMode ? theme.primary : theme.bgTertiary },
              ]}
            >
              <View
                style={[
                  styles.toggleKnob,
                  {
                    backgroundColor: '#fff',
                    transform: [{ translateX: settings.darkMode ? 22 : 2 }],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Currency */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Moneda</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setCurrencyModal(true)}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#dcfce7' }]}>
              <DollarSign size={18} color={theme.primary} strokeWidth={2} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Moneda</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                {CURRENCIES.find((c) => c.code === settings.currency)?.label ?? 'MXN'}
              </Text>
            </View>
            <ChevronRight size={20} color={theme.textMuted} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Data */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Datos</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={[styles.settingRow, styles.settingRowStatic]}>
            <View style={[styles.settingIcon, { backgroundColor: '#dbeafe' }]}>
              <Database size={18} color="#3b82f6" strokeWidth={2} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Almacenamiento</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                {transactions.length} movimientos · {goals.length} metas
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setConfirmSamples(true)}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#e0e7ff' }]}>
              <Download size={18} color="#6366f1" strokeWidth={2} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Cargar datos de ejemplo</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                Restaurar movimientos y metas de prueba
              </Text>
            </View>
            <ChevronRight size={20} color={theme.textMuted} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setConfirmClear(true)}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#fee2e2' }]}>
              <Trash2 size={18} color={theme.error} strokeWidth={2} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.error }]}>Borrar todos los datos</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                Elimina movimientos, metas y configuración
              </Text>
            </View>
            <ChevronRight size={20} color={theme.textMuted} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* About */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Acerca de</Text>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={[styles.settingRow, styles.settingRowStatic]}>
            <View style={[styles.settingIcon, { backgroundColor: theme.primaryLight }]}>
              <Info size={18} color={theme.primary} strokeWidth={2} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Mi Dinero</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                Versión 1.0.0 · Administrador de finanzas personal
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.footer, { color: theme.textMuted }]}>
          Tus datos se guardan en tu dispositivo y no se envían a ningún servidor.
        </Text>
      </ScrollView>

      {/* Currency modal */}
      <Modal visible={currencyModal} transparent animationType="slide" onRequestClose={() => setCurrencyModal(false)}>
        <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.sheet, { backgroundColor: theme.bgSecondary }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>Seleccionar moneda</Text>
              <TouchableOpacity onPress={() => setCurrencyModal(false)} style={styles.closeBtn}>
                <X size={22} color={theme.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            {CURRENCIES.map((cur) => (
              <TouchableOpacity
                key={cur.code}
                style={[styles.optionItem, { borderColor: theme.cardBorder }]}
                onPress={() => {
                  updateSettings({ currency: cur.code as CurrencyCode });
                  setCurrencyModal(false);
                }}
              >
                <View style={styles.optionLeft}>
                  <Text style={[styles.optionSymbol, { color: theme.primary }]}>{cur.symbol}</Text>
                  <Text style={[styles.optionText, { color: theme.text }]}>{cur.label}</Text>
                </View>
                {settings.currency === cur.code && <Check size={20} color={theme.primary} strokeWidth={2.5} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Clear confirmation */}
      {confirmClear && (
        <View style={[styles.confirmOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.confirmSheet, { backgroundColor: theme.bgSecondary }]}>
            <View style={[styles.confirmIcon, { backgroundColor: '#fee2e2' }]}>
              <Trash2 size={28} color={theme.error} strokeWidth={2} />
            </View>
            <Text style={[styles.confirmTitle, { color: theme.text }]}>¿Borrar todo?</Text>
            <Text style={[styles.confirmText, { color: theme.textSecondary }]}>
              Se eliminarán todos tus movimientos, metas de ahorro y configuración. Esta acción no se puede deshacer.
            </Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity
                style={[styles.confirmBtn, { borderColor: theme.cardBorder }]}
                onPress={() => setConfirmClear(false)}
              >
                <Text style={[styles.confirmCancelText, { color: theme.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: theme.error, borderColor: theme.error }]}
                onPress={async () => {
                  await clearAllData();
                  setConfirmClear(false);
                }}
              >
                <Text style={styles.confirmDeleteText}>Borrar todo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Sample data confirmation */}
      {confirmSamples && (
        <View style={[styles.confirmOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.confirmSheet, { backgroundColor: theme.bgSecondary }]}>
            <View style={[styles.confirmIcon, { backgroundColor: '#e0e7ff' }]}>
              <Download size={28} color="#6366f1" strokeWidth={2} />
            </View>
            <Text style={[styles.confirmTitle, { color: theme.text }]}>Cargar datos de ejemplo</Text>
            <Text style={[styles.confirmText, { color: theme.textSecondary }]}>
              Esto reemplazará tus datos actuales con movimientos y metas de prueba. ¿Deseas continuar?
            </Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity
                style={[styles.confirmBtn, { borderColor: theme.cardBorder }]}
                onPress={() => setConfirmSamples(false)}
              >
                <Text style={[styles.confirmCancelText, { color: theme.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: theme.primary, borderColor: theme.primary }]}
                onPress={async () => {
                  await loadSampleData();
                  setConfirmSamples(false);
                }}
              >
                <Text style={styles.confirmDeleteText}>Cargar ejemplos</Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 20,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  settingRowStatic: {
    opacity: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  settingDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  footer: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
    lineHeight: 19,
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  optionSymbol: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    width: 28,
    textAlign: 'center',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
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
    padding: 28,
    width: '100%',
    alignItems: 'center',
  },
  confirmIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 19,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
