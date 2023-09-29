/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useState } from 'react';
import { StartBoard } from '../../features/board/board-slice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import './style.css';
import Timer from './timer';

function Header(): JSX.Element {
  const { squares, gameStatus, gameStartedAt } = useAppSelector(
    (state) => state.board,
  );
  const dispatch = useAppDispatch();

  const squaresWithBomb = squares.flat().filter((it) => it.hasBomb);
  const squaresWithFlag = squares.flat().filter((it) => it.hasFlag);

  const [time, setTime] = useState<number>(0);
  const [lastGameStatus, setLastGameStatus] = useState<string>('Start');

  useEffect(() => {
    let interval: NodeJS.Timer;

    setLastGameStatus(gameStatus);
    if (gameStatus === 'Start') setTime(0);

    if (gameStatus === 'OnGoing') {
      interval = setInterval(() => {
        setTime((t) => t + 1000);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [gameStartedAt, gameStatus]);

  return (
    <div className="header-container">
      <div className="missing-bombs-counter-container">
        <div>
          {squaresWithBomb.length - squaresWithFlag.length > 0
            ? squaresWithBomb.length - squaresWithFlag.length
            : 0}
        </div>
      </div>
      <div>
        <div
          className="reset-game-logo-container selectable"
          onClick={() => {
            dispatch(StartBoard({}));
          }}
        >
          {gameStatus === 'Start' && '😑'}
          {gameStatus === 'OnGoing' && '😊'}
          {gameStatus === 'Lost' && '😭'}
          {gameStatus === 'Won' && '😁'}
        </div>
      </div>
      <div>
        <Timer time={time} />
      </div>
    </div>
  );
}

export default Header;
