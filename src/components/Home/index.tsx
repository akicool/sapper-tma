import { useEffect, useState } from "react";
import clsx from "clsx";

import { Board } from "../Board";
import { MINES } from "../../constants";
import { useWinStore } from "../../store/win";
import { useGridStore } from "../../store/initialGrid";

type Props = {};

export const Home = (_: Props) => {
  const [flags, setFlags] = useState<number>(MINES);
  const [start, setStart] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const initialGrid = useGridStore((state) => state.initialGrid);
  const win = useWinStore((state: any) => state?.win);

  useEffect(() => {
    if (start) {
      if (win !== "pending") return;

      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [start, win]);

  const resetGame = () => {
    setFlags(MINES);
    setStart(false);
    setSeconds(0);
    useWinStore.getState().handleReset();
    useGridStore.getState().handleReset();
  };

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const time = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;

  return (
    <div className="font-mono flex flex-col gap-3 relative h-svh justify-center">
      <a
        className="absolute m-1 left-0 top-0 text-red-600"
        href="https://github.com/akicool"
      >
        By Akicool
      </a>

      {win !== "pending" && (
        <p className={clsx(win ? "text-green-500" : "text-red-300")}>
          {win ? "Ты выиграл" : "Ты проиграл"}
        </p>
      )}

      <div className=" w-full flex justify-between">
        <p>Флаги: {flags}</p>
        <p>Время: {time}</p>
      </div>

      <Board
        initialGrid={initialGrid}
        setStart={setStart}
        setFlags={setFlags}
      />

      {win !== "pending" && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={resetGame}
        >
          Рестарт
        </button>
      )}
    </div>
  );
};
