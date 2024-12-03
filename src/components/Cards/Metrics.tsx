import { useContext } from "react";
import "./Metrics";
import { MetricsContext } from "../Home/Home";
import { DOGGIES } from "../../constants";

export const Metrics = () => {
  const {
    correctGuesses = 0,
    remaining = DOGGIES.length,
    streak = 0,
  } = useContext(MetricsContext) || {};

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
