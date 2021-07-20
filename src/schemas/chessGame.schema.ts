import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { initialBoardFactory } from '../utils/boardFactory';
import { ChessPlayer } from '../types/ChessPlayer';
import { ChessPiece } from '../types/ChessPiece';
import { GameState } from '../types/GameState';
import { isChessBoardValid } from '../validators/isChessBoardValid';
import { isChessPlayerValid } from 'src/validators/isChessPlayerValid';

const { Mixed, String } = mongoose.Schema.Types;

export type ChessGameDocument = ChessGame & Document;

export type ChessSquare = null | {
  piece: ChessPiece;

  player: ChessPlayer;
};

@Schema()
export class ChessGame {
  @Prop({
    type: String,
    required: true,
    default: 'white',
    validate: isChessPlayerValid,
  })
  currentPlayer: ChessPlayer;

  @Prop({
    type: String,
    default: 'in-progress',
  })
  gameState: GameState;

  @Prop({
    type: Mixed,
    validate: isChessBoardValid,
    default: initialBoardFactory(),
  })
  board: Array<Array<ChessSquare>>;
}

export const ChessGameSchema = SchemaFactory.createForClass(ChessGame);
