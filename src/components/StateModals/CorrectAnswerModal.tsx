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

type GetRandomCelebrationCopyInput = {
  showGuessesCelebration: boolean;
  showStreakCelebration: boolean;
  metrics: MetricsProps;
};

const getRandomCelebrationCopy = (
  input: GetRandomCelebrationCopyInput,
): string | null => {
  const { showGuessesCelebration, showStreakCelebration, metrics } = input;

  const showCelebration = Boolean(
    showStreakCelebration || showGuessesCelebration,
  );

  if (!showCelebration) {
    return null;
  }

  if (showStreakCelebration) {
    const number = metrics.streak;

    const STREAKS = [
      `${number} dogs in a row. Nice job!`,
      `You're on fire! You named ${number} dogs in a row.`,
      `${number} dogs! That's an impressive streak!`,
      `${number} dogs in row! Can you get to ${number + 5}?`,
      `Way to go! You named ${number} dogs in a row!`,
      `${number} dogs without missing a beat! You're an expert!`,
    ];

    return `${STREAKS[getRandomInt(0, STREAKS.length - 1)]} ⚡`;
  }

  const number = metrics.correctGuesses;

  const GUESSES = [
    `Holy cow ${number} dogs!`,
    `You named ${number} dogs. Nice Work!`,
    `Achievement unlocked. ${number} dogs!`,
    `Wow ${number} dogs! Can you get to ${number + 5}?`,
    `Way to go! You named ${number} dogs!`,
    `${number} dogs! You're an expert!`,
  ];

  return `${GUESSES[getRandomInt(0, GUESSES.length - 1)]} 🐕`;
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

  const celebrationCopy = getRandomCelebrationCopy({
    showGuessesCelebration,
    showStreakCelebration,
    metrics,
  });

  return (
    <Modal isOpen={showCorrectAnswerModal} onClose={handleClose}>
      {selectedDog ? (
        <Flex flexDirection="column" alignItems="center">
          <DogImage size="large" dog={selectedDog} />

          {celebrationCopy && (
            <Confetti>
              <span />
            </Confetti>
          )}

          {celebrationCopy && <h3>{celebrationCopy}</h3>}
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
