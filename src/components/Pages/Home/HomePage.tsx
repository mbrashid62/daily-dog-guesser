import { createContext } from "react";

import { DOGGIES } from "../../../constants";
import { OptionGroup } from "../../OptionGroup/OptionGroup";
import { DogImage } from "../../DogImage/DogImage";
import { Confetti } from "../../Animations/Confetti/Confetti";
import { ActiveScore } from "../../Cards/ActiveScore";
import { useMetrics } from "../../Metrics/MetricsProvider";

export type MetricsAppData = {
  correctGuesses: number;
  remaining: number;
  streak: number;
};

export const MetricsContext = createContext<MetricsAppData>({
  correctGuesses: 0,
  remaining: 0,
  streak: 0,
});

export const HomePage = () => {
  const {
    activeDog,
    metrics,

    setDogsRemaining,
    setSuccessCount,
    setStreak,
  } = useMetrics();
  const { remaining } = metrics;

  if (remaining === 0) {
    return (
      <div style={{ padding: "16px 32px" }}>
        <Confetti />
        <div className="top-container">
          <h1>Congratulations!</h1>
          <h3 style={{ paddingBottom: 16 }}>
            Wow, you named all {DOGGIES.length} doggies. That's impressive!
          </h3>
        </div>
        <div className="middle-container">
          <div className="play-again-container">
            <span>Refresh the page to play again</span>
          </div>
        </div>
      </div>
    );
  }

  if (!activeDog) {
    // There should always be an activeDog until the game is finished which is handled by separate render path upstream.
    // If this happens, there is a flaw in the metrics logic.
    throw new Error("Uh oh! An unexpected error occurred");
  }

  return (
    <div>
      <div className="top-container">
        <h1 className="title">Can you name this dog?</h1>
        <div className="dog-img-container">
          <DogImage size="xlarge" dog={activeDog} />
        </div>
        <OptionGroup
          activeDog={activeDog}
          onWrongAnswer={() => setStreak(0)}
          onCorrectAnswer={(dog) => {
            setStreak((s) => s + 1);

            setDogsRemaining((dogsRemaining) => {
              return dogsRemaining.filter(({ key }) => key !== dog.key);
            });

            setSuccessCount((count) => count + 1);
          }}
        />
      </div>
      <div className="middle-container">
        <ActiveScore />
      </div>
    </div>
  );
};
