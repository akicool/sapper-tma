import { create } from "zustand";

type State = {
  win: boolean | "pending";
};

type Action = {
  handleLose: () => void;
  handleWin: () => void;
  handleReset: () => void;
};

export const useWinStore = create<State & Action>((set) => ({
  win: "pending",
  handleLose: () => set(() => ({ win: false })),
  handleWin: () => set(() => ({ win: true })),
  handleReset: () => set(() => ({ win: "pending" })),
}));
