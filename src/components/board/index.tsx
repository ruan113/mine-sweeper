/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Square } from '../../features/board/actions';
import {
  ClickSquare,
  ToogleFlagOnSquare,
} from '../../features/board/board-slice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Header from '../header';
import './style.css';

function Board(): JSX.Element {
  const { squares } = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();

  const handleMouseUpOnSquare = (square: Square): void => {
    if (timeoutInstance) clearTimeout(timeoutInstance);
    if (square.hasFlag || square.state !== 'hidden') return;

    dispatch(ClickSquare({ squareX: square.squareX, squareY: square.squareY }));
  };

  const handleMouseDownOnSquare = (square: Square): void => {
    if (square.state !== 'hidden') return;
    if (timeoutInstance) clearTimeout(timeoutInstance);

    timeoutInstance = setTimeout(() => {
      dispatch(
        ToogleFlagOnSquare({
          squareX: square.squareX,
          squareY: square.squareY,
        }),
      );
    }, 500);
  };

  let timeoutInstance: NodeJS.Timeout;

  return (
    <div className="board-container">
      <Header></Header>
      <div className="board-field">
        {squares?.map((row, y) => (
          <div key={'row-' + y} className="row">
            {row.map((square, x) => (
              <div
                key={'square-' + x}
                className={getSquareClasses(square)}
                style={getSquareStyle(square)}
                onMouseDown={() => handleMouseDownOnSquare(square)}
                onMouseUp={() => handleMouseUpOnSquare(square)}
              >
                {square.state !== 'hidden' && (
                  <>
                    {' '}
                    {square.hasBomb
                      ? '💣'
                      : (square.value ?? 0) > 0
                      ? square.value
                      : ''}
                  </>
                )}
                {square.hasFlag && '🚩'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;

const valueColorMap: Record<number, string> = {
  1: '#0303d6',
  2: '#16a000',
  3: '#ec0404',
  4: '#7401e5',
  5: '#e58101',
  6: '#ff5733',
  7: '#008080',
  8: '#c71585',
  9: '#b41b49',
  10: '#1077ff',
};

function getSquareClasses(square: Square): string {
  const classes = ['cell', 'unselectable'];

  if (square.hasBomb) classes.push('hasBomb');
  if (square.state === 'exploded') classes.push('exploded');
  if (square.state === 'hidden') classes.push('not-revealed-cell');
  if (square.state === 'revealed') classes.push('revealed-cell');

  return classes.join(' ');
}

function getSquareStyle(square: Square): React.CSSProperties {
  return { color: valueColorMap[square?.value ?? 0], fontWeight: 'bold' };
}