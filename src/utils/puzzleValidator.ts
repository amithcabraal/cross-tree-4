import { Territory, Position } from '../types/game';

function canPlaceTree(
  board: boolean[][],
  row: number,
  col: number,
  size: number
): boolean {
  // Check row
  for (let i = 0; i < size; i++) {
    if (i !== col && board[row][i]) return false;
  }

  // Check column
  for (let i = 0; i < size; i++) {
    if (i !== row && board[i][col]) return false;
  }

  // Check adjacent cells (including diagonals)
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
        if (board[newRow][newCol]) return false;
      }
    }
  }

  return true;
}

function solve(
  board: boolean[][],
  territories: Territory[],
  territoryIndex: number,
  size: number,
  solution: Position[] = []
): boolean {
  if (territoryIndex >= territories.length) {
    return true;
  }

  const territory = territories[territoryIndex];
  
  for (const cell of territory.cells) {
    if (canPlaceTree(board, cell.row, cell.col, size)) {
      board[cell.row][cell.col] = true;
      solution.push({ row: cell.row, col: cell.col });
      
      if (solve(board, territories, territoryIndex + 1, size, solution)) {
        return true;
      }
      
      board[cell.row][cell.col] = false;
      solution.pop();
    }
  }

  return false;
}

export function findSolution(territories: Territory[], size: number): Position[] {
  const board = Array(size).fill(null).map(() => Array(size).fill(false));
  const solution: Position[] = [];
  
  solve(board, territories, 0, size, solution);
  return solution;
}

export function isPuzzleSolvable(territories: Territory[], size: number): boolean {
  const board = Array(size).fill(null).map(() => Array(size).fill(false));
  return solve(board, territories, 0, size, []);
}