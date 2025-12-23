import React, { useState, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Pressable, Text, Platform } from 'react-native';
import GameBoard from './components/GameBoard';
import StatusBarComp from './components/StatusBar';

const ocean = {
  primary: '#2563EB',
  secondary: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  gradientStart: '#e8f0fe',
  gradientEnd: '#f9fafb',
  text: '#111827'
};

type Player = 'X' | 'O';
type Board = Array<Player | null>;

// Array of win positions
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
export default function App() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | null>(null);
  const [draw, setDraw] = useState(false);

  // On cell press
  const handleCellPress = (idx: number) => {
    if (board[idx] || winner) return;
    const newBoard = [...board];
    newBoard[idx] = turn;
    setBoard(newBoard);

    // Check winner/draw
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
    } else if (newBoard.every(cell => cell)) {
      setDraw(true);
    } else {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  };

  // Compute win/draw and game status
  function checkWinner(b: Board): Player | null {
    for (const [a, bIdx, c] of winPatterns) {
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
        return b[a];
      }
    }
    return null;
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
    setDraw(false);
  }

  const statusText = useMemo(() => {
    if (winner) return `Player ${winner} wins!`;
    if (draw) return "It's a draw!";
    return `Player ${turn}'s turn`;
  }, [turn, winner, draw]);

  // For accessibility
  const accessibleLabel = winner
    ? `Game Over. Player ${winner} wins.`
    : draw
      ? "Game Over. It's a draw."
      : `Player ${turn}'s turn.`;

  return (
    <View style={styles.gradientBackground}>
      <StatusBar style="dark" />
      <View style={styles.container} accessible accessibilityLabel={accessibleLabel}>
        <StatusBarComp
          status={statusText}
          turn={turn}
          winner={winner}
          draw={draw}
        />
        <GameBoard
          board={board}
          onCellPress={handleCellPress}
          disabled={!!winner || draw}
        />
        <View style={styles.spacer} />
        <Pressable
          style={({ pressed }) => [
            styles.resetBtn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
          ]}
          onPress={resetGame}
          accessibilityRole="button"
          accessibilityLabel="Reset or start a new game"
        >
          <Text style={styles.resetText}>
            {winner || draw ? 'New Game' : 'Reset'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    backgroundColor: ocean.background,
    ...Platform.select({
      ios: {
        // Subtle vertical gradient iOS
        backgroundColor: 'transparent',
        // backgroundGradient does not exist in react-native default, but with Expo/React Native paper/plugins could style further
      }
    })
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
  },
  spacer: { height: 32 },
  resetBtn: {
    backgroundColor: ocean.primary,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ocean.primary,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginTop: 6,
    marginBottom: 18,
    minWidth: 154,
    transitionDuration: '300ms'
  },
  resetText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.3,
  },
});

