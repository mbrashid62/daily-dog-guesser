import { CSSProperties, SyntheticEvent, useState } from "react";

import "./Button.css";

type ButtonProps = {
  className?: string;
  label: string;
  onClick: (arg0: SyntheticEvent<HTMLButtonElement>) => void;
  onDoubleClick?: (arg0: SyntheticEvent<HTMLButtonElement>) => void;
  margin?: CSSProperties["margin"];
  padding?: CSSProperties["padding"];
};

export const Button = ({
  label,
  onDoubleClick,
  onClick,
  ...rest
}: ButtonProps) => {
  const [clickTimeout, setClickTimeout] = useState<number | null>(null);

  const handleClick = (e: SyntheticEvent<HTMLButtonElement>) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout); // Clear the timeout if a double click occurs
      setClickTimeout(null);
    } else {
      // Set a timeout to trigger the single-click action
      const timeoutId = window.setTimeout(() => {
        onClick(e);
        setClickTimeout(null);
      }, 300); // 300ms delay to differentiate single and double click
      setClickTimeout(timeoutId);
    }
  };

  const handleDoubleClick = (e: SyntheticEvent<HTMLButtonElement>) => {
    clearTimeout(clickTimeout!); // Prevent the single-click action
    setClickTimeout(null);
    if (onDoubleClick) {
      onDoubleClick(e);
    }
  };

  return (
    <button
      style={{ ...rest }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {label}
    </button>
  );
};
