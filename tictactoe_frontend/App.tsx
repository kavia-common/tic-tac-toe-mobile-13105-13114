import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';

const COLORS = {
  primary: '#2563EB',
  secondary: '#F59E0B', // Used for both success and accent
  success: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
};

type Player = 'X' | 'O' | null;

const emptyBoard: Player[] = Array(9).fill(null);

function calculateWinner(squares: Player[]): Player | 'draw' | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.every(x => x)) return 'draw';
  return null;
}

// PUBLIC_INTERFACE
export default function App() {
  const [board, setBoard] = useState<Player[]>([...emptyBoard]);
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Handle cell press
  function handlePress(idx: number) {
    if (gameStatus !== 'playing' || board[idx]) return;
    const nextBoard = [...board];
    nextBoard[idx] = xIsNext ? 'X' : 'O';

    const result = calculateWinner(nextBoard);
    if (result === 'X' || result === 'O') {
      setBoard(nextBoard);
      setGameStatus('won');
      setWinner(result);
      fadeFlash();
    } else if (result === 'draw') {
      setBoard(nextBoard);
      setGameStatus('draw');
      fadeFlash();
    } else {
      setBoard(nextBoard);
      setXIsNext(!xIsNext);
    }
  }

  // Animated feedback for status bar when game ends
  function fadeFlash() {
    fadeAnim.setValue(1);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
    ]).start();
  }

  // Reset the game
  function handleReset() {
    setBoard([...emptyBoard]);
    setGameStatus('playing');
    setWinner(null);
    setXIsNext(true);
  }

  // Status Message
  let statusMsg: string;
  if (gameStatus === 'playing') {
    statusMsg = `Next player: ${xIsNext ? 'X' : 'O'}`;
  } else if (gameStatus === 'won') {
    statusMsg = `Winner: ${winner}`;
  } else {
    statusMsg = "It's a draw!";
  }

  // Status Bar color for winner
  let statusBarColor: string = COLORS.text;
  if (gameStatus === 'won' && winner === 'X') {
    statusBarColor = COLORS.primary;
  } else if (gameStatus === 'won' && winner === 'O') {
    statusBarColor = COLORS.secondary;
  } else if (gameStatus === 'draw') {
    statusBarColor = COLORS.error;
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.outerWrapper}>
        {/* Player Status */}
        <Animated.View
          style={[
            styles.statusBar,
            {
              backgroundColor: COLORS.surface,
              shadowOpacity: 0.12,
              shadowRadius: 8,
              opacity: fadeAnim,
              borderColor: statusBarColor,
            },
          ]}
        >
          <Text style={[
              styles.statusText,
              (gameStatus === 'won' ? {color: statusBarColor} : {})
            ]}>
            {statusMsg}
          </Text>
        </Animated.View>

        {/* Game Board */}
        <View style={styles.boardWrapper}>
          {Array(3)
            .fill(null)
            .map((_, rowIdx) => (
              <View style={styles.row} key={`row${rowIdx}`}>
                {Array(3)
                  .fill(null)
                  .map((_, colIdx) => {
                    const idx = rowIdx * 3 + colIdx;
                    let cellColor = COLORS.surface;
                  const cellShadowColor = COLORS.primary;
                  if (board[idx] === 'X') cellColor = '#EFF6FF'; // lighter blue
                  if (board[idx] === 'O') cellColor = '#FFF7ED'; // light amber
                  return (
                    <TouchableOpacity
                      style={[
                        styles.cell,
                        {
                          backgroundColor: cellColor,
                          shadowColor: cellShadowColor,
                          borderColor: (board[idx] === 'X')
                            ? COLORS.primary
                            : (board[idx] === 'O')
                            ? COLORS.secondary
                            : COLORS.text + '14',
                        } as import("react-native").ViewStyle,
                      ]}
                      key={idx}
                      onPress={() => handlePress(idx)}
                      activeOpacity={0.88}
                      disabled={!!board[idx] || gameStatus !== 'playing'}
                    >
                      <Animated.Text
                        style={[
                          styles.cellText,
                          board[idx] === 'X'
                            ? { color: COLORS.primary }
                            : board[idx] === 'O'
                            ? { color: COLORS.secondary }
                            : { color: COLORS.text + '15' },
                        ] as import("react-native").TextStyle[]}
                      >
                        {board[idx] || ''}
                      </Animated.Text>
                    </TouchableOpacity>
                  );
                  })}
              </View>
            ))}
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.85}>
          <Text style={styles.resetButtonText}>Reset Game</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="dark" backgroundColor={COLORS.background} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  outerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 32,
    backgroundColor: COLORS.background,
  },
  statusBar: {
    minHeight: 56,
    borderRadius: 16,
    marginBottom: 34,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    marginHorizontal: 8,
  },
  statusText: {
    fontSize: 21,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  boardWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: 32,
    padding: 18,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.11,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 78,
    height: 78,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.text + '14',
    borderRadius: 16,
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowOpacity: 0.09,
    shadowRadius: 7,
    shadowOffset: { width: 1, height: 2 },
    // @ts-expect-error for web style props:
    transitionProperty: 'background-color,border-color',
    // @ts-expect-error for web style props:
    transitionDuration: '210ms',
  } as import("react-native").ViewStyle,
  cellText: {
    fontSize: 44,
    fontWeight: '700',
    color: COLORS.primary,
    textShadowColor: '#0066CC22',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 9,
    // @ts-expect-error for web style props:
    transitionProperty: 'color',
    // @ts-expect-error for web style props:
    transitionDuration: '175ms',
  } as import("react-native").TextStyle,
  resetButton: {
    marginTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.19,
    shadowRadius: 11,
    elevation: 2,
  },
  resetButtonText: {
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});
