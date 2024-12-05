export type TypeCell = {
  col: ICell;
  i: number;
  j: number;
  onLClick: (e: any, i: number, j: number) => void;
  onRClick: (e: any, i: number, j: number) => void;
  width: number | string;
  height: number | string;
};

export interface ICell {
  x: number;
  y: number;
  isMine: boolean;
  neighbors: number;
  isEmpty: boolean;
  isOpen: boolean;
  flagIndex: number;
}

export interface ISetupData {
  width: number;
  height: number;
  mines: number;
}
