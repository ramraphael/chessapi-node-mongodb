import { ChessSquare } from '../schemas/chessGame.schema';
import { isChessPieceValid } from './isChessPieceValid';
import { isChessPlayerValid } from './isChessPlayerValid';
import { BOARD_LENGTH } from '../constants/boardLength';

export const isChessSquareValid = (chessSquare: ChessSquare) => {
  return (
    chessSquare === null ||
    (isChessPieceValid(chessSquare.piece) &&
      isChessPlayerValid(chessSquare.player))
  );
};

export const isChessRow = (row: unknown[]) => {
  return row.length === BOARD_LENGTH && row.every(isChessSquareValid);
};

export const isChessBoardValid = (board: Array<Array<ChessSquare>>) => {
  return board.length === BOARD_LENGTH && board.every(isChessRow);
};
