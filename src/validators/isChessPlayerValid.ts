import { ChessPlayer } from '../types/ChessPlayer';

export const isChessPlayerValid = (player): player is ChessPlayer =>
  ['white', 'black'].includes(player);
