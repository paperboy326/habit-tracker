import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {format} from 'date-fns';
import {Habit, Completion} from '../types';
import {getHabits, saveHabits, getCompletions, toggleCompletion} from '../storage';
import {getCurrentStreak} from '../utils/streaks';
import HabitCard from '../components/HabitCard';
import AddHabitModal from '../components/AddHabitModal';
import {theme} from '../theme';

export default function TodayScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

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

  async function handleToggle(habitId: string) {
    const updated = await toggleCompletion(habitId, today);
    setCompletions(updated);
  }

  async function handleAdd(name: string, emoji: string, color: string) {
    const habit: Habit = {
      id: Date.now().toString(),
      name,
      emoji,
      color,
      createdAt: new Date().toISOString(),
    };
    const updated = [...habits, habit];
    await saveHabits(updated);
    setHabits(updated);
    setModalVisible(false);
  }

  async function handleDelete(id: string) {
    Alert.alert('Delete Habit', 'Remove this habit permanently?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = habits.filter(h => h.id !== id);
          await saveHabits(updated);
          setHabits(updated);
        },
      },
    ]);
  }

  const todayDate = new Date();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.dateLabel}>Today</Text>
        <Text style={styles.dateSub}>{format(todayDate, 'EEEE, MMMM d')}</Text>
        <Text style={styles.progress}>
          {completions.filter(c => c.date === today).length}/{habits.length} done
        </Text>
      </View>

      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptySubtitle}>Tap + to add your first habit</Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={h => h.id}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <HabitCard
              habit={item}
              done={completions.some(c => c.habitId === item.id && c.date === today)}
              streak={getCurrentStreak(item.id, completions, todayDate)}
              onToggle={() => handleToggle(item.id)}
              onLongPress={() => handleDelete(item.id)}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    padding: 24,
    paddingBottom: 12,
  },
  dateLabel: {
    color: theme.accent,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateSub: {
    color: theme.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  progress: {
    color: theme.textMuted,
    fontSize: 14,
  },
  list: {
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: theme.textMuted,
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.accent,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
  },
});
