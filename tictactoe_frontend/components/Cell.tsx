import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CellProps {
  value: 'X' | 'O' | null;
  onPress: () => void;
  disabled?: boolean;
  index: number;
}

const ocean = {
  primary: '#2563EB',
  secondary: '#F59E0B',
  background: '#f9fafb',
  text: '#111827'
};

// PUBLIC_INTERFACE
export default function Cell({ value, onPress, disabled, index }: CellProps) {
  const display = value ?? '';
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Cell ${index + 1} ${value ? 'filled ' + value : 'empty'}`}
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.cell, value && styles.filled, disabled && styles.disabled]}
      disabled={!!value || disabled}
      accessibilityState={{ disabled: !!value || disabled }}
    >
      <Text style={[styles.cellText, display === 'X' ? styles.x : styles.o]}>
        {display}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    height: 80,
    width: 80,
    margin: 5,
    backgroundColor: ocean.background,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ocean.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    transitionDuration: '200ms'
  },
  filled: {
    backgroundColor: '#e5edfa'
  },
  disabled: {
    opacity: 0.5
  },
  cellText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: ocean.text,
    userSelect: 'none',
  },
  x: {
    color: ocean.primary
  },
  o: {
    color: ocean.secondary
  }
});
