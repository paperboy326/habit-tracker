import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Habit} from '../types';
import StreakBadge from './StreakBadge';
import {theme} from '../theme';

interface Props {
  habit: Habit;
  done: boolean;
  streak: number;
  onToggle: () => void;
  onLongPress: () => void;
}

export default function HabitCard({
  habit,
  done,
  streak,
  onToggle,
  onLongPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, done && styles.cardDone]}
      onPress={onToggle}
      onLongPress={onLongPress}
      activeOpacity={0.7}>
      <View style={[styles.colorBar, {backgroundColor: habit.color}]} />
      <Text style={styles.emoji}>{habit.emoji}</Text>
      <Text style={[styles.name, done && styles.nameDone]} numberOfLines={1}>
        {habit.name}
      </Text>
      <View style={styles.right}>
        <StreakBadge streak={streak} />
        <View style={[styles.checkbox, done && {backgroundColor: habit.color, borderColor: habit.color}]}>
          {done && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    overflow: 'hidden',
  },
  cardDone: {
    opacity: 0.6,
  },
  colorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  emoji: {
    fontSize: 22,
    marginLeft: 8,
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  nameDone: {
    textDecorationLine: 'line-through',
    color: theme.textMuted,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
