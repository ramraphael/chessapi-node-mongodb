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
  ): { validMoves: CoordinatesArray[]; validCaptures: CoordinatesArray[] } {
    const [x, y] = coordinatesArray;

    const currentSquare = chessGame.board[x][y] as ChessSquare;

    // Empty square provided- no moves
    if (currentSquare === null) {
      return { validMoves: [], validCaptures: [] };
    }

    if (currentSquare.player !== chessGame.currentPlayer) {
      throw new OutOfTurnException(currentSquare.player);
    }

    // Call correct method depending on piece type
    if (currentSquare.piece === 'P') {
      const validMoves = this.pawnLogicService.getValidPawnMoves(
        chessGame,
        coordinatesArray,
      );

      const validCaptures = this.pawnLogicService.getValidPawnCaptures(
        chessGame,
        coordinatesArray,
      );

      return { validMoves, validCaptures };
    }

    // TODO Pieces other than pawns have not yet been implemented
    throw new NotImplementedException('Chess piece');
  }

  public isMoveValid(
    chessGame: ChessGame,
    currentCoordinates: CoordinatesArray,
    newCoordinates: CoordinatesArray,
    isCapture: boolean,
  ): Boolean {
    const [x, y] = currentCoordinates;

    console.log('Current coordinates: ', currentCoordinates);

    const currentSquare = chessGame.board[x][y];

    console.log('Current square: ', currentSquare);

    console.log('Current player: ', chessGame.currentPlayer);

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

    // TODO Pieces other than pawns have not yet been implemented
    throw new NotImplementedException('Chess piece');
  }
}
