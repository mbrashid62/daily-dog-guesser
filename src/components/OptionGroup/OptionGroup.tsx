import { useMemo, useState } from "react";
import { Dog, DOGGIES } from "../../constants";
import { OptionCard } from "./OptionCard";
import { shuffleArray } from "../../utils";
import "./OptionGroup.css";
import { ConfirmationModal } from "../StateModals/ConfirmationModal";
import { CorrectAnswerModal } from "../StateModals/CorrectAnswerModal";
import { WrongAnswerModal } from "../StateModals/WrongAnswerModal";

type OptionGroupProps = {
  activeDog: Dog;
  totalOptions: number;
  onCorrectAnswer: () => void;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
};

function generateOptions(activeDog: Dog, totalOptions: number): Dog[] {
  const options = [activeDog];

  const dogsWithoutActiveDog = DOGGIES.filter(
    (dog) => dog.key !== activeDog.key,
  );

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
  const options = useMemo<Dog[]>(() => {
    const generatedOptions = generateOptions(activeDog, totalOptions);
    return shuffleArray(generatedOptions);
  }, [activeDog]);

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
      <ConfirmationModal
        assertSelection={assertSelection}
        errorCopy="Uh oh! Something went wrong. Please refresh the page."
        modalState={[showConfirmationModal, setShowConfirmationModal]}
        selectedDog={selectedDog}
      />
      <CorrectAnswerModal
        errorCopy="Uh oh! Something went wrong. Please refresh the page."
        modalState={[showCorrectAnswerModal, setShowCorrectAnswerModal]}
        selectedDog={selectedDog}
      />
      <WrongAnswerModal
        errorCopy="Uh oh! Something went wrong. Please refresh the page."
        modalState={[showWrongAnswerModal, setShowWrongAnswerModal]}
        selectedDog={selectedDog}
      />
      {options.map((option) => (
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
