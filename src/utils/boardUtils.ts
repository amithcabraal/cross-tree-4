import { CellState, Position, Territory } from '../types/game';

export const BOARD_SIZE = 6;
export const REQUIRED_TERRITORIES = 6;

export const createEmptyBoard = (): CellState[][] =>
  Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('empty' as CellState));

export const getTrees = (board: CellState[][]): Position[] => {
  const trees: Position[] = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 'tree') {
        trees.push({ row: rowIndex, col: colIndex });
      }
    });
  });
  return trees;
};

export const checkRowConflict = (board: CellState[][], tree: Position): boolean => {
  return board[tree.row].some((cell, col) => 
    col !== tree.col && cell === 'tree'
  );
};

export const checkColumnConflict = (board: CellState[][], tree: Position): boolean => {
  return board.some((row, rowIndex) => 
    rowIndex !== tree.row && row[tree.col] === 'tree'
  );
};

export const checkAdjacentConflict = (board: CellState[][], tree: Position): boolean => {
  const adjacentCells = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  return adjacentCells.some(([dx, dy]) => {
    const newRow = tree.row + dx;
    const newCol = tree.col + dy;
    return (
      newRow >= 0 && newRow < BOARD_SIZE &&
      newCol >= 0 && newCol < BOARD_SIZE &&
      board[newRow][newCol] === 'tree'
    );
  });
};

export const checkTerritoryRules = (board: CellState[][], territory: Territory): boolean => {
  const treesInTerritory = territory.cells.filter(
    cell => board[cell.row][cell.col] === 'tree'
  );
  return treesInTerritory.length <= 1;
};