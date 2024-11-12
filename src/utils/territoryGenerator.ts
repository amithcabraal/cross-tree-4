import { Territory, Position } from '../types/game';
import { isPuzzleSolvable } from './puzzleValidator';
import { BOARD_SIZE } from './boardUtils';

class Random {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
}

function getRandomInt(random: Random, min: number, max: number): number {
  return Math.floor(random.next() * (max - min + 1)) + min;
}

function getAdjacentCells(pos: Position): Position[] {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  return directions
    .map(([dx, dy]) => ({
      row: pos.row + dx,
      col: pos.col + dy
    }))
    .filter(({row, col}) => 
      row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
    );
}

function isCellAvailable(cell: Position, used: Set<string>): boolean {
  return !used.has(`${cell.row},${cell.col}`);
}

function generateSimpleTerritories(random: Random): Territory[] {
  const territories: Territory[] = [];
  const used = new Set<string>();
  const remainingCells: Position[] = [];

  // Initialize remaining cells with all board positions
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      remainingCells.push({ row, col });
    }
  }

  // Shuffle remaining cells
  for (let i = remainingCells.length - 1; i > 0; i--) {
    const j = Math.floor(random.next() * (i + 1));
    [remainingCells[i], remainingCells[j]] = [remainingCells[j], remainingCells[i]];
  }

  // Create territories
  for (let i = 0; i < BOARD_SIZE; i++) {
    const territory: Territory = {
      id: i,
      cells: [],
      seed: random.next()
    };

    // Start with first available cell
    const startCell = remainingCells.find(cell => isCellAvailable(cell, used))!;
    territory.cells.push(startCell);
    used.add(`${startCell.row},${startCell.col}`);

    // Grow territory
    let currentSize = 1;
    const minSize = 3; // Minimum territory size
    const maxSize = 6; // Maximum territory size
    
    while (currentSize < maxSize && remainingCells.length > 0) {
      // Get all available adjacent cells for the current territory
      const allAdjacent = territory.cells.flatMap(cell => 
        getAdjacentCells(cell)
          .filter(adj => isCellAvailable(adj, used))
      );

      if (allAdjacent.length === 0) break;

      // Add a random adjacent cell
      const nextCell = allAdjacent[getRandomInt(random, 0, allAdjacent.length - 1)];
      territory.cells.push(nextCell);
      used.add(`${nextCell.row},${nextCell.col}`);
      currentSize++;

      // Remove the cell from remaining cells
      const index = remainingCells.findIndex(
        cell => cell.row === nextCell.row && cell.col === nextCell.col
      );
      if (index !== -1) {
        remainingCells.splice(index, 1);
      }
    }

    territories.push(territory);
  }

  // Distribute remaining cells to adjacent territories
  while (remainingCells.length > 0) {
    const cell = remainingCells[0];
    const adjacentTerritories = territories.filter(territory =>
      territory.cells.some(tcell =>
        getAdjacentCells(cell).some(adj =>
          adj.row === tcell.row && adj.col === tcell.col
        )
      )
    );

    if (adjacentTerritories.length > 0) {
      // Add to smallest adjacent territory
      const smallestTerritory = adjacentTerritories.reduce((a, b) =>
        a.cells.length <= b.cells.length ? a : b
      );
      smallestTerritory.cells.push(cell);
      used.add(`${cell.row},${cell.col}`);
      remainingCells.shift();
    } else {
      // If no adjacent territories, add to smallest territory
      const smallestTerritory = territories.reduce((a, b) =>
        a.cells.length <= b.cells.length ? a : b
      );
      smallestTerritory.cells.push(cell);
      used.add(`${cell.row},${cell.col}`);
      remainingCells.shift();
    }
  }

  return territories;
}

export function generateTerritories(size: number, count: number, seed: number): Territory[] {
  const random = new Random(seed);
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const territories = generateSimpleTerritories(random);
      if (isPuzzleSolvable(territories, size)) {
        return territories;
      }
    } catch (error) {
      console.error('Failed attempt:', error);
    }
  }

  throw new Error('Failed to generate a solvable puzzle');
}