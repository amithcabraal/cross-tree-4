import { CellState, Position, Territory } from '../types/game';
import { 
  getTrees, 
  checkRowConflict, 
  checkColumnConflict, 
  checkAdjacentConflict,
  checkTerritoryRules 
} from './boardUtils';

export interface ErrorCheck {
  errors: Position[];
  territoryErrors: number[];
  errorMessage: string;
}

export const checkForErrors = (board: CellState[][], territories: Territory[]): ErrorCheck => {
  const errors: Position[] = [];
  const territoryErrors: number[] = [];
  let errorMessage = '';

  const trees = getTrees(board);

  // Check tree placement rules
  trees.forEach((tree) => {
    if (checkRowConflict(board, tree)) {
      errors.push(tree);
      errorMessage = 'Trees cannot share the same row';
    }
    if (checkColumnConflict(board, tree)) {
      errors.push(tree);
      errorMessage = 'Trees cannot share the same column';
    }
    if (checkAdjacentConflict(board, tree)) {
      errors.push(tree);
      errorMessage = 'Trees cannot be placed in adjacent squares';
    }
  });

  // Check territory rules
  territories.forEach((territory, index) => {
    if (!checkTerritoryRules(board, territory)) {
      territoryErrors.push(index);
      errorMessage = 'Each territory must contain exactly one tree';
    }
  });

  return { errors, territoryErrors, errorMessage };
};

export const checkWinCondition = (board: CellState[][], territories: Territory[]): boolean => {
  // Check if each territory has exactly one tree
  const territoryCheck = territories.every(territory => {
    const treesInTerritory = territory.cells.filter(
      cell => board[cell.row][cell.col] === 'tree'
    );
    return treesInTerritory.length === 1;
  });

  if (!territoryCheck) return false;

  // Check if there are any errors
  const { errors, territoryErrors } = checkForErrors(board, territories);
  return errors.length === 0 && territoryErrors.length === 0;
};