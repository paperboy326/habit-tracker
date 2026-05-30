export interface Habit {
  id: string;
  name: string;
  color: string;
  emoji: string;
  createdAt: string;
}

export interface Completion {
  habitId: string;
  date: string; // YYYY-MM-DD
}
