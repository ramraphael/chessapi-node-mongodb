import { Injectable } from '@nestjs/common';
import { ChessGame, ChessSquare } from 'src/schemas/chessGame.schema';
import { CoordinatesArray } from 'src/types/CoordinatesArray';
import { isChessSquareEmpty } from 'src/utils/isChessSquareEmpty';
import { isChessSquareOpposingPiece } from 'src/utils/isChessSquareOpposingPiece';

// Note: Pawn promotion not implemented
// (https://en.wikipedia.org/wiki/Promotion_(chess))
@Injectable()
export class PawnLogicService {
  constructor() {}

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
        // Both two squares and one square forward are okay
        return (
          (newX === currentX + 2 || newX === currentX + 1) && newSquare === null
        );
      } else {
        // Only one square forward is okay
        return newX === currentX + 1 && newSquare === null;
      }
    }

    // If chess piece is white
    if (currentSquare.player === 'white') {
      const isFirstMoveForPawn = currentX === 6;

      // If first move
      if (isFirstMoveForPawn) {
        // Both two squares and one square forward are okay
        return (
          (newX === currentX - 2 || newX === currentX - 1) && newSquare === null
        );
      } else {
        // Only one square forward is okay
        return newX === currentX - 1 && newSquare === null;
      }
    }
  }

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

    // Pawns can move one step forward
    if (squareAtLocation.player === 'white') {
      // white's pawns can move x-2 if first move and square is empty
      const isFirstMoveForPiece = x === 6;

      if (isFirstMoveForPiece) {
        if (isChessSquareEmpty(chessGame, [x - 2, y])) {
          validMoves.push([x - 2, y]);
        }
      }

      // white's pawns can move x-1 always, if square is empty
      if (isChessSquareEmpty(chessGame, [x - 1, y])) {
        validMoves.push([x - 1, y]);
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
    }

    return validMoves;
  }

  public getValidPawnCaptures(
    chessGame: ChessGame,
    coordinatesArray: CoordinatesArray,
  ) {
    // NOTES
    // Black is on top (starting at row 0)
    // White is on bottom (starting at row 7)

    const [x, y] = coordinatesArray;

    const squareAtLocation = chessGame.board[x][y] as ChessSquare;

    const validCaptures: CoordinatesArray[] = [];

    if (squareAtLocation.player === 'white') {
      // pawns can capture black's pieces diagonally forwards
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
      // pawns can capture white's pieces diagonally forwards
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

    return validCaptures;
  }
}
