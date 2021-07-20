import { HttpException, HttpStatus } from '@nestjs/common';
import { ChessPlayer } from '../types/ChessPlayer';
import { CoordinatesArray } from '../types/CoordinatesArray';

// TODO add comment describing error
export class OutOfTurnException extends HttpException {
  constructor(notCurrentChessPlayer: ChessPlayer) {
    super(`Not ${notCurrentChessPlayer}'s turn`, HttpStatus.FORBIDDEN);
  }
}

// TODO add comment describing error
export class NotImplementedException extends HttpException {
  constructor(functionality: string) {
    const message = functionality
      ? `${functionality} not yet implemented`
      : 'Functionality not yet implemented';

    super(message, HttpStatus.NOT_IMPLEMENTED);
  }
}

// TODO add comment describing error
export class OutOfBoundsException extends HttpException {
  constructor(coordinates: CoordinatesArray) {
    super(`Square ${coordinates} is out of bounds`, HttpStatus.FORBIDDEN);
  }
}

// TODO add comment describing error
export class DatabaseException extends HttpException {
  constructor() {
    super('Error in database operation', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class InvalidCoordinatesException extends HttpException {
  constructor() {
    super('Invalid coordinates', HttpStatus.BAD_REQUEST);
  }
}
