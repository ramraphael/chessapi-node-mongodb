import { Controller, Get, Post, Query } from '@nestjs/common';
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
    // TODO should this be a JSON post body? Create DTO (what are pipes?)
    @Query('id') id: string,
    @Query('current-coordinates') currentCoordinates: string,
    @Query('new-coordinates') newCoordinates: string,
    @Query('isCapture') isCapture: string,
  ) {
    return await this.chessService.makeMove(
      id,
      currentCoordinates,
      newCoordinates,
      boolean(isCapture),
    );
  }
}
