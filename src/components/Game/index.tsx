import styles from "./Game.module.scss";
import { useEffect, useState } from "react";
import { initBoard } from "../../utils/index.js";
import { Board } from "../Board/index.js";
import { ISetupData } from "../../types/cell.js";

type User = {
  id: number;
  userName: string;
  userTime: number;
};

export const Game = ({
  data,
  setGameStarted,
  name,
}: {
  data: ISetupData;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
}) => {
  const windowWidth = document.documentElement.clientWidth;
  const [users, setUsers] = useState<User[]>([]);

  const [gameStatus, setGameStatus] = useState("😁");
  const [grid, setGrid] = useState(() => initBoard(data));
  const [mineCount, setMineCount] = useState(data.mines);
  const [mobileFlag, setMobileFlag] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isTimeActive, setIsTimeActive] = useState(true);

  useEffect(() => {
    let interval: number | null = null;

    if (isTimeActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }
    if ((!isTimeActive && seconds !== 0) || seconds >= 999) {
      clearInterval(interval!);
    }

    return () => clearInterval(interval!);
  }, [isTimeActive, seconds]);

  useEffect(() => {
    if (gameStatus !== "😁") {
      setIsTimeActive(false);
    }
    if (gameStatus === "😎") {
      let updatedUsers = [...users];

      const foundUser = updatedUsers.find((item) => item.userName === name);
      if (updatedUsers.length > 0 && foundUser) {
        updatedUsers.map((prevUser) => {
          if (
            prevUser.userName === foundUser.userName &&
            prevUser.userTime > seconds
          ) {
            prevUser.userTime = seconds;
          }
          return prevUser;
        });
      } else {
        updatedUsers = [
          ...users,
          { userName: name, userTime: seconds },
        ] as User[];
      }

      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
  }, [gameStatus]);

  const moveSettings = () => {
    setGameStarted(false);
  };

  const resetGame = (setupData: ISetupData) => {
    setGameStatus("😁");
    setGrid(initBoard(setupData));
    setMineCount(data.mines);

    setSeconds(0);
    setIsTimeActive(true);
  };

  return (
    <div className={[styles.game, styles.paper].join(" ")}>
      <div className={styles.control}>
        <h3>{gameStatus}</h3>
        <div className={styles.info}>
          <h3>Счет: {mineCount}</h3>
          <h3>Время: {seconds}</h3>
        </div>
        <div className={styles.buttons}>
          {/* <button className={styles.button} onClick={moveSettings}>
            Настройки
          </button> */}
          <button className={styles.button} onClick={() => resetGame(data)}>
            Обновить игру
          </button>
        </div>

        {windowWidth <= 768 && (
          <div className={styles.mobileButtons}>
            <button
              className={
                mobileFlag
                  ? [styles.mobileButton, styles.active].join(" ")
                  : styles.mobileButton
              }
              onClick={() => setMobileFlag((prev) => !prev)}
            >
              🚩
            </button>
          </div>
        )}
      </div>

      <Board
        data={data}
        gameStatus={gameStatus}
        setGameStatus={setGameStatus}
        grid={grid}
        setGrid={setGrid}
        mineCount={mineCount}
        setMineCount={setMineCount}
        mobileFlag={mobileFlag}
      />
    </div>
  );
};
