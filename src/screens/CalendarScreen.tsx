import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {format, addMonths, subMonths, getDaysInMonth, startOfMonth} from 'date-fns';
import {Habit, Completion} from '../types';
import {getHabits, getCompletions} from '../storage';
import CalendarView from '../components/CalendarView';
import {theme} from '../theme';

export default function CalendarScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  async function load() {
    const [h, c] = await Promise.all([getHabits(), getCompletions()]);
    setHabits(h);
    setCompletions(c);
    if (h.length > 0 && !selectedId) setSelectedId(h[0].id);
  }

  const selectedHabit = habits.find(h => h.id === selectedId) ?? habits[0];

  const completedDates = new Set(
    completions
      .filter(c => (selectedHabit ? c.habitId === selectedHabit.id : true))
      .map(c => c.date),
  );

  const monthStr = format(currentMonth, 'yyyy-MM');
  const daysInMonth = getDaysInMonth(currentMonth);
  const completedThisMonth = Array.from(completedDates).filter(d =>
    d.startsWith(monthStr),
  ).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>

      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📅</Text>
          <Text style={styles.emptyText}>Add habits on the Today tab first</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chips}>
            {habits.map(h => (
              <TouchableOpacity
                key={h.id}
                onPress={() => setSelectedId(h.id)}
                style={[
                  styles.chip,
                  selectedId === h.id && {backgroundColor: h.color},
                ]}>
                <Text style={styles.chipEmoji}>{h.emoji}</Text>
                <Text
                  style={[
                    styles.chipText,
                    selectedId === h.id && styles.chipTextSelected,
                  ]}>
                  {h.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.monthNav}>
            <TouchableOpacity
              onPress={() => setCurrentMonth(m => subMonths(m, 1))}
              style={styles.navBtn}>
              <Text style={styles.navArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {format(currentMonth, 'MMMM yyyy')}
            </Text>
            <TouchableOpacity
              onPress={() => setCurrentMonth(m => addMonths(m, 1))}
              style={styles.navBtn}>
              <Text style={styles.navArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.calendarCard}>
            <CalendarView
              month={currentMonth}
              completedDates={completedDates}
              habitColor={selectedHabit?.color ?? theme.accent}
            />
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{completedThisMonth}</Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>{daysInMonth - completedThisMonth}</Text>
              <Text style={styles.summaryLabel}>Missed</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNum}>
                {Math.round((completedThisMonth / daysInMonth) * 100)}%
              </Text>
              <Text style={styles.summaryLabel}>Rate</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: theme.bg},
  header: {padding: 24, paddingBottom: 8},
  title: {color: theme.text, fontSize: 24, fontWeight: '700'},
  empty: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  emptyEmoji: {fontSize: 48, marginBottom: 12},
  emptyText: {color: theme.textMuted, fontSize: 16},
  scroll: {paddingBottom: 40},
  chipScroll: {marginTop: 8},
  chips: {paddingHorizontal: 16, gap: 8, flexDirection: 'row'},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  chipEmoji: {fontSize: 16},
  chipText: {color: theme.textMuted, fontSize: 14, fontWeight: '600'},
  chipTextSelected: {color: '#fff'},
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  navBtn: {padding: 8},
  navArrow: {color: theme.text, fontSize: 28, fontWeight: '300'},
  monthLabel: {color: theme.text, fontSize: 18, fontWeight: '700'},
  calendarCard: {
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {alignItems: 'center'},
  summaryNum: {color: theme.text, fontSize: 26, fontWeight: '700'},
  summaryLabel: {color: theme.textMuted, fontSize: 12, marginTop: 2},
  divider: {width: 1, height: 40, backgroundColor: theme.border},
});
