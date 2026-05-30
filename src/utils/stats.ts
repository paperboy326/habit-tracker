import {Completion} from '../types';
import {subDays, format, startOfWeek, addDays} from 'date-fns';

export function getCompletionRate(
  habitId: string,
  completions: Completion[],
  today: Date,
  days = 30,
): number {
  const dates = new Set(
    completions.filter(c => c.habitId === habitId).map(c => c.date),
  );
  let count = 0;
  for (let i = 0; i < days; i++) {
    const key = format(subDays(today, i), 'yyyy-MM-dd');
    if (dates.has(key)) count++;
  }
  return Math.round((count / days) * 100);
}

export interface DayData {
  label: string;
  count: number;
  date: string;
}

export function getWeeklyData(completions: Completion[], today: Date): DayData[] {
  const weekStart = startOfWeek(today, {weekStartsOn: 1});
  return Array.from({length: 7}, (_, i) => {
    const day = addDays(weekStart, i);
    const date = format(day, 'yyyy-MM-dd');
    const count = completions.filter(c => c.date === date).length;
    return {label: format(day, 'EEE'), count, date};
  });
}
