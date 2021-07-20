import { Injectable } from '@nestjs/common';
import { ChessGame, ChessSquare } from 'src/schemas/chessGame.schema';
import { CoordinatesArray } from 'src/types/CoordinatesArray';
import { isChessSquareEmpty } from 'src/utils/isChessSquareEmpty';
import { isChessSquareOpposingPiece } from 'src/utils/isChessSquareOpposingPiece';

@Injectable()
export class PawnLogicService {
  constructor() {}

  public isValidPawnCapture(
    chessGame: ChessGame,
    currentCoordinates: CoordinatesArray,
    newCoordinates: CoordinatesArray,
  ): Boolean {
    const { currentPlayer } = chessGame;
    const [currentX, currentY] = currentCoordinates;
    const [newX, newY] = newCoordinates;

    let isCaptureLegal = false;

    // NOTES
    // Black is on top (starting at row 0)
    // White is on bottom (starting at row 7)

    // if new coordinates are legal and contains opposing chess piece
    if (currentPlayer === 'white') {
      if (
        newX === currentX - 1 &&
        (newY === currentY - 1 || newY === currentY + 1)
      ) {
        isCaptureLegal = true;
      }
    } else if (currentPlayer === 'black') {
      if (
        newX === currentX + 1 &&
        (newY === currentY - 1 || newY === currentY + 1)
      ) {
        isCaptureLegal = true;
      }
    }

    return (
      isCaptureLegal &&
      isChessSquareOpposingPiece(
        chessGame,
        newCoordinates,
        chessGame.currentPlayer,
      )
    );
  }

  public isValidPawnMove(
    chessGame: ChessGame,
    currentCoordinates: CoordinatesArray,
    newCoordinates: CoordinatesArray,
  ) {
    const [currentX, currentY] = currentCoordinates;
    const [newX, newY] = newCoordinates;

    const currentSquare = chessGame.board[currentX][currentY];
    const newSquare = chessGame.board[newX][newY];

    // NOTES
    // Black is on top (starting at row 0)
    // White is on bottom (starting at row 7)

    // If chess piece is black
    if (currentSquare.player === 'black') {
      const isFirstMoveForPawn = currentX === 1;

      // If first move
      if (isFirstMoveForPawn) {
        // If coordinates are correct and piece is not occupied, ok
        return (
          (newX === currentX + 2 || newX === currentX + 1) && newSquare === null
        );
      } else {
        // else
        // If coordinates are correct and piece is not occupied, ok
        return newX === currentX + 1 && newSquare === null;
      }
    }

    // If chess piece is white
    if (currentSquare.player === 'white') {
      const isFirstMoveForPawn = currentX === 6;

      // If first move
      if (isFirstMoveForPawn) {
        // If coordinates are correct and piece is not occupied, ok
        return (
          (newX === currentX - 2 || newX === currentX - 1) && newSquare === null
        );
      } else {
        // If coordinates are correct and piece is not occupied, ok
        return newX === currentX - 1 && newSquare === null;
      }
    }
  }

  // NOTE This should be a private method, but private methods in Typescript
  // cannot be (unit) tested
  public getValidPawnMoves(
    chessGame: ChessGame,
    coordinatesArray: CoordinatesArray,
  ) {
    // NOTES
    // Black is on top (starting at row 0)
    // White is on bottom (starting at row 7)

    const [x, y] = coordinatesArray;

    const squareAtLocation = chessGame.board[x][y] as ChessSquare;

    const validMoves: CoordinatesArray[] = [];
    const validCaptures: CoordinatesArray[] = [];

    // Pawns can move one step forward
    // White:
    if (squareAtLocation.player === 'white') {
      // white's pawns can move x+2 if first move and square is empty
      const isFirstMoveForPiece = x === 6;

      if (isFirstMoveForPiece) {
        if (isChessSquareEmpty(chessGame, [x - 2, y])) {
          validMoves.push([x - 2, y]);
        }
      }

      // white's pawns can move x+1 always, if square is empty
      if (isChessSquareEmpty(chessGame, [x - 1, y])) {
        validMoves.push([x - 1, y]);
      }

      // white's pawns can capture black's pieces if they are diagonal
      if (
        isChessSquareOpposingPiece(
          chessGame,
          [x - 1, y - 1],
          squareAtLocation.player,
        )
      ) {
        validCaptures.push([x - 1, y - 1]);
      }

      if (
        isChessSquareOpposingPiece(
          chessGame,
          [x - 1, y + 1],
          squareAtLocation.player,
        )
      ) {
        validCaptures.push([x - 1, y + 1]);
      }
    } else if (squareAtLocation.player === 'black') {
      const isFirstMoveForPiece = x === 1;

      // black's pawns can move x+2 if first move and square is empty
      if (isFirstMoveForPiece) {
        if (isChessSquareEmpty(chessGame, [x + 2, y])) {
          validMoves.push([x + 2, y]);
        }
      }

      // black's pawns can move x+1 always, if square is empty
      if (isChessSquareEmpty(chessGame, [x + 1, y])) {
        validMoves.push([x + 1, y]);
      }
      // black's pawns can capture white's pieces if they are diagonal
      if (
        isChessSquareOpposingPiece(
          chessGame,
          [x + 1, y + 1],
          squareAtLocation.player,
        )
      ) {
        validCaptures.push([x + 1, y + 1]);
      }

      if (
        isChessSquareOpposingPiece(
          chessGame,
          [x + 1, y - 1],
          squareAtLocation.player,
        )
      ) {
        validCaptures.push([x + 1, y - 1]);
      }
    }

    return { validMoves, validCaptures };
  }
}
