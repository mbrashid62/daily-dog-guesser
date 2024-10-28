import { useEffect, useState } from "react";
import { DOGGIES } from "../../constants";
import "./YouWon.css"; // Import the CSS from above
import { Button } from "../../toolbox/Button/Button";

type YouWonProps = {
  resetGame: () => void;
};

export const YouWon = ({ resetGame }: YouWonProps) => {
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
    <div className="confett-container">
      {confettiElements}
      <h1>Congratluations!</h1>
      <h3 style={{ paddingBottom: 16 }}>
        Wow, you named all {DOGGIES.length} doggies. That's impressive!
      </h3>
      <Button onClick={resetGame} label="Play Again" />
    </div>
  );
};
