import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {format, subDays} from 'date-fns';
import {Habit, Completion} from '../types';
import {getHabits, getCompletions} from '../storage';
import {getCurrentStreak, getBestStreak} from '../utils/streaks';
import {getCompletionRate, getWeeklyData} from '../utils/stats';
import WeeklyBarChart from '../components/WeeklyBarChart';
import {theme} from '../theme';

export default function StatsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  async function load() {
    const [h, c] = await Promise.all([getHabits(), getCompletions()]);
    setHabits(h);
    setCompletions(c);
  }

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const todayDone = completions.filter(c => c.date === todayStr).length;
  const todayRate =
    habits.length > 0 ? Math.round((todayDone / habits.length) * 100) : 0;

  const weekAgo = format(subDays(today, 6), 'yyyy-MM-dd');
  const weekCompletions = completions.filter(c => c.date >= weekAgo);
  const maxPossibleWeek = habits.length * 7;
  const weekRate =
    maxPossibleWeek > 0
      ? Math.round((weekCompletions.length / maxPossibleWeek) * 100)
      : 0;

  const weeklyData = getWeeklyData(completions, today);
  const maxCount = Math.max(...weeklyData.map(d => d.count), 1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Stats</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>{habits.length}</Text>
            <Text style={styles.summaryLabel}>Habits</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>{todayRate}%</Text>
            <Text style={styles.summaryLabel}>Today</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>{weekRate}%</Text>
            <Text style={styles.summaryLabel}>This Week</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.card}>
            <WeeklyBarChart data={weeklyData} maxCount={maxCount} />
          </View>
        </View>

        {habits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Per Habit</Text>
            {habits.map(habit => {
              const streak = getCurrentStreak(habit.id, completions, today);
              const best = getBestStreak(habit.id, completions);
              const rate = getCompletionRate(habit.id, completions, today);
              return (
                <View key={habit.id} style={styles.habitStatCard}>
                  <View style={[styles.habitColorBar, {backgroundColor: habit.color}]} />
                  <View style={styles.habitStatContent}>
                    <View style={styles.habitStatHeader}>
                      <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                      <Text style={styles.habitName}>{habit.name}</Text>
                    </View>
                    <View style={styles.statRow}>
                      <View style={styles.statChip}>
                        <Text style={styles.statChipLabel}>🔥 Streak</Text>
                        <Text style={styles.statChipValue}>{streak}d</Text>
                      </View>
                      <View style={styles.statChip}>
                        <Text style={styles.statChipLabel}>⭐ Best</Text>
                        <Text style={styles.statChipValue}>{best}d</Text>
                      </View>
                      <View style={styles.statChip}>
                        <Text style={styles.statChipLabel}>📊 30d</Text>
                        <Text style={styles.statChipValue}>{rate}%</Text>
                      </View>
                    </View>
                    <View style={styles.rateBar}>
                      <View
                        style={[
                          styles.rateBarFill,
                          {width: `${rate}%`, backgroundColor: habit.color},
                        ]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {habits.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>Add habits on the Today tab to see stats</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: theme.bg},
  scroll: {paddingBottom: 40},
  header: {padding: 24, paddingBottom: 8},
  title: {color: theme.text, fontSize: 24, fontWeight: '700'},
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  summaryNum: {color: theme.text, fontSize: 22, fontWeight: '700'},
  summaryLabel: {color: theme.textMuted, fontSize: 12, marginTop: 2},
  section: {marginTop: 20, paddingHorizontal: 16},
  sectionTitle: {
    color: theme.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
  },
  habitStatCard: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  habitColorBar: {
    width: 4,
  },
  habitStatContent: {
    flex: 1,
    padding: 14,
  },
  habitStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  habitEmoji: {fontSize: 18, marginRight: 8},
  habitName: {color: theme.text, fontSize: 15, fontWeight: '600'},
  statRow: {flexDirection: 'row', gap: 8, marginBottom: 10},
  statChip: {
    flex: 1,
    backgroundColor: theme.bg,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  statChipLabel: {color: theme.textMuted, fontSize: 10, marginBottom: 2},
  statChipValue: {color: theme.text, fontSize: 14, fontWeight: '700'},
  rateBar: {
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  rateBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {fontSize: 48, marginBottom: 12},
  emptyText: {color: theme.textMuted, fontSize: 16, textAlign: 'center', paddingHorizontal: 32},
});
