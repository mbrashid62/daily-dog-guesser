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

  const { correctGuesses, streak, remaining } = useContext(MetricsContext);
  const { auth } = useContext(GoogleContext);

  useEffect(() => {
    async function updateScoresIfNeeded() {
      if (!auth.currentUser?.uid) {
        return;
      }

      const userId = auth.currentUser.uid;
      const userDoc = await fetchUserDoc(userId);

      if (!userDoc) {
        // If nothing is saved and the user has answered at least one dog successfully, save it
        if (correctGuesses >= 1) {
          saveUserScore(userId, {
            user: {
              displayName: auth.currentUser.displayName,
              photoURL: auth.currentUser.photoURL,
            },
            metrics: {
              correctGuesses,
              streak,
              remaining,
            },
            version: "1.0.0",
          });

          setSavedLeaderBoardEntry({
            user: {
              displayName: auth.currentUser.displayName,
              photoURL: auth.currentUser.photoURL,
            },
            metrics: {
              correctGuesses,
              streak,
              remaining,
            },
            version: "1.0.0",
          });

          // Show success toast
          showToast("New high score saved!", "success");
        }
        return;
      }

      const {
        correctGuesses: savedCorrectGuesses,
        streak: savedStreak,
        remaining: savedRemaining,
      } = userDoc.metrics;

      setSavedLeaderBoardEntry(userDoc);

      let hasNewHighScore = false;
      const updatedMetrics: LeaderBoardEntry["metrics"] = {
        correctGuesses: savedCorrectGuesses,
        streak: savedStreak,
        remaining: savedRemaining,
      };

      // Compare local scores with saved scores, updating if needed
      if (correctGuesses > savedCorrectGuesses) {
        updatedMetrics.correctGuesses = correctGuesses;
        hasNewHighScore = true;
      }

      if (streak > savedStreak) {
        updatedMetrics.streak = streak;
        hasNewHighScore = true;
      }

      if (hasNewHighScore) {
        // Save the new high score
        await saveUserScore(userId, {
          user: {
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
          },
          metrics: updatedMetrics,
          version: "1.0.0",
        });

        setSavedLeaderBoardEntry({
          user: {
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
          },
          metrics: updatedMetrics,
          version: "1.0.0",
        });

        // Show success toast
        showToast("New high score saved!", "success");
      }
    }

    updateScoresIfNeeded();
  }, [
    correctGuesses,
    streak,
    fetchUserDoc,
    saveUserScore,
    remaining,
    showToast,
  ]); // Runs whenever scores or user changes

  if (!savedLeaderBoardEntry) {
    return null;
  }

  return (
    <h3 className="high-scores">
      <span>({savedLeaderBoardEntry.metrics.correctGuesses} 🐕)</span>
      <span>({savedLeaderBoardEntry.metrics.streak} ⚡)</span>
    </h3>
  );
};
