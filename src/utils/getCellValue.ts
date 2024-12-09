import { TypeCell } from "../types/cell";

export const getCellValue = (value: TypeCell) => {
  switch (value.cell) {
    case "mine":
      return "💣";
    case 0:
      return "";
    default:
      return value.cell;
  }
};
