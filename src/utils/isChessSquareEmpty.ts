import { ChessGame } from 'src/schemas/chessGame.schema';
import { CoordinatesArray } from 'src/types/CoordinatesArray';
import { isChessSquareOutOfBounds } from './isChessSquareOutOfBounds';

// TODO update method to take a board instead of whole game
export const isChessSquareEmpty = (
  chessGame: ChessGame,
  coordinatesArray: CoordinatesArray,
) => {
  const [x, y] = coordinatesArray;

  if (isChessSquareOutOfBounds(coordinatesArray)) {
    return false;
  }

  return chessGame.board[x][y] === null;
};
