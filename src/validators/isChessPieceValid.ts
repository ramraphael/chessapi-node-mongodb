import { ChessPiece } from '../types/ChessPiece';
import { CHESS_PIECES } from '../constants/chessPieces';

export const isChessPieceValid = (piece: string): piece is ChessPiece =>
  CHESS_PIECES.includes(piece);
