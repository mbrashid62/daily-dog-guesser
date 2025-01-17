import { useContext, useEffect } from "react";
import { MetricsContext } from "../Pages/Home/HomePage";
import { DOGGIES } from "../../constants";
import { GoogleContext } from "../../App";
import { useToast } from "../Toast/ToastProvider";
import { useFirestore } from "../../FireStoreProvider";

export const Metrics = () => {
  const {
    correctGuesses = 0,
    remaining = DOGGIES.length,
    streak = 0,
  } = useContext(MetricsContext) || {};

  const { auth } = useContext(GoogleContext);
  const { getMetrics, saveMetrics } = useFirestore();
  const { showToast } = useToast();

  useEffect(() => {
    const loadMetrics = async () => {
      if (!auth.currentUser) {
        return;
      }

      try {
        const metrics = await getMetrics(auth.currentUser.uid);

        if (metrics) {
          console.log("Loaded metrics:", metrics);
        } else {
          console.log("No metrics found for this user.");
        }
      } catch (error) {
        console.error("Error loading metrics:", error);
      }
    };

    loadMetrics();
  }, [auth.currentUser, getMetrics]);

  if (correctGuesses === 0) {
    return null;
  }

  const handleSave = async () => {
    if (!auth.currentUser) {
      return;
    }
    try {
      await saveMetrics(auth.currentUser.uid, {
        correctGuesses,
        streak,
        remaining,
      });

      showToast("Metrics saved successfully!", "success");
    } catch (error) {
      console.error("Error saving metrics:", error);

      showToast(`Error saving metrics. Please try again.`, "error");
    }
  };

  return (
    <div className="metrics-container">
      <span>
        You correctly named <b>{correctGuesses}</b>{" "}
        {correctGuesses === 1 ? "doggy" : "doggies"}. 🐕
      </span>
      <span style={{ paddingTop: 8, paddingBottom: 8 }}>
        Can you name the remaining <b>{remaining}</b>? ❓
      </span>
      <button onClick={handleSave}>Save Data</button>
      {!!streak && (
        <span>
          Streak (<b>{streak}</b>) ⚡
        </span>
      )}
    </div>
  );
};
