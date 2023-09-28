/* eslint-disable @typescript-eslint/no-unused-vars */
import { SliceCaseReducers, createSlice } from '@reduxjs/toolkit';
import { getSquaresAroundSquare, initializeBoard } from '../../_shared/utils';
import { ClickSquareAction, Square, ToogleFlagOnSquareAction } from './actions';

export type BoardState = {
  squares: Square[][];
  gameStatus: 'Won' | 'Lost' | 'OnGoing';
  gameStartedAt: Date;
};

export const boardSlice = createSlice<
  BoardState,
  SliceCaseReducers<BoardState>,
  'board'
>({
  name: 'board',
  initialState: {
    squares: initializeBoard(),
    gameStatus: 'OnGoing',
    gameStartedAt: new Date(),
  },
  reducers: {
    StartBoard: (state) => {
      state.squares = initializeBoard();
      state.gameStatus = 'OnGoing';
      state.gameStartedAt = new Date();
    },
    ClickSquare: (state, { payload }: ClickSquareAction) => {
      const square = state.squares[payload.squareY][payload.squareX];
      if (square.state !== 'hidden') return;

      square.state = square.hasBomb ? 'exploded' : 'revealed';
      state.squares[payload.squareY][payload.squareX] = square;

      if (square.state === 'exploded') {
        revealAllSquares(state);
        state.gameStatus = 'Lost';
        return;
      }

      if (square.value === 0) {
        const squaresToBeRevealed = getSquaresThatShouldBeRevealed(
          square,
          state.squares,
        );
        for (const s of squaresToBeRevealed) {
          state.squares[s.squareY][s.squareX].state = 'revealed';
          state.squares[s.squareY][s.squareX].hasFlag = false;
        }
      }

      const allNonBombSquaresWereRevealed = state.squares
        .flat()
        .filter((it) => !it.hasBomb)
        .every((it) => it.state === 'revealed');
      if (allNonBombSquaresWereRevealed) {
        state.gameStatus = 'Won';
      }
    },
    ToogleFlagOnSquare: (state, { payload }: ToogleFlagOnSquareAction) => {
      const [x, y] = [payload.squareX, payload.squareY];
      state.squares[y][x].hasFlag = !state.squares[y][x].hasFlag;
    },
  },
});

export const { StartBoard, ClickSquare, RevealAllSquares, ToogleFlagOnSquare } =
  boardSlice.actions;

export default boardSlice.reducer;

function getSquaresThatShouldBeRevealed(
  square: Square,
  board: Square[][],
  currentList: Square[] = [],
): Square[] {
  const alreadyAddedOnList = currentList.find(
    (e) => e.squareX === square.squareX && e.squareY === square.squareY,
  );
  if (!alreadyAddedOnList) {
    currentList.push(square);
  }

  if (square.value && square.value > 0) return currentList;

  const squaresAround: Square[] = getSquaresAroundSquare(square, board);

  squaresAround
    .filter((e) => {
      const isOnTheList = currentList.find(
        (it) => it.squareX === e.squareX && it.squareY === e.squareY,
      );
      return !isOnTheList;
    })
    .forEach((it) => {
      getSquaresThatShouldBeRevealed(it, board, currentList);
    });

  return currentList;
}

function revealAllSquares(state: BoardState): void {
  state.squares.forEach((row) =>
    row.forEach((item) => {
      if (item.state === 'hidden') {
        item.state = 'revealed';
        item.hasFlag = false;
      }
    }),
  );
}
