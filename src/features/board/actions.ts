import { PayloadAction } from '@reduxjs/toolkit';

export type Square = {
  state: 'hidden' | 'exploded' | 'revealed';
  hasBomb: boolean;
  hasFlag: boolean;
  value?: number;
  squareX: number;
  squareY: number;
};

export type StartBoardAction = PayloadAction<{
  squares: Square[][];
}>;

export type ClickSquareAction = PayloadAction<{
  squareX: number;
  squareY: number;
}>;

export type ToogleFlagOnSquareAction = ClickSquareAction;
