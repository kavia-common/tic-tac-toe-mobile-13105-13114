import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';

interface GameBoardProps {
  board: Array<'X' | 'O' | null>;
  onCellPress: (idx: number) => void;
  disabled: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onCellPress, disabled }) => {
  // Render a 3x3 grid
  return (
    <View style={styles.board}>
      {[0, 1, 2].map(row =>
        <View style={styles.row} key={row}>
          {[0, 1, 2].map(col => {
            const idx = row * 3 + col;
            return (
              <Cell
                key={idx}
                value={board[idx]}
                onPress={() => onCellPress(idx)}
                disabled={disabled}
                index={idx}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export default GameBoard;

const styles = StyleSheet.create({
  board: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
  }
});
