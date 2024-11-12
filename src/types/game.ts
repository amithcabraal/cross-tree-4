export interface Position {
  row: number;
  col: number;
}

export interface Territory {
  id: number;
  cells: Position[];
  seed?: number;
}

export type CellState = 'empty' | 'marked' | 'tree';

export interface GameState {
  board: CellState[][];
  territories: Territory[];
  errors: Position[];
  territoryErrors: number[];
  isStarted: boolean;
  isTimeUp: boolean;
  isWon: boolean;
  isDarkMode: boolean;
  errorMessage: string;
  seed?: number;
  solution?: Position[];
  showingSolution: boolean;
}

export type GameAction = 
  | { type: 'START_GAME'; payload?: { seed?: number } }
  | { type: 'RESET_GAME' }
  | { type: 'CYCLE_CELL'; payload: { row: number; col: number } }
  | { type: 'TIME_UP' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_SOLUTION' };