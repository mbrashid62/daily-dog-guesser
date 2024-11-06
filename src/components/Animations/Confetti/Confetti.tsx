import { useEffect, useState } from "react";
import "./Confetti.css";

type ConfettiProps = {
  children?: React.ReactNode;
};

export const Confetti = ({ children }: ConfettiProps) => {
  const [confettiElements, setConfettiElements] = useState<React.ReactNode[]>(
    [],
  );

  useEffect(() => {
    const confettiCount = 100; // Number of confetti pieces
    const confettiArr = Array.from({ length: confettiCount }, (_, i) => (
      <div
        key={i}
        className="confetti"
        style={{
          left: `${Math.random() * 95}vw`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        }}
      />
    ));
    setConfettiElements(confettiArr);
  }, []);

  return (
    <div className="confetti-container">
      {confettiElements}
      {!!children && children}
    </div>
  );
};
