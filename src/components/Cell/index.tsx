import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ElementHold, HOLD_EVENT_TYPE } from "hold-event";

import { TypeCell } from "../../types/cell";
import { getCellValue } from "../../utils/getCellValue";
import { useWinStore } from "../../store/win";
import { useGridStore } from "../../store/initialGrid";

export const Cell = memo(
  ({
    value,
    rowIndex,
    colIndex,
    grid,
    setGrid,
    setFlags,
    handleCellClick,
  }: {
    value: TypeCell;
    rowIndex: number;
    colIndex: number;
    grid: TypeCell[][];
    setGrid: (value: TypeCell[][]) => void;
    setFlags: (flags: number | ((prevFlag: number) => number)) => void;
    handleCellClick: (row: number, col: number) => void;
  }) => {
    const initialGrid = useGridStore((state) => state.initialGrid);

    const [isHolding, setIsHolding] = useState(false);
    const [isBomb, setIsBomb] = useState(false);
    const [preventClick, setPreventClick] = useState(false);

    const cellRef = useRef<HTMLDivElement | null>(null);
    const cell = getCellValue(value);

    useLayoutEffect(() => {
      setIsBomb(false);
    }, [initialGrid]);

    useEffect(() => {
      if (!cellRef.current) return;

      const cellHold = new ElementHold(cellRef.current);

      const handleHolding = (event: any) => {
        if (Math.round(event?.elapsedTime) > 500 && !isHolding) {
          setIsHolding(true);
          setPreventClick(true);

          if (!value.isRevealed) {
            const newGrid = [...grid].map((row, rowIdx) =>
              row.map((cell, colIdx) => ({
                ...cell,
                isFlagged:
                  rowIdx === rowIndex && colIdx === colIndex
                    ? !cell.isFlagged
                    : cell.isFlagged,
              }))
            );

            setGrid(newGrid);

            if (!value.isFlagged) {
              setFlags((prevFlag) => prevFlag - 1);
            } else {
              setFlags((prevFlag) => prevFlag + 1);
            }
          }
        }
      };

      const handleHoldEnd = () => {
        setIsHolding(false);

        if (preventClick) {
          setPreventClick(false);
        }
      };

      cellHold.addEventListener(HOLD_EVENT_TYPE.HOLDING, handleHolding);
      cellHold.addEventListener(HOLD_EVENT_TYPE.HOLD_END, handleHoldEnd);

      return () => {
        cellHold.removeEventListener(HOLD_EVENT_TYPE.HOLDING, handleHolding);
        preventClick &&
          cellHold.removeEventListener(HOLD_EVENT_TYPE.HOLD_END, handleHoldEnd);
      };
    }, [isHolding, preventClick, value, rowIndex, colIndex, setGrid, setFlags]);

    return (
      <div
        className={clsx(
          "size-7 border-solid border-2 flex justify-center items-center text-cyan-200 relative",
          value.isRevealed || "bg-gray-500",
          isBomb && "bg-red-500"
        )}
        ref={cellRef}
        onClick={() => {
          if (isHolding || value?.isFlagged || preventClick) return;
          if (useWinStore.getState().win !== "pending") return;
          if (value.cell === "mine") setIsBomb(true);

          handleCellClick(rowIndex, colIndex);
        }}
      >
        <div
          className={clsx(
            "size-full absolute inset-0",
            value?.isFlagged && "bg-yellow-500"
          )}
        >
          {value?.isFlagged && "🚩"}
        </div>

        {value.isRevealed ? cell : ""}
      </div>
    );
  }
);
