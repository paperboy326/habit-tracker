import {Completion} from '../types';
import {subDays, format, parseISO, isAfter, isBefore, isEqual} from 'date-fns';

export function getCurrentStreak(
  habitId: string,
  completions: Completion[],
  today: Date,
): number {
  const dates = new Set(
    completions.filter(c => c.habitId === habitId).map(c => c.date),
  );
  let streak = 0;
  let cursor = today;
  while (true) {
    const key = format(cursor, 'yyyy-MM-dd');
    if (dates.has(key)) {
      streak++;
      cursor = subDays(cursor, 1);
    } else {
      break;
    }
  }
  return streak;
}

export function getBestStreak(
  habitId: string,
  completions: Completion[],
): number {
  const dates = completions
    .filter(c => c.habitId === habitId)
    .map(c => parseISO(c.date))
    .sort((a, b) => (isBefore(a, b) ? -1 : isAfter(a, b) ? 1 : 0));

  if (dates.length === 0) return 0;

  let best = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = dates[i - 1];
    const curr = dates[i];
    const diff =
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diff) === 1) {
      current++;
      if (current > best) best = current;
    } else if (!isEqual(curr, prev)) {
      current = 1;
    }
  }
  return best;
}
