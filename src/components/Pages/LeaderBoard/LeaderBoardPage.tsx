import { useEffect, useState } from "react";

import "./LeaderBoard.css";
import { Flex } from "../../../toolbox/Flex/Flex";
import {
  LeaderBoardEntry,
  useFirestore,
} from "../../Firestore/FirestoreProvider";

const formatName = (fullName: string | null): string => {
  if (fullName === null) {
    return "--";
  }

  const nameParts = fullName.trim().split(" ");

  if (nameParts.length < 2) {
    return fullName; // Return as-is if there's no last name
  }

  const [firstName, lastName] = nameParts;
  return `${firstName} ${lastName.charAt(0)}.`;
};

export const LeaderBoardPage = () => {
  const { fetchLeaderBoard } = useFirestore();

  const [leaderBoardType, setLeaderBoardType] = useState<
    "correctGuesses" | "streak"
  >("correctGuesses");

  const [leaderBoardData, setLeaderBoardData] = useState<LeaderBoardEntry[]>(
    [],
  );

  // Fetch leaderboard data when leaderboardType changes
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLeaderBoard(leaderBoardType);
      setLeaderBoardData(data || []);
    };

    fetchData();
  }, [leaderBoardType, fetchLeaderBoard]);

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>

      {/* Toggle Buttons for Leaderboard Type */}
      <div className="leaderboard-copy-container">
        <p>
          Use the buttons to toggle between total correct guesses and streaks.
          You can view the top 10 for each category.
        </p>
      </div>
      <div className="leaderboard-type-toggle-container">
        <button onClick={() => setLeaderBoardType("correctGuesses")}>
          Best guesses
        </button>
        <button onClick={() => setLeaderBoardType("streak")}>
          Best streaks
        </button>
      </div>

      <div>
        <h3>
          {leaderBoardType === "correctGuesses"
            ? "Top 10 Guessers"
            : "Top 10 Streakers"}
        </h3>
        <span>
          {leaderBoardType === "correctGuesses"
            ? "These people know their dogs."
            : "These folks didn't miss a beat."}
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th style={{ textAlign: "left" }}>User</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderBoardData.length > 0 ? (
            leaderBoardData.map((entry, index) => (
              <tr key={index} className="text-center">
                <td>{index + 1}</td>
                <td>
                  <Flex alignItems="center">
                    {entry.user.photoURL && (
                      <img
                        className="profile-photo"
                        src={entry.user.photoURL}
                      />
                    )}
                    {formatName(entry.user.displayName)}
                  </Flex>
                </td>
                <td>
                  {leaderBoardType === "correctGuesses"
                    ? entry.metrics.correctGuesses
                    : entry.metrics.streak}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
