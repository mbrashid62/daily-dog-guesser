import { CSSProperties, SyntheticEvent } from "react";

import "./Button.css";

type ButtonProps = {
  label: string;
  onClick: (arg0: SyntheticEvent<HTMLButtonElement>) => void;
  margin?: CSSProperties["margin"]; // Type-safe margin, can be string or number
  padding?: CSSProperties["padding"]; // Type-safe padding, can be string or number
};

export const Button = ({ label, onClick, ...rest }: ButtonProps) => {
  return (
    <button style={{ ...rest }} onClick={onClick}>
      {label}
    </button>
  );
};
