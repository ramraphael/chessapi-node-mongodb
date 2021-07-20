import { ChessGame } from 'src/schemas/chessGame.schema';
import { ChessGameDocument } from '../schemas/chessGame.schema';

type GameData = ChessGame & { id: string };

export const getChessGameDataFromDocument = (chessGame: ChessGameDocument) => {
  const { _id, gameState, currentPlayer, board } = chessGame;

  return { id: _id, gameState, currentPlayer, board } as GameData;
};
