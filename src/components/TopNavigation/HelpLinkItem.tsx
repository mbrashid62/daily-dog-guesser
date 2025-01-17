import { Dispatch, SetStateAction } from "react";
import { HelpModal } from "../HelpModal/HelpModal";

export const HelpLinkItem: React.FC<{
  showHelpState: [boolean, Dispatch<SetStateAction<boolean>>];
}> = ({ showHelpState }) => {
  const [showHelp, setShowHelp] = showHelpState;

  return (
    <div style={{ display: "inline-flex" }}>
      <img
        alt="Help Icon"
        src="/question.png"
        onClick={() => setShowHelp(true)}
        style={{ width: 20, height: 20, cursor: "pointer" }}
      />
      <HelpModal showHelp={showHelp} setShowHelp={setShowHelp} />
    </div>
  );
};
