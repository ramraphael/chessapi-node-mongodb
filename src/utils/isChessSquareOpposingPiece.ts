import { ChessGame } from 'src/schemas/chessGame.schema';
import { ChessPlayer } from 'src/types/ChessPlayer';
import { CoordinatesArray } from 'src/types/CoordinatesArray';
import { isChessSquareOutOfBounds } from './isChessSquareOutOfBounds';

export const isChessSquareOpposingPiece = (
  chessGame: ChessGame,
  coordinatesArray: CoordinatesArray,
  currentPlayer: ChessPlayer,
) => {
  const [x, y] = coordinatesArray;

  if (isChessSquareOutOfBounds(coordinatesArray)) {
    return false;
  }

  return (
    chessGame.board[x][y] !== null &&
    chessGame.board[x][y].player !== currentPlayer
  );
};
