import { Link } from "react-router-dom";

export const GoBackNavLinkItem: React.FC<{ showBack: boolean }> = ({
  showBack,
}) => {
  if (!showBack) return null;

  return (
    <Link className="go-back-link top-nav-link fourth-color" to="/">
      <img
        src="/back-arrow.png"
        style={{ width: 20, height: 20, paddingRight: 16 }}
        alt="Go Back"
      />
      Back
    </Link>
  );
};
