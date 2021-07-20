import { Injectable } from '@nestjs/common';
import { CoordinatesArray } from 'src/types/CoordinatesArray';
import { isChessSquareOutOfBounds } from 'src/utils/isChessSquareOutOfBounds';
import { ChessGame, ChessSquare } from '../schemas/chessGame.schema';
import {
  OutOfTurnException,
  OutOfBoundsException,
  NotImplementedException,
} from './chess.errors';
import { PawnLogicService } from './pawnLogic.service';

@Injectable()
export class ChessLogicService {
  constructor(private pawnLogicService: PawnLogicService) {}

  public getValidMoves(
    chessGame: ChessGame,
    coordinatesArray: CoordinatesArray,
  ) {
    const [x, y] = coordinatesArray;

    const currentSquare = chessGame.board[x][y] as ChessSquare;

    if (currentSquare === null) {
      return [];
    }
    if (currentSquare.player !== chessGame.currentPlayer) {
      throw new OutOfTurnException(currentSquare.player);
    }

    // Call correct method depending on piece type
    if (currentSquare.piece === 'P') {
      return this.pawnLogicService.getValidPawnMoves(
        chessGame,
        coordinatesArray,
      );
    }

    throw new NotImplementedException('Chess piece');
  }

  public validateMove(
    chessGame: ChessGame,
    currentCoordinates: CoordinatesArray,
    newCoordinates: CoordinatesArray,
    isCapture: boolean,
  ): Boolean {
    const [x, y] = currentCoordinates;

    const currentSquare = chessGame.board[x][y];

    if (currentSquare.player !== chessGame.currentPlayer) {
      throw new OutOfTurnException(currentSquare.player);
    }

    if (isChessSquareOutOfBounds(newCoordinates)) {
      throw new OutOfBoundsException(newCoordinates);
    }

    if (currentSquare.piece === 'P') {
      if (isCapture) {
        return this.pawnLogicService.isValidPawnCapture(
          chessGame,
          currentCoordinates,
          newCoordinates,
        );
      }

      return this.pawnLogicService.isValidPawnMove(
        chessGame,
        currentCoordinates,
        newCoordinates,
      );
    }

    throw new NotImplementedException('Chess piece');
  }
}
