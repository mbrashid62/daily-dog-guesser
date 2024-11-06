import "./Metrics";

export type MetricsProps = {
  streak: number;
  remaining: number;
  correctGuesses: number;
};

export const Metrics = ({
  correctGuesses,
  remaining,
  streak,
}: MetricsProps) => {
  if (correctGuesses === 0) {
    return null;
  }

  return (
    <div className="metrics-container">
      <span>
        {" "}
        You correctly named <b>{correctGuesses}</b>{" "}
        {correctGuesses === 1 ? "doggy" : "doggies"}. 🐕
      </span>
      <span style={{ paddingTop: 8, paddingBottom: 8 }}>
        Can you name the remaining <b>{remaining}</b>? ❓
      </span>
      {!!streak && (
        <span>
          Streak (<b>{streak}</b>) ⚡
        </span>
      )}
    </div>
  );
};
