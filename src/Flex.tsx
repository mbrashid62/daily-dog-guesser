import { ReactNode, CSSProperties } from "react";

type FlexProps = {
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";

  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";

  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";

  margin?: CSSProperties["margin"]; // Type-safe margin, can be string or number
  padding?: CSSProperties["padding"]; // Type-safe padding, can be string or number

  children: ReactNode;
};

export const Flex = ({
  justifyContent = "flex-start", // Default: start alignment
  alignItems = "stretch", // Default: full stretch
  flexDirection = "row", // Default: horizontal layout
  margin = 0, // Default: no margin
  padding = 0, // Default: no padding
  children,
}: FlexProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent,
        alignItems,
        flexDirection,
        margin,
        padding,
      }}
    >
      {children}
    </div>
  );
};
