import { Dispatch, SetStateAction } from "react";

import { Modal } from "../../toolbox/Modal/Modal";
import { Dog } from "../../global-types";
import { getRandomInt, isFirstCharVowel, kebabToTitleCase } from "../../utils";
import { Flex } from "../../toolbox/Flex/Flex";
import { Button } from "../../toolbox/Button/Button";
import { DogImage } from "../DogImage/DogImage";
import { MetricsProps } from "../Cards/Metrics";
import { Confetti } from "../Animations/Confetti/Confetti";

type CorrectAnswerModalProps = {
  errorCopy: string;
  metrics: MetricsProps;
  modalState: [boolean, Dispatch<SetStateAction<boolean>>];
  selectedDog: Dog | null;
};

const getRandomCelebrationCopy = (input: {
  number: number;
  type: "guesses" | "streak";
}): string => {
  const { number, type } = input;

  if (type === "guesses") {
    const GUESSES = [
      `Holy cow ${number} dogs!`,
      `You named ${number} dogs. Nice Work!`,
      `Achievement unlocked. ${number} dogs!`,
      `Wow ${number} dogs! Can you get to ${number + 5}?`,
      `Way to go! You named ${number} dogs!`,
      `${number} dogs! You're an expert!`,
    ];

    const randomInt = getRandomInt(0, GUESSES.length - 1);

    return `${GUESSES[randomInt]} 🐕`;
  }

  const STREAKS = [
    `${number} dogs in a row. Nice job!`,
    `You're on fire! You named ${number} dogs in a row.`,
    `${number} dogs! That's an impressive streak!`,
    `${number} dogs in row! Can you get to ${number + 5}?`,
    `Way to go! You named ${number} dogs in a row!`,
    `${number} dogs without missing a beat! You're an expert!`,
  ];

  const randomInt = getRandomInt(0, STREAKS.length - 1);

  return `${STREAKS[randomInt]} ⚡`;
};

export const CorrectAnswerModal = ({
  errorCopy,
  selectedDog,
  metrics,
  modalState,
}: CorrectAnswerModalProps) => {
  const [showCorrectAnswerModal, setShowCorrectAnswerModal] = modalState;

  const { correctGuesses, streak } = metrics;

  const showGuessesCelebration = Boolean(
    correctGuesses > 0 && correctGuesses % 5 === 0,
  );
  const showStreakCelebration = Boolean(streak > 0 && streak % 5 === 0);

  const handleClose = () => {
    setShowCorrectAnswerModal(false);
  };

  const showCelebration = Boolean(
    showGuessesCelebration || showStreakCelebration,
  );

  return (
    <Modal isOpen={showCorrectAnswerModal} onClose={handleClose}>
      {selectedDog ? (
        <Flex flexDirection="column" alignItems="center">
          <DogImage size="large" dog={selectedDog} />

          {showCelebration && (
            <Confetti>
              <span />
            </Confetti>
          )}

          {showCelebration && (
            <h3>
              {getRandomCelebrationCopy(
                showGuessesCelebration
                  ? {
                      number: correctGuesses,
                      type: "guesses",
                    }
                  : {
                      number: streak,
                      type: "streak",
                    },
              )}
            </h3>
          )}
          <p>
            {`You are right, that dog is ${isFirstCharVowel(selectedDog?.key || "") ? "an" : "a"} `}
            <b>{kebabToTitleCase(selectedDog.key)}</b>!
          </p>
          <p>{selectedDog.info.bio}</p>
          <p style={{ paddingBottom: 24 }}>
            Click{" "}
            <b>
              <a
                className="third-color"
                href={selectedDog.info.wikipediaUrl}
                target="_blank"
              >
                here
              </a>
            </b>{" "}
            to learn more.
          </p>
          <Flex justifyContent="center">
            <Button onClick={handleClose} label="Guess another" />
          </Flex>
        </Flex>
      ) : (
        <p>{errorCopy}</p>
      )}
    </Modal>
  );
};
