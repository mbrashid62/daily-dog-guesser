import { useMemo, useState } from "react";
import { Dog } from "../../global-types";
import { DOGGIES } from "../../constants";
import { OptionCard } from "./OptionCard";
import { shuffleArray } from "../../utils";
import { CorrectAnswerModal } from "../StateModals/CorrectAnswerModal";
import { WrongAnswerModal } from "../StateModals/WrongAnswerModal";
import { MetricsProps } from "../Cards/Metrics";

type OptionGroupProps = {
  activeDog: Dog;
  metrics: MetricsProps;
  onCorrectAnswer: (dog: Dog) => void;
  onWrongAnswer: () => void;
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
  metrics,
  onCorrectAnswer,
  onWrongAnswer,
}: OptionGroupProps) => {
  const options = useMemo<Dog[]>(() => {
    const generatedOptions = generateOptions(activeDog, 4);
    return shuffleArray(generatedOptions);
  }, [activeDog]);

  const [showCorrectAnswerModal, setShowCorrectAnswerModal] =
    useState<boolean>(false);
  const [showWrongAnswerModal, setShowWrongAnswerModal] =
    useState<boolean>(false);

  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  const assertSelection = (selectedDog: Dog) => {
    if (selectedDog.key === activeDog.key) {
      setShowCorrectAnswerModal(true);
      onCorrectAnswer(selectedDog);
    } else {
      setShowWrongAnswerModal(true);
      onWrongAnswer();
    }
  };

  return (
    <div className="doggy-options-container">
      <CorrectAnswerModal
        errorCopy="Uh oh! Something went wrong. Please refresh the page."
        metrics={metrics}
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
            assertSelection(dog);
          }}
        />
      ))}
    </div>
  );
};
