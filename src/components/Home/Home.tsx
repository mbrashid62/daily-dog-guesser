import { useState } from "react";

import { DOGGIES } from "../../constants";
import { getRandomInt } from "../../utils";
import { OptionGroup } from "../../components/OptionGroup/OptionGroup";
import { Flex } from "../../toolbox/Flex/Flex";
import { Modal } from "../../toolbox/Modal/Modal";
import { DogImage } from "../../components/DogImage/DogImage";
import { Button } from "../../toolbox/Button/Button";
import { Dog } from "../../global-types";
import { Confetti } from "../Animations/Confetti/Confetti";
import { Metrics } from "../Cards/Metrics";

export const Home = () => {
  const [dogsRemaining, setDogsRemaining] = useState<Dog[]>(DOGGIES);
  const [successCount, setSuccessCount] = useState(0);

  const [randomInt, setRandomInt] = useState(
    getRandomInt(0, dogsRemaining.length - 1),
  );

  const activeDog = dogsRemaining[randomInt];

  const [streak, setStreak] = useState(0);

  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const resetGame = () => {
    setDogsRemaining(DOGGIES);
    setSuccessCount(0);
    setStreak(0);
    setShowResetConfirmation(false);
  };

  if (dogsRemaining.length === 0) {
    return (
      <Confetti>
        <h1>Congratulations!</h1>
        <h3 style={{ paddingBottom: 16 }}>
          Wow, you named all {DOGGIES.length} doggies. That's impressive!
        </h3>
        <Button onClick={resetGame} label="Play again" />
      </Confetti>
    );
  }

  return (
    <div>
      <h1>Can you name this dog?</h1>
      <div style={{ marginBottom: 32 }}>
        <DogImage size="xlarge" dog={activeDog} />
      </div>
      <OptionGroup
        activeDog={activeDog}
        metrics={{
          correctGuesses: successCount,
          streak,
          remaining: dogsRemaining.length,
        }}
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
      <div>
        {!!successCount && (
          <Flex flexDirection="column" margin="32px 0 0 0">
            <Metrics
              correctGuesses={successCount}
              remaining={dogsRemaining.length}
              streak={streak}
            />
            <div style={{ marginTop: 32 }}>
              <Button
                onClick={() => setShowResetConfirmation(true)}
                label="Reset your score"
              />
              <Modal
                isOpen={showResetConfirmation}
                onClose={() => setShowResetConfirmation(false)}
              >
                <p style={{ paddingBottom: 24 }}>
                  Are you sure? You will lose your streak too.
                </p>
                <Button
                  onClick={() => setShowResetConfirmation(false)}
                  label="Nevermind"
                />
                <Button
                  label="Yes, reset"
                  margin="0 0 0 16px"
                  onClick={resetGame}
                />
              </Modal>
            </div>
          </Flex>
        )}
      </div>
    </div>
  );
};
