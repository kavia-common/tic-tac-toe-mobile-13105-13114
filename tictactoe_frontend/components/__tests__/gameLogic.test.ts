import { describe, it, expect } from '@jest/globals';

// Simple pure function for win checking
function checkWinner(b) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a, bIdx, c] of wins) {
    if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a];
  }
  return null;
}

describe('Tic Tac Toe winner check', () => {
  it('detects X win in a row', () => {
    expect(checkWinner(['X','X','X',null,null,null,null,null,null])).toBe('X');
  });
  it('detects O win in column', () => {
    expect(checkWinner(['O',null,null,'O',null,null,'O',null,null])).toBe('O');
  });
  it('detects diagonal win', () => {
    expect(checkWinner(['X',null,null,null,'X',null,null,null,'X'])).toBe('X');
  });
  it('returns null if no winner', () => {
    expect(checkWinner(['X','O','X','O','X','O','O','X','O'])).toBe(null);
  });
});
