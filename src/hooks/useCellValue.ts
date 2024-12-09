export const useGenerateCellValues = (
  rows: number,
  cols: number,
  mines: number
) => {
  const totalCells = rows * cols;

  const cells = Array.from({ length: totalCells }, (_, idx) => idx);

  const shuffledCells = [...cells].sort(() => 0.5 - Math.random());
  const mineCells = new Set(shuffledCells.slice(0, mines));

  const isInBounds = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < rows && y < cols;

  const getAdjacentMinesCount = (x: number, y: number) => {
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

    return directions.reduce((count, [dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      const neighborIndex = nx * cols + ny;

      return (
        count + (isInBounds(nx, ny) && mineCells.has(neighborIndex) ? 1 : 0)
      );
    }, 0);
  };

  const grid = Array.from({ length: rows }, (_, x) =>
    Array.from({ length: cols }, (_, y) => ({
      cell: mineCells.has(x * cols + y) ? "mine" : getAdjacentMinesCount(x, y),
      isRevealed: false,
      isFlagged: false,
    }))
  );

  return grid;
};
