import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChessGame, ChessGameSchema } from 'src/schemas/chessGame.schema';
import { ChessController } from './chess.controller';
import { ChessService } from './chess.service';
import { ChessLogicService } from './chessLogic.service';
import { PawnLogicService } from './pawnLogic.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChessGame.name, schema: ChessGameSchema },
    ]),
  ],
  controllers: [ChessController],
  providers: [ChessService, ChessLogicService, PawnLogicService],
})
export class ChessModule {}
