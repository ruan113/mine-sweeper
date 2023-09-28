import { Square } from '../features/board/actions';

export function initializeBoard(size = 13, bombQnt = 23): Square[][] {
  const board: string[][] = Array.from({ length: size }, () =>
    Array(size).fill(''),
  );

  for (let i = 0; i < bombQnt; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);

    if (board[x][y] === 'B') {
      i--;
    } else {
      board[x][y] = 'B';
    }
  }

  return board.map((row, y) =>
    row.map(
      (square, x): Square => ({
        state: 'hidden',
        hasBomb: square === 'B',
        hasFlag: false,
        squareX: x,
        squareY: y,
        value: getBombCountAroundSquare(x, y, board),
      }),
    ),
  );
}

function getBombCountAroundSquare(
  x: number,
  y: number,
  board: string[][],
): number {
  let count = 0;

  if ((board[y + 1] ?? [])[x + 1] === 'B') count++;
  if ((board[y] ?? [])[x + 1] === 'B') count++;
  if ((board[y - 1] ?? [])[x + 1] === 'B') count++;

  if ((board[y + 1] ?? [])[x] === 'B') count++;
  if ((board[y - 1] ?? [])[x] === 'B') count++;

  if ((board[y + 1] ?? [])[x - 1] === 'B') count++;
  if ((board[y] ?? [])[x - 1] === 'B') count++;
  if ((board[y - 1] ?? [])[x - 1] === 'B') count++;

  return count;
}

export function getSquaresAroundSquare(
  square: Square,
  squares: Square[][],
): Square[] {
  const [x, y] = [square.squareX, square.squareY];
  return [
    getSquare(x + 1, y + 1, squares),
    getSquare(x + 1, y, squares),
    getSquare(x + 1, y - 1, squares),
    getSquare(x, y + 1, squares),
    getSquare(x, y - 1, squares),
    getSquare(x - 1, y + 1, squares),
    getSquare(x - 1, y, squares),
    getSquare(x - 1, y - 1, squares),
  ].filter(Boolean) as Square[];
}

export function getSquare(
  x: number,
  y: number,
  board: Square[][],
): Square | undefined {
  return (board[y] ?? [])[x];
}

export function addSecondsToDate(
  secondsToAdd: number,
  date = new Date(),
): Date {
  const result = new Date(date);
  result.setSeconds(date.getSeconds() + secondsToAdd);
  return result;
}
