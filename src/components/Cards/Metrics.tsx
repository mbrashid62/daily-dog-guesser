import { useContext, useEffect, useState } from "react";
import "./Metrics";
import { MetricsContext } from "../Home/Home";
import { DOGGIES } from "../../constants";

const LS_KEY = "doggy-game-metrics";

type SavedMetrics = {
  correctGuesses: number;
  streak: number;
};

function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}

export const Metrics = () => {
  const {
    correctGuesses = 0,
    remaining = DOGGIES.length,
    streak = 0,
  } = useContext(MetricsContext) || {};

  const [savedMetrics, setSavedMetrics] = useLocalStorage<SavedMetrics>(
    LS_KEY,
    {
      correctGuesses: 0,
      streak: 0,
    },
  );

  useEffect(() => {
    if (!savedMetrics) {
      return;
    }

    // if there's a new high streak, save it in LS!
    if (streak > savedMetrics.streak) {
      setSavedMetrics({
        ...savedMetrics,
        streak,
      });
    }

    // if there's a new high streak, save it in LS!
    if (correctGuesses > savedMetrics.correctGuesses) {
      setSavedMetrics({
        ...savedMetrics,
        correctGuesses,
      });
    }
  }, [correctGuesses, streak, savedMetrics, setSavedMetrics]);

  if (correctGuesses === 0) {
    console.log("savedMetrics --> ", savedMetrics);
    if (
      !savedMetrics ||
      (savedMetrics.correctGuesses === 0 && savedMetrics.streak === 0)
    ) {
      return null;
    }

    return (
      <div className="metrics-container">
        <h2>Welcome back!</h2>
        <h3>Last time you named</h3>
        <span style={{ paddingTop: 8, paddingBottom: 8 }}>
          A total of <b>({savedMetrics.correctGuesses})</b> doggies. 🐕
        </span>
        <span>
          And your best streak was (<b>{savedMetrics.streak}</b>). ⚡
        </span>
      </div>
    );
  }

  return (
    <div className="metrics-container">
      {correctGuesses === savedMetrics.correctGuesses ? (
        <span>
          You correctly named <b>{correctGuesses}</b>{" "}
          {correctGuesses === 1 ? "doggy" : "doggies"} 🐕 <b>New High Score!</b>
        </span>
      ) : (
        <span>
          You correctly named <b>{correctGuesses}</b>{" "}
          {correctGuesses === 1 ? "doggy" : "doggies"}. The most you've ever
          answered is <b>{savedMetrics.correctGuesses}</b> 🐕
        </span>
      )}

      {streak === savedMetrics.streak ? (
        <span style={{ paddingTop: 8, paddingBottom: 8 }}>
          Your active Streak is <b>{streak}</b> ⚡ <b>New High Score!</b>
        </span>
      ) : (
        <span style={{ paddingTop: 8, paddingBottom: 8 }}>
          Your current Streak is <b>{streak}</b> ⚡ Your highest Streak is{" "}
          <b>{savedMetrics.streak}</b>
        </span>
      )}
      <span>
        Can you name the remaining <b>{remaining}</b>? ❓
      </span>
    </div>
  );
};
