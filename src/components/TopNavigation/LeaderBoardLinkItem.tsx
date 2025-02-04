import { Link } from "react-router-dom";

export const LeaderBoardLinkItem: React.FC<{ showLeaderBoard: boolean }> = ({
  showLeaderBoard,
}) => {
  if (!showLeaderBoard) {
    return null;
  }

  return (
    <Link className="top-nav-link fourth-color" to="/leaderboard">
      Leaderboard
    </Link>
  );
};
