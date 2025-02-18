import { useMetrics } from "../Metrics/MetricsProvider";

export const ActiveScore = () => {
  const { metrics } = useMetrics();
  const { correctGuesses, remaining, streak } = metrics;

  if (correctGuesses === 0) {
    return null;
  }

  return (
    <>
      <div className="metrics-container">
        <span>
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
    </>
  );
};
