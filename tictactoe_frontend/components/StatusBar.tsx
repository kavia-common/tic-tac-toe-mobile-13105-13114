import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface StatusBarProps {
  status: string;
  turn: 'X' | 'O' | null;
  winner: 'X' | 'O' | null;
  draw: boolean;
}

const ocean = {
  primary: '#2563EB',
  secondary: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  text: '#111827'
};

// PUBLIC_INTERFACE
const StatusBar: React.FC<StatusBarProps> = ({ status, turn, winner, draw }) => {
  let color = ocean.primary;
  if (winner) color = winner === 'X' ? ocean.primary : ocean.secondary;
  if (draw) color = ocean.error;
  return (
    <View style={styles.container}>
      <Text style={[styles.status, { color }]} accessibilityLiveRegion="polite">
        {status}
      </Text>
      {!draw && !winner && turn && (
        <Text style={styles.turn}>
          Player {turn}&apos;s turn
        </Text>
      )}
    </View>
  );
};

export default StatusBar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
    minHeight: 62,
  },
  status: {
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  turn: {
    color: ocean.text,
    fontSize: 16,
    marginTop: 2,
    letterSpacing: 0.2
  }
});
