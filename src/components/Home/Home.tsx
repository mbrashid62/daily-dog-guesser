import { useState } from "react";

import { DOGGIES } from "../../constants";
import { getRandomInt } from "../../utils";
import { OptionGroup } from "../../components/OptionGroup/OptionGroup";
import { Flex } from "../../toolbox/Flex/Flex";
import { Modal } from "../../toolbox/Modal/Modal";
import { DogImage } from "../../components/DogImage/DogImage";
import { Button } from "../../toolbox/Button/Button";

export const Home = () => {
  const [successCount, setSuccessCount] = useState(0);

  const [randomInt, setRandomInt] = useState(
    getRandomInt(0, DOGGIES.length - 1),
  );

  const activeDog = DOGGIES[randomInt];

  const [streak, setStreak] = useState(0);

  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  return (
    <div>
      <h1>Can you name this dog?</h1>
      <div style={{ marginBottom: 32 }}>
        <DogImage size="large" dog={activeDog} />
      </div>
      <OptionGroup
        activeDog={activeDog}
        totalOptions={4}
        setStreak={setStreak}
        onCorrectAnswer={() => {
          setSuccessCount((count) => count + 1);
          setRandomInt((previousInt) => {
            let newInt = previousInt;

            // Keep generating a new random integer until it's different from the previous one
            while (newInt === previousInt) {
              newInt = getRandomInt(0, DOGGIES.length - 1);
            }

            return newInt;
          });
        }}
      />
      <div>
        {!!successCount && (
          <Flex flexDirection="column" margin="32px 0 0 0">
            <span>
              {" "}
              You correctly named <b>{successCount}</b>{" "}
              {successCount === 1 ? "doggy" : "doggies"}.
            </span>
            {!!streak && (
              <span style={{ paddingTop: 8 }}>
                Streak (<b>{streak}</b>)
              </span>
            )}
            <div style={{ marginTop: 32 }}>
              <Button
                onClick={() => setShowResetConfirmation(true)}
                label="Reset your score"
              />
              <Modal
                isOpen={showResetConfirmation}
                onClose={() => setShowResetConfirmation(false)}
              >
                <p>Are you sure? You will lose your streak too.</p>
                <Button
                  onClick={() => setShowResetConfirmation(false)}
                  label="Nevermind"
                />
                <Button
                  label="Yes, Reset"
                  margin="0 0 0 16px"
                  onClick={() => {
                    setSuccessCount(0);
                    setStreak(0);
                    setShowResetConfirmation(false);
                  }}
                />
              </Modal>
            </div>
          </Flex>
        )}
      </div>
    </div>
  );
};
