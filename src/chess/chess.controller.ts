import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { boolean } from 'boolean';
import { ChessService } from './chess.service';

@Controller('chess')
export class ChessController {
  constructor(private chessService: ChessService) {}

  @Post('create')
  async createChessGame() {
    return await this.chessService.createGame();
  }

  @Get('game-state')
  async getChessGameState(@Query('id') id: string) {
    return await this.chessService.getGameState(id);
  }

  @Get('valid-moves')
  async getValidMoves(
    @Query('id') id: string,
    @Query('coordinates') coordinates: string,
  ) {
    return await this.chessService.getValidMoves(id, coordinates);
  }

  @Post('make-move')
  async makeMove(
    @Body()
    makeMoveDTO: {
      id: string;
      currentCoordinates: string;
      newCoordinates: string;
    },
  ) {
    const { id, currentCoordinates, newCoordinates } = makeMoveDTO;
    return await this.chessService.makeMove(
      id,
      currentCoordinates,
      newCoordinates,
    );
  }
}
