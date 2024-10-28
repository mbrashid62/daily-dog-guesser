import { CSSProperties, SyntheticEvent, useState, useRef } from "react";

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
  const timeoutRef = useRef<number | null>(null);

  const handleClick = (e: SyntheticEvent<HTMLButtonElement>) => {
    if (timeoutRef.current) {
      // Clear the timeout if a double click occurs
      clearTimeout(timeoutRef.current);

      timeoutRef.current = null;
    } else {
      // Set a timeout to trigger the single-click action
      const timeoutId = window.setTimeout(() => {
        onClick(e);

        timeoutRef.current = null;
      }, 300);

      timeoutRef.current = timeoutId;
    }
  };

  const handleDoubleClick = (e: SyntheticEvent<HTMLButtonElement>) => {
    if (timeoutRef.current) {
      // Prevent the single-click action
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = null;

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
