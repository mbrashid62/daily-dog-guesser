import { Link } from "react-router-dom";

export const LeaderBoardLinkItem = () => {
  return (
    <Link
      className="top-nav-link fourth-color"
      to="/leaderboard"
      target="_blank"
    >
      Leaderboard
    </Link>
  );
};
