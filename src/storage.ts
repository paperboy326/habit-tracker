import AsyncStorage from '@react-native-async-storage/async-storage';
import {Habit, Completion} from './types';

const HABITS_KEY = '@habits';
const COMPLETIONS_KEY = '@completions';

export async function getHabits(): Promise<Habit[]> {
  const raw = await AsyncStorage.getItem(HABITS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export async function getCompletions(): Promise<Completion[]> {
  const raw = await AsyncStorage.getItem(COMPLETIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function toggleCompletion(
  habitId: string,
  date: string,
): Promise<Completion[]> {
  const completions = await getCompletions();
  const idx = completions.findIndex(
    c => c.habitId === habitId && c.date === date,
  );
  let updated: Completion[];
  if (idx >= 0) {
    updated = completions.filter((_, i) => i !== idx);
  } else {
    updated = [...completions, {habitId, date}];
  }
  await AsyncStorage.setItem(COMPLETIONS_KEY, JSON.stringify(updated));
  return updated;
}
