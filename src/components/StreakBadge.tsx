import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {theme} from '../theme';

interface Props {
  streak: number;
}

export default function StreakBadge({streak}: Props) {
  if (streak === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>🔥 {streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#2A2D3A',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  text: {
    color: theme.text,
    fontSize: 12,
    fontWeight: '600',
  },
});
