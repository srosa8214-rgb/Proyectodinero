import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../app/ThemeContext';
import { formatCurrency } from '../app/theme';
import { CurrencyCode } from '../app/types';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface MonthlyData {
  label: string;
  ingresos: number;
  gastos: number;
}

export function BarChart({ data, currency }: { data: MonthlyData[]; currency: CurrencyCode }) {
  const theme = useTheme();
  const maxValue = Math.max(...data.flatMap((d) => [d.ingresos, d.gastos]), 1);
  const barHeight = 150;
  const gridLines = [0.25, 0.5, 0.75, 1.0];

  return (
    <View style={styles.container}>
      <View style={[styles.chart, { height: barHeight + 30 }]}>
        {gridLines.map((g, i) => (
          <View
            key={`grid-${i}`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 28 + g * barHeight,
              height: 1,
              backgroundColor: theme.chartGrid,
            }}
          />
        ))}

        {data.map((d, i) => {
          const ingH = Math.max((d.ingresos / maxValue) * barHeight, d.ingresos > 0 ? 6 : 0);
          const gasH = Math.max((d.gastos / maxValue) * barHeight, d.gastos > 0 ? 6 : 0);
          return (
            <View key={i} style={styles.barGroup}>
              <View style={styles.bars}>
                <View
                  style={{
                    width: 12,
                    height: ingH,
                    backgroundColor: theme.primary,
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  }}
                />
                <View
                  style={{
                    width: 12,
                    height: gasH,
                    backgroundColor: theme.error,
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  }}
                />
              </View>
              <Text style={[styles.label, { color: theme.textMuted }]}>{d.label}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Ingresos</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.error }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>Gastos</Text>
        </View>
      </View>
    </View>
  );
}

function DonutSegment({
  color,
  dash,
  gap,
  offset,
  size,
  radius,
  strokeWidth,
  circumference,
  progress,
  index,
}: {
  color: string;
  dash: number;
  gap: number;
  offset: number;
  size: number;
  radius: number;
  strokeWidth: number;
  circumference: number;
  progress: Animated.SharedValue<number>;
  index: number;
}) {
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDasharray: `${dash * progress.value} ${circumference}`,
    };
  });

  return (
    <AnimatedCircle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={`${dash} ${gap}`}
      strokeDashoffset={offset}
      animatedProps={animatedProps}
      transform={`rotate(-90 ${size / 2} ${size / 2})`}
    />
  );
}

export function DonutChart({
  data,
  currency,
}: {
  data: { label: string; value: number; color: string }[];
  currency: CurrencyCode;
}) {
  const theme = useTheme();
  const total = data.reduce((s, d) => s + d.value, 0);
  const size = 170;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
  }, [data]);

  let offset = 0;
  const segments = data.map((d, i) => {
    const fraction = total > 0 ? d.value / total : 0;
    const dash = fraction * circumference;
    const seg = {
      color: d.color,
      dash,
      gap: circumference - dash,
      offset: -offset,
      key: i,
    };
    offset += dash;
    return seg;
  });

  return (
    <View style={styles.donutContainer}>
      <View style={[styles.donut, { width: size, height: size }]}>
        <Svg width={size} height={size} style={styles.svg}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={theme.chartGrid}
            strokeWidth={strokeWidth}
          />
          {total > 0 &&
            segments.map((s) => (
              <DonutSegment
                key={s.key}
                color={s.color}
                dash={s.dash}
                gap={s.gap}
                offset={s.offset}
                size={size}
                radius={radius}
                strokeWidth={strokeWidth}
                circumference={circumference}
                progress={progress}
                index={s.key}
              />
            ))}
        </Svg>
        <View style={styles.donutCenter}>
          <Text style={[styles.donutTotal, { color: theme.text }]}>{formatCurrency(total, currency)}</Text>
          <Text style={[styles.donutLabel, { color: theme.textMuted }]}>Total gastos</Text>
        </View>
      </View>
      <View style={styles.donutLegend}>
        {data.length > 0 ? (
          data.map((d, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: d.color }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]} numberOfLines={1}>
                {d.label} — {formatCurrency(d.value, currency)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>Sin gastos este mes</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  bars: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'flex-end',
    height: '100%',
  },
  label: {
    fontSize: 11,
    marginTop: 6,
    textTransform: 'capitalize',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    flexShrink: 1,
  },
  donutContainer: {
    alignItems: 'center',
    gap: 16,
  },
  donut: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  donutCenter: {
    alignItems: 'center',
  },
  donutTotal: {
    fontSize: 18,
    fontWeight: '700',
  },
  donutLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  donutLegend: {
    width: '100%',
    gap: 6,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
