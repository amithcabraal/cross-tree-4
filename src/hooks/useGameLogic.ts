import { useReducer, useCallback } from 'react';
import { GameState, GameAction, Position, CellState } from '../types/game';
import { generateTerritories } from '../utils/territoryGenerator';
import { findSolution } from '../utils/puzzleValidator';
import { createEmptyBoard, BOARD_SIZE, REQUIRED_TERRITORIES } from '../utils/boardUtils';
import { checkForErrors, checkWinCondition } from '../utils/errorUtils';

const initialState: GameState = {
  board: createEmptyBoard(),
  territories: [],
  errors: [],
  territoryErrors: [],
  isStarted: false,
  isTimeUp: false,
  isWon: false,
  isDarkMode: false,
  errorMessage: '',
  solution: undefined,
  showingSolution: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      try {
        const seed = action.payload?.seed ?? Math.floor(Math.random() * 1000000);
        const territories = generateTerritories(BOARD_SIZE, REQUIRED_TERRITORIES, seed);
        const solution = findSolution(territories, BOARD_SIZE);
        
        return {
          ...state,
          board: createEmptyBoard(),
          territories,
          errors: [],
          territoryErrors: [],
          isStarted: true,
          isTimeUp: false,
          isWon: false,
          errorMessage: '',
          seed,
          solution,
          showingSolution: false,
        };
      } catch (error) {
        console.error('Failed to start game:', error);
        return state;
      }
    }

    case 'RESET_GAME': {
      return {
        ...initialState,
        isDarkMode: state.isDarkMode,
      };
    }

    case 'CYCLE_CELL': {
      if (!state.isStarted || state.isTimeUp || state.isWon || state.showingSolution) return state;

      const { row, col } = action.payload;
      const newBoard = state.board.map(r => [...r]);
      
      switch (newBoard[row][col]) {
        case 'empty':
          newBoard[row][col] = 'marked';
          break;
        case 'marked':
          newBoard[row][col] = 'tree';
          break;
        case 'tree':
          newBoard[row][col] = 'empty';
          break;
      }

      const { errors, territoryErrors, errorMessage } = checkForErrors(newBoard, state.territories);
      const isWon = checkWinCondition(newBoard, state.territories);

      return {
        ...state,
        board: newBoard,
        errors,
        territoryErrors,
        errorMessage,
        isWon,
      };
    }

    case 'TIME_UP': {
      return {
        ...state,
        isTimeUp: true,
      };
    }

    case 'TOGGLE_DARK_MODE': {
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    }

    case 'TOGGLE_SOLUTION': {
      return {
        ...state,
        showingSolution: !state.showingSolution,
      };
    }

    default:
      return state;
  }
}

export function useGameLogic() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const handleCellClick = useCallback((row: number, col: number) => {
    dispatch({ type: 'CYCLE_CELL', payload: { row, col } });
  }, []);

  const startGame = useCallback((seed?: number) => {
    dispatch({ type: 'START_GAME', payload: { seed } });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const handleTimeUp = useCallback(() => {
    dispatch({ type: 'TIME_UP' });
  }, []);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }, []);

  const toggleSolution = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOLUTION' });
  }, []);

  return {
    state,
    handleCellClick,
    startGame,
    resetGame,
    handleTimeUp,
    toggleDarkMode,
    toggleSolution,
  };
}