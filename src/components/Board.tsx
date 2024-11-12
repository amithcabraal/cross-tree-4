import React from 'react';
import { TreeIcon, XIcon, WarningIcon } from './Icons';
import { Position, Territory, CellState } from '../types/game';

interface BoardProps {
  board: CellState[][];
  territories: Territory[];
  errors: Position[];
  territoryErrors: number[];
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
  isDarkMode: boolean;
  errorMessage?: string;
  solution?: Position[];
  showingSolution: boolean;
}

const TERRITORY_COLORS = {
  light: [
    'bg-red-200',
    'bg-blue-200',
    'bg-emerald-200',
    'bg-amber-200',
    'bg-purple-200',
    'bg-rose-200',
  ],
  dark: [
    'bg-red-800/40',
    'bg-blue-800/40',
    'bg-emerald-800/40',
    'bg-amber-800/40',
    'bg-purple-800/40',
    'bg-rose-800/40',
  ],
};

const Board: React.FC<BoardProps> = ({ 
  board, 
  territories, 
  errors, 
  territoryErrors, 
  onCellClick, 
  disabled,
  isDarkMode,
  errorMessage,
  solution,
  showingSolution,
}) => {
  const getTerritoryId = (row: number, col: number): number => {
    return territories.findIndex(t => 
      t.cells.some(cell => cell.row === row && cell.col === col)
    );
  };

  const isError = (row: number, col: number) => {
    return errors.some(err => err.row === row && err.col === col);
  };

  const isTerritoryError = (row: number, col: number) => {
    const territoryId = getTerritoryId(row, col);
    return territoryErrors.includes(territoryId);
  };

  const isSolutionTree = (row: number, col: number) => {
    return solution?.some(pos => pos.row === row && pos.col === col);
  };

  const colorScheme = isDarkMode ? TERRITORY_COLORS.dark : TERRITORY_COLORS.light;

  const getStatusMessage = () => {
    if (errorMessage) return errorMessage;
    if (showingSolution) return "Here's the solution! Click again to return to your attempt.";
    return "Place exactly one tree in each territory. Trees can't share rows, columns, or be adjacent.";
  };

  return (
    <div className="space-y-4">
      <div className={`h-12 flex items-center justify-center ${
        isDarkMode ? 'text-gray-200' : 'text-gray-700'
      }`}>
        <div className={`text-center p-2 rounded w-full ${
          errorMessage 
            ? isDarkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-600'
            : isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          {getStatusMessage()}
        </div>
      </div>

      <div className="grid gap-0.5 max-w-md mx-auto" style={{ gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))` }}>
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const territoryId = getTerritoryId(rowIndex, colIndex);
            const hasError = isError(rowIndex, colIndex);
            const hasTerritoryError = isTerritoryError(rowIndex, colIndex);
            const isInSolution = isSolutionTree(rowIndex, colIndex);
            const showTree = showingSolution ? isInSolution : cell === 'tree';

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onCellClick(rowIndex, colIndex)}
                disabled={disabled && !showingSolution}
                className={`
                  aspect-square p-1 rounded transition-all duration-200
                  ${colorScheme[territoryId % colorScheme.length]}
                  ${hasError || hasTerritoryError ? 'ring-2 ring-red-500' : 'hover:brightness-95'}
                  ${disabled && !showingSolution ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                  ${(hasError || hasTerritoryError) && 'animate-pulse'}
                  ${isInSolution && showingSolution && 'ring-2 ring-green-500'}
                `}
              >
                <div className={`w-full h-full ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {showTree && (hasError || hasTerritoryError ? <WarningIcon /> : <TreeIcon />)}
                  {cell === 'marked' && !showingSolution && <XIcon />}
                </div>
              </button>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Board;