# README

## Development

- This chess api was developed using [Nest.js](https://docs.nestjs.com/) (Node) and [MongoDB](https://docs.nestjs.com/techniques/mongodb) (with the Mongoose ODM)
- Before starting the application, add the mongodb databse uri to `config/.env`. (MongoDB Atlas was used during development, though a docker-compose file can be created to start a MonogoDB instance locally)
- To start the application locally, first ensure that nvm is installed, then run:

```bash
nvm use
npm install
npm start:dev
```

- The server should now be listening at the port defined in `config/.env`

## Technical decisions

### Nest.js

Nest.js was chosen as the preferred Node.js framework, since it provides an opinionated, predictable way to organize and test Node.js applications- controllers, providers (business logic) and schema/models are separate. The decorator-based approach also provides an intuitive developer experience (at the expense of some abstraction and "magic").

Nest.js is an abstraction layer on top of Express.js, but if more performance is required, the Express driver can be swapped out for Fastify, [which performs much better than Express in benchmarks](https://www.fastify.io/benchmarks/).

## Code structure

`Services` (logic classes) are separated within the `chess` folder. The `chess` service is where all the database operations occur- the `chess` service calls methods in the `chessLogic` service, which filters by the type of `ChessPiece` and calls methods in the respective Piece's logic class (only `PawnLogicService` for now).

The board in the MongoDB model is structured as a Mixed 2D array, with validators in place to ensure that the data matches what we expect. Unfortunately, Mongoose doesn't let us create strictly typed 2D arrays (that I've found).

### Fixed positioning of black and white pieces

To make the business logic easier to define, all boards will have Black's pieces starting at row 0, and White's pieces starting at row 7. Client apps that wish to show a rotated board will have to implement that display logic.

### Error handling

Nest.js provides an HTTP Exception class that when thrown, allows us to declaratively return error responses to the client. This class has been extended to create several more specific exceptions (seen in `chess.errors.ts`).

### Testing

Tests have unfortunately not been completed due to time-constraint, but a file has been added, outlining how one might write tests for the `pawnLogicService`. Ideally, we should have good test coverage, with at least unit tests for the core business logic, and some E2E smoke tests to ensure base functionality.
