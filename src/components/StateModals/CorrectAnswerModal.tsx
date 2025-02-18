import { Dispatch, SetStateAction, useContext } from "react";

import { Modal } from "../../toolbox/Modal/Modal";
import { getRandomInt, isFirstCharVowel, kebabToTitleCase } from "../../utils";
import { Flex } from "../../toolbox/Flex/Flex";
import { Button } from "../../toolbox/Button/Button";
import { DogImage } from "../DogImage/DogImage";
import { Confetti } from "../Animations/Confetti/Confetti";
import { SelectedDogContext } from "../OptionGroup/OptionGroup";
import { useMetrics } from "../Metrics/MetricsProvider";

type CorrectAnswerModalProps = {
  modalState: [boolean, Dispatch<SetStateAction<boolean>>];
};

type GetRandomCelebrationCopyInput = {
  showGuessesCelebration: boolean;
  showStreakCelebration: boolean;
  streak: number;
  correctGuesses: number;
};

const getRandomCelebrationCopy = (
  input: GetRandomCelebrationCopyInput,
): string | null => {
  const {
    showGuessesCelebration,
    showStreakCelebration,
    streak,
    correctGuesses,
  } = input;

  const showCelebration = Boolean(
    showStreakCelebration || showGuessesCelebration,
  );

  if (!showCelebration) {
    return null;
  }

  if (showStreakCelebration) {
    const STREAKS = [
      `${streak} dogs in a row. Nice job!`,
      `You're on fire! You named ${streak} dogs in a row.`,
      `${streak} dogs! That's an impressive streak!`,
      `${streak} dogs in row! Can you get to ${streak + 5}?`,
      `Way to go! You named ${streak} dogs in a row!`,
      `${streak} dogs without missing a beat! You're an expert!`,
    ];

    return `${STREAKS[getRandomInt(0, STREAKS.length - 1)]} ⚡`;
  }

  const GUESSES = [
    `Holy cow ${correctGuesses} dogs!`,
    `You named ${correctGuesses} dogs. Nice Work!`,
    `Achievement unlocked. ${correctGuesses} dogs!`,
    `Wow ${correctGuesses} dogs! Can you get to ${correctGuesses + 5}?`,
    `Way to go! You named ${correctGuesses} dogs!`,
    `${correctGuesses} dogs! You're an expert!`,
  ];

  return `${GUESSES[getRandomInt(0, GUESSES.length - 1)]} 🐕`;
};

const shouldCelebrate = (value: number) => value > 0 && value % 5 === 0;

export const CorrectAnswerModal = ({ modalState }: CorrectAnswerModalProps) => {
  const [showCorrectAnswerModal, setShowCorrectAnswerModal] = modalState;

  const { metrics } = useMetrics();
  const { correctGuesses, streak } = metrics;
  const selectedDog = useContext(SelectedDogContext);

  const showGuessesCelebration = shouldCelebrate(correctGuesses);
  const showStreakCelebration = shouldCelebrate(streak);

  const handleClose = () => {
    setShowCorrectAnswerModal(false);
  };

  const celebrationCopy = getRandomCelebrationCopy({
    showGuessesCelebration,
    showStreakCelebration,
    correctGuesses,
    streak,
  });

  if (!selectedDog) {
    return (
      <Modal isOpen={showCorrectAnswerModal} onClose={handleClose}>
        <p>Uh oh! Something went wrong. Please refresh the page.</p>
      </Modal>
    );
  }

  return (
    <Modal isOpen={showCorrectAnswerModal} onClose={handleClose}>
      <Flex flexDirection="column" alignItems="center">
        <DogImage size="large" dog={selectedDog} />
        {celebrationCopy && (
          <>
            <Confetti>
              <span />
            </Confetti>
            <h3>{celebrationCopy}</h3>
          </>
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
              rel="noopener noreferrer"
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
    </Modal>
  );
};
