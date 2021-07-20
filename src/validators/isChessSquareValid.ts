import { ChessSquare } from '../schemas/chessGame.schema';
import { isChessPlayerValid } from './isChessPlayerValid';
import { isChessPieceValid } from './isChessPieceValid';

export const isChessSquareValid = (chessSquare: ChessSquare) => {
  return (
    isChessPlayerValid(chessSquare.player) &&
    isChessPieceValid(chessSquare.piece)
  );
};
