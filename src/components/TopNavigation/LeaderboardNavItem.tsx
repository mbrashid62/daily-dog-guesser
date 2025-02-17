import { useContext, useEffect, useState } from "react";
import { Modal } from "../../toolbox/Modal/Modal";

import "./LeaderboardNavItem.css";
import { LeaderBoardEntry, useFirestore } from "../Firestore/FirestoreProvider";
import { GoogleContext } from "../../App";
import { MetricsContext } from "../Pages/Home/HomePage";
import { useToast } from "../Toast/ToastProvider";
import { Leaderboard } from "../Leaderboard/Leaderboard";

export const LeaderboardNavItem = () => {
  const [show, setShow] = useState<boolean>(false);
  const { fetchUserDoc, saveUserScore } = useFirestore();
  const { showToast } = useToast();

  const [savedLeaderboardEntry, setSavedLeaderboardEntry] = useState<
    LeaderBoardEntry | undefined
  >();

  const { correctGuesses, streak, remaining } = useContext(MetricsContext);
  const { auth } = useContext(GoogleContext);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      return;
    }

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
        setSavedLeaderboardEntry(newEntry);
        showToast("New high score saved!", "success");
        return;
      }

      // Prevent unnecessary updates if userDoc is still missing
      if (!userDoc) {
        return;
      }

      const { correctGuesses: savedCorrectGuesses, streak: savedStreak } =
        userDoc.metrics;

      setSavedLeaderboardEntry(userDoc);

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
        setSavedLeaderboardEntry(updatedEntry);
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

  return (
    <div className="leaderboard-nav-container">
      <span className="leaderboard-cta" onClick={() => setShow(true)}>
        Leaderboard
      </span>
      {savedLeaderboardEntry && (
        <span className="high-scores">
          <span>{savedLeaderboardEntry.metrics.correctGuesses} 🐕</span>{" "}
          <span>{savedLeaderboardEntry.metrics.streak} ⚡</span>
        </span>
      )}

      <Modal isOpen={show} onClose={() => setShow(false)}>
        <Leaderboard onClose={() => setShow(false)} />
      </Modal>
    </div>
  );
};
