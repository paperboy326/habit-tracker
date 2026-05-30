import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {theme} from '../theme';

const EMOJIS = ['💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '🎯', '✍️', '🎵', '🧹', '💊'];

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, emoji: string, color: string) => void;
}

export default function AddHabitModal({visible, onClose, onAdd}: Props) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💪');
  const [color, setColor] = useState(theme.palette[0]);

  function handleAdd() {
    if (!name.trim()) return;
    onAdd(name.trim(), emoji, color);
    setName('');
    setEmoji('💪');
    setColor(theme.palette[0]);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>New Habit</Text>

          <TextInput
            style={styles.input}
            placeholder="Habit name…"
            placeholderTextColor={theme.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />

          <Text style={styles.label}>Pick an emoji</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
            {EMOJIS.map(e => (
              <TouchableOpacity
                key={e}
                onPress={() => setEmoji(e)}
                style={[styles.emojiBtn, emoji === e && styles.emojiBtnSelected]}>
                <Text style={styles.emojiText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Pick a color</Text>
          <View style={styles.colorRow}>
            {theme.palette.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[styles.colorDot, {backgroundColor: c}, color === c && styles.colorDotSelected]}
              />
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addBtn, {backgroundColor: color}]}
              onPress={handleAdd}>
              <Text style={styles.addText}>Add Habit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    backgroundColor: theme.bg,
    color: theme.text,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  label: {
    color: theme.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emojiRow: {
    marginBottom: 20,
  },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: theme.bg,
  },
  emojiBtnSelected: {
    backgroundColor: theme.border,
  },
  emojiText: {
    fontSize: 22,
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: 28,
    gap: 12,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: theme.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: theme.bg,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cancelText: {
    color: theme.textMuted,
    fontWeight: '600',
    fontSize: 16,
  },
  addBtn: {
    flex: 2,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
