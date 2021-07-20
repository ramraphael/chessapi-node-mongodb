import { CoordinatesArray } from '../types/CoordinatesArray';

export const getCoordinatesArrayFromString = (coordinates: string) => {
  const [x, y] = coordinates.split('');

  return [parseInt(x), parseInt(y)] as CoordinatesArray;
};
