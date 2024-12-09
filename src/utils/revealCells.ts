import { COLS, ROWS } from "../constants";
import { TypeCell } from "../types/cell";

export const revealCells = (
  grid: TypeCell[][],
  row: number,
  col: number
): TypeCell[][] => {
  const newGrid = [...grid];

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  if (newGrid[row][col].cell === "mine") {
    return newGrid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isRevealed: cell.cell === "mine" || cell.isRevealed,
      }))
    );
  }

  const queue = [[row, col]];
  const visited = new Set<string>();

  const withinBounds = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < ROWS && y < COLS;

  while (queue.length > 0) {
    const [currentRow, currentCol] = queue.shift()!;
    const key = `${currentRow},${currentCol}`;

    if (visited.has(key) || !withinBounds(currentRow, currentCol)) {
      continue;
    }

    visited.add(key);

    if (newGrid[currentRow][currentCol].cell === 0) {
      for (const [dx, dy] of directions) {
        const newRow = currentRow + dx;
        const newCol = currentCol + dy;
        if (
          withinBounds(newRow, newCol) &&
          !visited.has(`${newRow},${newCol}`) &&
          !newGrid[newRow][newCol].isFlagged
        ) {
          queue.push([newRow, newCol]);
        }
      }
    }

    // newGrid[currentRow][currentCol] = -1;
    newGrid[currentRow][currentCol] = {
      ...newGrid[currentRow][currentCol],
      isRevealed: true,
    };
  }

  return newGrid;
};
