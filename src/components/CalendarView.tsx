import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  format,
  isSameMonth,
  isToday,
} from 'date-fns';
import {theme} from '../theme';

interface Props {
  month: Date;
  completedDates: Set<string>;
  habitColor: string;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarView({month, completedDates, habitColor}: Props) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = startOfWeek(monthStart, {weekStartsOn: 1});

  const cells: Date[] = [];
  let cursor = gridStart;
  while (cursor <= monthEnd || cells.length % 7 !== 0) {
    cells.push(cursor);
    cursor = addDays(cursor, 1);
    if (cursor > monthEnd && cells.length % 7 === 0) break;
  }

  return (
    <View>
      <View style={styles.dayLabels}>
        {DAY_LABELS.map(d => (
          <Text key={d} style={styles.dayLabel}>{d}</Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((date, idx) => {
          const key = format(date, 'yyyy-MM-dd');
          const inMonth = isSameMonth(date, month);
          const completed = completedDates.has(key);
          const todayFlag = isToday(date);
          return (
            <View key={idx} style={styles.cell}>
              <View
                style={[
                  styles.dayCircle,
                  completed && {backgroundColor: habitColor},
                  todayFlag && !completed && styles.todayRing,
                ]}>
                <Text
                  style={[
                    styles.dayText,
                    !inMonth && styles.outOfMonth,
                    completed && styles.completedText,
                    todayFlag && !completed && {color: habitColor},
                  ]}>
                  {format(date, 'd')}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dayLabels: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    color: theme.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayRing: {
    borderWidth: 2,
    borderColor: theme.accent,
  },
  dayText: {
    color: theme.text,
    fontSize: 13,
    fontWeight: '500',
  },
  outOfMonth: {
    color: theme.border,
  },
  completedText: {
    color: '#fff',
    fontWeight: '700',
  },
});
