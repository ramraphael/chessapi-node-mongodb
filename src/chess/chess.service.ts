import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChessGame, ChessGameDocument } from '../schemas/chessGame.schema';
import { ChessLogicService } from './chessLogic.service';
import {
  DatabaseException,
  InvalidCoordinatesException,
  InvalidMoveException,
} from './chess.errors';
import { getCoordinatesArrayFromString } from '../utils/getCoordinatesArrayFromString';
import { isCoordinatesStringValid } from 'src/validators/isCoordinateValid';
import { getChessGameDataFromDocument } from '../utils/getGameData';
import { isChessSquareOpposingPiece } from '../utils/isChessSquareOpposingPiece';

@Injectable()
export class ChessService {
  constructor(
    @InjectModel(ChessGame.name)
    private chessGameModel: Model<ChessGameDocument>,
    private readonly chessLogicService: ChessLogicService,
  ) {}

  /**
   * Creates a new chess game
   * @returns game state and board
   */
  async createGame() {
    const createdChessGame = new this.chessGameModel();

    const savedChessGame = await createdChessGame.save().catch((error) => {
      console.error('Error creating new chess game', error);
      throw new DatabaseException();
    });

    return getChessGameDataFromDocument(savedChessGame);
  }

  /**
   *
   * @param {string} id
   * @returns {GameState}
   */
  async getGameState(id: string) {
    const retrievedGame = await this.chessGameModel
      .findById(id)
      .catch((error) => {
        console.error('Error getting game from database: ', error);
        throw new DatabaseException();
      });

    return getChessGameDataFromDocument(retrievedGame);
  }

  /**
   *
   * @param {string} id
   * @param {string} coordinates String repenting concatenated coordinates "xy"
   * @returns {object} An object with an array each of validMoves and validCaptures
   */
  async getValidMoves(id: string, coordinates: string) {
    if (!isCoordinatesStringValid(coordinates)) {
      throw new InvalidCoordinatesException(coordinates);
    }

    const coordinatesArray = getCoordinatesArrayFromString(coordinates);

    const retrievedGame = await this.chessGameModel
      .findById(id)
      .catch((error) => {
        console.error('Error getting game from database: ', error);
        throw new DatabaseException();
      });

    return this.chessLogicService.getValidMoves(
      retrievedGame,
      coordinatesArray,
    );
  }

  /**
   *
   * @param {string} id
   * @param {string} currentCoordinates - x and y coordinates concatenated
   * @param {string} newCoordinates - x and y coordinates concatenated
   * @param {string} isCapture - "true" or "false"
   * @returns {GameState} GameState
   */
  async makeMove(
    id: string,
    currentCoordinates: string,
    newCoordinates: string,
  ) {
    if (!isCoordinatesStringValid(currentCoordinates)) {
      throw new InvalidCoordinatesException(currentCoordinates);
    }

    const currentCoordinatesArray =
      getCoordinatesArrayFromString(currentCoordinates);

    const [currentX, currentY] = currentCoordinatesArray;

    if (!isCoordinatesStringValid(newCoordinates)) {
      throw new InvalidCoordinatesException(newCoordinates);
    }

    const newCoordinatesArray = getCoordinatesArrayFromString(newCoordinates);

    const [newX, newY] = newCoordinatesArray;

    const retrievedGame = await this.chessGameModel
      .findById(id)
      .catch((error) => {
        console.error('Error getting game from database: ', error);
        throw new DatabaseException();
      });

    const isCapture = isChessSquareOpposingPiece(
      retrievedGame,
      newCoordinatesArray,
      retrievedGame.currentPlayer,
    );

    if (
      !this.chessLogicService.isMoveValid(
        retrievedGame,
        currentCoordinatesArray,
        newCoordinatesArray,
        isCapture,
      )
    ) {
      throw new InvalidMoveException();
    }

    const updatedBoard = [...retrievedGame.board];

    // ove piece to new location
    updatedBoard[newX][newY] = updatedBoard[currentX][currentY];

    // Reset current location
    updatedBoard[currentX][currentY] = null;

    // Next player's turn
    const nextPlayer =
      retrievedGame.currentPlayer === 'white' ? 'black' : 'white';

    // Update chess game, and send back updated state
    const updatedChessGame = await this.chessGameModel
      .findByIdAndUpdate(id, {
        board: updatedBoard,
        currentPlayer: nextPlayer,
      })
      .catch((error) => {
        console.error('Error updating game in database: ', error);
        throw new DatabaseException();
      });

    return getChessGameDataFromDocument(updatedChessGame);
  }
}
