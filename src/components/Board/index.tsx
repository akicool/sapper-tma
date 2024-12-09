import { Dispatch, useCallback, useLayoutEffect, useState } from "react";

import { Cell } from "../Cell";
import { revealCells } from "../../utils/revealCells";
import { COLS, MINES, ROWS } from "../../constants";
import { TypeCell } from "../../types/cell";
import { useWinStore } from "../../store/win";
import { useGridStore } from "../../store/initialGrid";

export const Board = ({
  start,
  setStart,
  setFlags,
}: {
  start: boolean;
  initialGrid: TypeCell[][];
  setStart: Dispatch<React.SetStateAction<boolean>>;
  setFlags: Dispatch<React.SetStateAction<number>>;
}) => {
  const initialGrid = useGridStore((state) => state.initialGrid);
  const [grid, setGrid] = useState<TypeCell[][]>(initialGrid);

  useLayoutEffect(() => {
    setGrid(initialGrid);
  }, [initialGrid]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (grid[row][col].isRevealed || grid[row][col].isFlagged) return;

      const updatedGrid = revealCells([...grid], row, col);
      if (updatedGrid[row][col].cell == "mine") {
        useWinStore.getState().handleLose();
      }

      const isAllCellsRevealed =
        updatedGrid.reduce((acc, row) => {
          acc += row.filter((cell) => cell.isRevealed).length;
          return acc;
        }, 0) ===
        COLS * ROWS - MINES;

      if (isAllCellsRevealed) {
        useWinStore.getState().handleWin();
      }

      setGrid(updatedGrid);
      setStart(true);
    },
    [grid]
  );

  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={value}
            rowIndex={rowIndex}
            colIndex={colIndex}
            start={start}
            grid={grid}
            setGrid={setGrid}
            setFlags={setFlags}
            handleCellClick={handleCellClick}
          />
        ))
      )}
    </div>
  );
};
