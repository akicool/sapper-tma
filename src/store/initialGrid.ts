import { create } from "zustand";
import { useGenerateCellValues } from "../hooks/useGenerateCellValues";
import { COLS, MINES, ROWS } from "../constants";
import { TypeCell } from "../types/cell";

type State = {
  initialGrid: TypeCell[][];
};

type Action = {
  handleReset: () => void;
};

const generateGrid = useGenerateCellValues(ROWS, COLS, MINES);

export const useGridStore = create<State & Action>((set) => ({
  initialGrid: generateGrid,
  handleReset: () =>
    set(() => {
      const generateGrid = useGenerateCellValues(ROWS, COLS, MINES);

      return { initialGrid: generateGrid };
    }),
}));
