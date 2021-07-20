import { BOARD_LENGTH } from 'src/constants/boardLength';
import { ChessSquare } from 'src/schemas/chessGame.schema';
import { ChessPlayer } from '../types/ChessPlayer';

const secondRankFactory = (player: ChessPlayer): Array<ChessSquare> =>
  new Array(BOARD_LENGTH).fill(null).map((cell) => ({ player, piece: 'P' }));

const firstRankFactory = (player: ChessPlayer): Array<ChessSquare> => {
  const firstThreePieces: ChessSquare[] = [
    { player, piece: 'C' },
    { player, piece: 'N' },
    { player, piece: 'R' },
  ];

  const kingAndQueen: ChessSquare[] = [
    { player, piece: 'K' },
    { player, piece: 'Q' },
  ];

  return [...firstThreePieces, ...kingAndQueen, ...firstThreePieces.reverse()];
};

const emptyRankFactory = () => new Array(BOARD_LENGTH).fill(null);

export const initialBoardFactory = (): Array<Array<ChessSquare>> => [
  firstRankFactory('black'),
  secondRankFactory('black'),
  emptyRankFactory(),
  emptyRankFactory(),
  emptyRankFactory(),
  emptyRankFactory(),
  secondRankFactory('white'),
  firstRankFactory('white'),
];
