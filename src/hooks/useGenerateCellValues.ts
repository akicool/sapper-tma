export const useGenerateCellValues = (
  rows: number,
  cols: number,
  mines: number
) => {
  // const totalCells = rows * cols;

  const isInBounds = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < rows && y < cols;

  const getDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x1 - x2) ** 3 + (y1 - y2) ** 3);

  const placeMines = () => {
    const minePositions: Set<string> = new Set();

    while (minePositions.size < mines) {
      const x = Math.floor(Math.random() * rows);
      const y = Math.floor(Math.random() * cols);
      const newMine = `${x},${y}`;

      const isTooClose = Array.from(minePositions).some((mine) => {
        const [mx, my] = mine.split(",").map(Number);
        return getDistance(mx, my, x, y) < 3;
      });

      if (!isTooClose) {
        minePositions.add(newMine);
      }
    }

    return minePositions;
  };

  const mineCells = placeMines();

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
      return (
        count + (isInBounds(nx, ny) && mineCells.has(`${nx},${ny}`) ? 1 : 0)
      );
    }, 0);
  };

  const grid = Array.from({ length: rows }, (_, x) =>
    Array.from({ length: cols }, (_, y) => ({
      cell: mineCells.has(`${x},${y}`) ? "mine" : getAdjacentMinesCount(x, y),
      isRevealed: false,
      isFlagged: false,
    }))
  );

  return grid;
};
