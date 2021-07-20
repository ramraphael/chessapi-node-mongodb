import { CoordinatesArray } from 'src/types/CoordinatesArray';

export const isChessSquareOutOfBounds = (
  coordinatesArray: CoordinatesArray,
) => {
  const [x, y] = coordinatesArray;

  return x > 7 || x < 0 || y > 7 || y < 0;
};
