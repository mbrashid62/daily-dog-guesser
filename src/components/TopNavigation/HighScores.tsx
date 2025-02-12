import { useContext, useEffect, useState } from "react";
import { MetricsContext } from "../Pages/Home/HomePage";
import { LeaderBoardEntry, useFirestore } from "../Firestore/FirestoreProvider";
import { GoogleContext } from "../../App";
import { useToast } from "../Toast/ToastProvider";

import "./HighScores.css";

export const HighScores = () => {
  const { fetchUserDoc, saveUserScore } = useFirestore();
  const { showToast } = useToast();

  const [savedLeaderBoardEntry, setSavedLeaderBoardEntry] = useState<
    LeaderBoardEntry | undefined
  >();
  const [hasDismissedSignInCTA, setHasDismissedSignInCTA] = useState(false);

  const { correctGuesses, streak, remaining } = useContext(MetricsContext);
  const { auth } = useContext(GoogleContext);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const updateScoresIfNeeded = async () => {
      const userDoc = await fetchUserDoc(userId);

      // If no record exists and the user has at least one correct guess, create a new entry
      if (!userDoc && correctGuesses >= 1) {
        const newEntry: LeaderBoardEntry = {
          user: {
            displayName: auth.currentUser?.displayName || "Anonymous",
            photoURL: auth.currentUser?.photoURL || "",
          },
          metrics: { correctGuesses, streak, remaining },
          version: "1.0.0",
        };

        await saveUserScore(userId, newEntry);
        setSavedLeaderBoardEntry(newEntry);
        showToast("New high score saved!", "success");
        return;
      }

      // Prevent unnecessary updates if userDoc is still missing
      if (!userDoc) {
        return;
      }

      const { correctGuesses: savedCorrectGuesses, streak: savedStreak } =
        userDoc.metrics;

      setSavedLeaderBoardEntry(userDoc);

      let hasNewHighScore = false;
      const updatedMetrics = { ...userDoc.metrics };

      if (correctGuesses > savedCorrectGuesses) {
        updatedMetrics.correctGuesses = correctGuesses;
        hasNewHighScore = true;
      }

      if (streak > savedStreak) {
        updatedMetrics.streak = streak;
        hasNewHighScore = true;
      }

      if (hasNewHighScore) {
        const updatedEntry: LeaderBoardEntry = {
          user: {
            displayName: auth.currentUser?.displayName || "Anonymous",
            photoURL: auth.currentUser?.photoURL || "",
          },
          metrics: updatedMetrics,
          version: "1.0.0",
        };

        await saveUserScore(userId, updatedEntry);
        setSavedLeaderBoardEntry(updatedEntry);
        showToast("New high score saved!", "success");
      }
    };

    updateScoresIfNeeded();
  }, [
    userId,
    correctGuesses,
    streak,
    remaining,
    fetchUserDoc,
    saveUserScore,
    showToast,
  ]);

  if (!userId) {
    // 🔹 If user is not signed in AND has dismissed the sign-in message, show nothing.
    if (hasDismissedSignInCTA) {
      return null;
    }

    // 🔹 Otherwise, show the sign-in message.
    return (
      <h3 className="high-scores-empty">
        <span>Sign in to save your high score.</span>
        <div>
          <button
            className="high-scores-dismiss-button"
            onClick={() => setHasDismissedSignInCTA(true)}
          >
            Dismiss
          </button>
        </div>
      </h3>
    );
  }

  if (!savedLeaderBoardEntry) {
    return (
      <h3 className="high-scores-empty">
        <span>
          Welcome, {auth.currentUser.displayName}! Your high scores will appear
          here.
        </span>
      </h3>
    );
  }

  // 🔹 Render the leaderboard entry
  return (
    <h3 className="high-scores">
      <span>{savedLeaderBoardEntry.metrics.correctGuesses} 🐕</span>
      <span>{savedLeaderBoardEntry.metrics.streak} ⚡</span>
    </h3>
  );
};
