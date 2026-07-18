# API

## To get this project up and running

- Rename `.env.sample` file in `./src/config` to `.env` and fill all env variables. 

### Yarn Users

- If you have `yarn` installed, run `yarn` in your terminal.
- After installation, run `yarn start` in your terminal.
- Your application should be live on the port specified in your `.env` file

### NPM Users

- If you have `npm` installed, run `npm install` in your terminal to install all deps
- After installation, run `npm start` in your terminal.
- Your application should be live on the port specified in your `.env` file

## To run tests

- Run `yarn test` or `npm test` in this directory.

## Architecture

The API follows a controller → service → repository layering:

- `src/controllers/` — HTTP only: parse the request, call a service, send the response. Errors are passed to `next(err)` and rendered by `src/middleware/error.middleware.ts`.
- `src/services/` — business rules. Throw `HttpException` subclasses from `src/exceptions/` for domain errors.
- `src/repositories/` — the only layer that touches Mongoose, via the generic `BaseRepository`.

Dependencies are wired with constructor default parameters, so tests inject plain jest mocks:
`new RoomsController(mockService)`, `new RoomsService(mockRepository)`.