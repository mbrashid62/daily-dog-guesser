import { useEffect, useState } from "react";
import { Dog, DOGGIES } from "./constants";
import { Flex } from "./Flex";
import { OptionCard } from "./OptionCard";
import { kebabToTitleCase, shuffleArray } from "./utils";
import Modal from "./Modal";
import { DogImage } from "./DogImage";

type OptionGroupProps = {
  activeDog: Dog;
  totalOptions: number;
  onCorrectAnswer: () => void;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
};

function generateOptions(activeDog: Dog, totalOptions: number): Dog[] {
  const options = [activeDog];

  const dogsWithoutActiveDog = DOGGIES.filter((dog) => {
    return dog.key !== activeDog.key;
  });

  while (options.length < totalOptions) {
    const shuffled = shuffleArray(dogsWithoutActiveDog);
    const randomDog = shuffled[0];

    const isDupe = Boolean(options.find((dog) => dog.key === randomDog.key));

    if (!isDupe) {
      options.push(randomDog);
    }
  }

  return options;
}

export const OptionGroup = ({
  activeDog,
  totalOptions,
  onCorrectAnswer,
  setStreak,
}: OptionGroupProps) => {
  const options = generateOptions(activeDog, totalOptions);

  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [showCorrectAnswerModal, setShowCorrectAnswerModal] =
    useState<boolean>(false);
  const [showWrongAnswerModal, setShowWrongAnswerModal] =
    useState<boolean>(false);

  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  const assertSelection = (selectedDog: Dog) => {
    setShowConfirmationModal(false);

    if (selectedDog.key === activeDog.key) {
      setShowCorrectAnswerModal(true);
      onCorrectAnswer();
      setStreak((c) => c + 1);
    } else {
      setShowWrongAnswerModal(true);
      setStreak(0);
    }
  };

  return (
    <div className="doggy-options-container">
      <Modal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
        }}
      >
        {selectedDog ? (
          <Flex flexDirection="column">
            <p style={{ paddingBottom: 16 }}>
              A <b>{kebabToTitleCase(selectedDog.key)}</b>! Are you sure?
            </p>
            <Flex justifyContent="center">
              <button onClick={() => setShowConfirmationModal(false)}>
                No, Go Back
              </button>
              <button
                onClick={() => assertSelection(selectedDog)}
                style={{ marginLeft: 16 }}
              >
                Yes, I'm Sure
              </button>
            </Flex>
          </Flex>
        ) : (
          <p>Uh Oh. No selected dog.</p>
        )}
      </Modal>
      <Modal
        isOpen={showCorrectAnswerModal}
        onClose={() => {
          setShowCorrectAnswerModal(false);
        }}
      >
        {selectedDog ? (
          <Flex flexDirection="column" alignItems="center">
            <DogImage size="small" dog={selectedDog} />
            <p style={{ paddingBottom: 16 }}>
              You are are right! This dog is an{" "}
              <b>{kebabToTitleCase(selectedDog.key)}</b>.
            </p>
            <Flex justifyContent="center">
              <button onClick={() => setShowCorrectAnswerModal(false)}>
                Play Again
              </button>
            </Flex>
          </Flex>
        ) : (
          <p>Uh Oh. An error occured. Please refresh the page.</p>
        )}
      </Modal>
      <Modal
        isOpen={showWrongAnswerModal}
        onClose={() => {
          setShowWrongAnswerModal(false);
        }}
      >
        {selectedDog ? (
          <Flex flexDirection="column" alignItems="center">
            <DogImage size="small" dog={selectedDog} />
            <p style={{ paddingBottom: 16 }}>
              Not quite! This dog is not a{" "}
              <b>{kebabToTitleCase(selectedDog.key)}</b>.
            </p>
            <Flex justifyContent="center">
              <button onClick={() => setShowWrongAnswerModal(false)}>
                Try Again
              </button>
            </Flex>
          </Flex>
        ) : (
          <p>Uh Oh. An error occured. Please refresh the page.</p>
        )}
      </Modal>
      {shuffleArray(options).map((option) => (
        <OptionCard
          key={option.key}
          dog={option}
          onOptionSelect={(e, dog: Dog) => {
            e.preventDefault();

            setSelectedDog(dog);
            setShowConfirmationModal(true);
          }}
        />
      ))}
    </div>
  );
};
