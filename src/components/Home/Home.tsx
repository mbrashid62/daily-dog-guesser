import {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import { DOGGIES } from "../../constants";
import { getRandomInt } from "../../utils";
import { OptionGroup } from "../../components/OptionGroup/OptionGroup";
import { DogImage } from "../../components/DogImage/DogImage";
import { Button } from "../../toolbox/Button/Button";
import { Dog } from "../../global-types";
import { Confetti } from "../Animations/Confetti/Confetti";
import { Metrics } from "../Cards/Metrics";

type MetricsData = {
  correctGuesses: number;
  remaining: number;
  streak: number;
};

export const MetricsContext = createContext<MetricsData>({
  correctGuesses: 0,
  remaining: 0,
  streak: 0,
});

type HomeProps = {
  setIsSideBarOpen: Dispatch<SetStateAction<boolean>>;
};

export const Home = ({ setIsSideBarOpen }: HomeProps) => {
  const [dogsRemaining, setDogsRemaining] = useState<Dog[]>(DOGGIES);
  const [successCount, setSuccessCount] = useState<number>(0);

  const [randomInt, setRandomInt] = useState<number>(
    getRandomInt(0, dogsRemaining.length - 1),
  );

  const [streak, setStreak] = useState<number>(0);

  const activeDog = dogsRemaining[randomInt];

  const resetGame = () => {
    setDogsRemaining(DOGGIES);
    setSuccessCount(0);
    setStreak(0);
  };

  const metrics = useMemo(
    () => ({
      correctGuesses: successCount,
      remaining: dogsRemaining.length,
      streak,
      powerups: 3,
    }),
    [successCount, dogsRemaining.length, streak],
  );

  if (dogsRemaining.length === 0) {
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
            <Button onClick={resetGame} label="Play again" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <MetricsContext.Provider value={metrics}>
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

            const dogsRemainingFiltered = dogsRemaining.filter(
              ({ key }) => key !== dog.key,
            );

            setDogsRemaining(dogsRemainingFiltered);

            setSuccessCount((count) => count + 1);

            setRandomInt((previousInt) => {
              if (dogsRemainingFiltered.length === 1) {
                return 0;
              }

              if (dogsRemainingFiltered.length === 0) {
                return 1;
              }

              let newInt = previousInt;

              // Keep generating a new random integer until it's different from the previous one
              while (newInt === previousInt) {
                newInt = getRandomInt(0, dogsRemainingFiltered.length);
              }

              return newInt;
            });
          }}
        />
      </div>
      <div className="middle-container">
        <Metrics />
      </div>
    </MetricsContext.Provider>
  );
};
