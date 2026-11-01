import { Tabs } from 'expo-router';
import { LayoutDashboard, ArrowRightLeft, PiggyBank, History, Settings } from 'lucide-react-native';
import { useTheme } from '../ThemeContext';
import { useFinance } from '../FinanceContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function TabLayout() {
  const theme = useTheme();
  const { loading } = useFinance();

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.tabBg,
          borderTopColor: theme.cardBorder,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: 'Inter-Medium',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Panel',
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="movements"
        options={{
          title: 'Movimientos',
          tabBarIcon: ({ color }) => <ArrowRightLeft size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Ahorro',
          tabBarIcon: ({ color }) => <PiggyBank size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <History size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color }) => <Settings size={22} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
