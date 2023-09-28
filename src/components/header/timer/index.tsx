import './style.css';

export default function Timer(props: { time: number }): JSX.Element {
  return (
    <div className="timer-container">
      <span className="digits">
        {('0' + Math.floor((props.time / 60000) % 60)).slice(-2)}:
      </span>

      <span className="digits">
        {('0' + Math.floor((props.time / 1000) % 60)).slice(-2)}
      </span>
    </div>
  );
}
