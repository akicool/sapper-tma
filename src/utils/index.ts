import { produce } from "immer";
import { ICell } from "../types/cell";

interface SetupData {
  width: number;
  height: number;
  mines: number;
}

// Генерация случайных позиций мин
export const generateRandomMines = (
  data: ICell[][],
  height: number,
  width: number,
  mines: number
): ICell[][] => {
  let minesPlanted = 0;
  while (minesPlanted < mines) {
    const randomX = Math.floor(Math.random() * width);
    const randomY = Math.floor(Math.random() * height);
    if (!data[randomX][randomY].isMine) {
      data[randomX][randomY].isMine = true;
      minesPlanted += 1;
    }
  }
  return data;
};

// Получение соседей клетки
export const getNeighbors = (
  i: number,
  j: number,
  data: ICell[][],
  height: number,
  width: number
): ICell[] => {
  const neighbors: ICell[] = [];
  const surroundings = [
    [-1, -1], // Левый верхний
    [-1, 0], // Центральный верхний
    [-1, 1], // и т.д.
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  surroundings.forEach(([x, y]) => {
    const newX = i + x;
    const newY = j + y;
    if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
      neighbors.push(data[newX][newY]);
    }
  });

  return neighbors;
};

// Генерация соседей
export const generateNeighbors = (
  data: ICell[][],
  height: number,
  width: number
): ICell[][] => {
  const dataCopy = data;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let mines = 0;
      const area = getNeighbors(
        data[i][j].x,
        data[i][j].y,
        data,
        height,
        width
      );
      area.forEach((value) => {
        if (value.isMine) {
          mines += 1;
        }
      });
      if (!mines) {
        dataCopy[i][j].isEmpty = true;
      }
      dataCopy[i][j].neighbors = mines;
    }
  }
  return dataCopy;
};

// Инициализация поля
export const initBoard = (setupData: SetupData): ICell[][] => {
  const { width, height, mines } = setupData;
  const array2D: ICell[][] = Array(width)
    .fill(0)
    .map((_, indexH) =>
      Array(height)
        .fill(null)
        .map((_, indexW) => ({
          x: indexH,
          y: indexW,
          isMine: false,
          neighbors: 0,
          isEmpty: false,
          isOpen: false,
          flagIndex: 0, // 0 - пустая ячейка, 1 - флажок, 2 - вопросительный знак
        }))
    );

  const arrayWithMines = generateRandomMines(array2D, height, width, mines);
  return generateNeighbors(arrayWithMines, height, width);
};

// Показ пустых ячеек
export const showEmptyCells = (
  height: number,
  width: number,
  x: number,
  y: number,
  data: ICell[][]
): ICell[][] => {
  const neighbors = getNeighbors(x, y, data, height, width);

  neighbors.forEach((cell) => {
    if (
      !cell.isOpen &&
      (cell.isEmpty || !cell.isMine) &&
      cell.flagIndex === 0
    ) {
      Object.assign(data[cell.x][cell.y], { isOpen: true });
      if (cell.isEmpty) {
        showEmptyCells(height, width, cell.x, cell.y, data);
      }
    }
  });

  return data;
};

// Раскрытие игрового поля при поражении
export const showGridLose = (data: ICell[][]): ICell[][] => {
  return produce(data, (draft) =>
    draft.map((row) =>
      row.map((cell) => ({
        ...cell,
        isOpen: true,
      }))
    )
  );
};

// Раскрытие игрового поля при победе
export const showGridWin = (data: ICell[][]): ICell[][] => {
  return produce(data, (draft) =>
    draft.map((row) =>
      row.map((cell) => {
        if (cell.isMine) {
          return { ...cell, isOpen: false, flagIndex: 1 };
        }
        return { ...cell, isOpen: true };
      })
    )
  );
};
