import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DayData} from '../utils/stats';
import {theme} from '../theme';

interface Props {
  data: DayData[];
  maxCount: number;
}

export default function WeeklyBarChart({data, maxCount}: Props) {
  const max = maxCount || 1;
  return (
    <View style={styles.container}>
      {data.map(d => (
        <View key={d.date} style={styles.col}>
          <Text style={styles.count}>{d.count > 0 ? d.count : ''}</Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.bar,
                {height: `${Math.round((d.count / max) * 100)}%` || '0%'},
              ]}
            />
          </View>
          <Text style={styles.label}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 4,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  count: {
    color: theme.textMuted,
    fontSize: 10,
    marginBottom: 2,
  },
  barTrack: {
    width: 20,
    flex: 1,
    backgroundColor: theme.border,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 4,
  },
  bar: {
    width: '100%',
    backgroundColor: theme.accent,
    borderRadius: 4,
    minHeight: 4,
  },
  label: {
    color: theme.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
});
