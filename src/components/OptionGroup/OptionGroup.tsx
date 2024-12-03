import { useMemo, useState } from "react";
import { Dog } from "../../global-types";
import { DOGGIES } from "../../constants";
import { OptionCard } from "./OptionCard";
import { shuffleArray } from "../../utils";
import { CorrectAnswerModal } from "../StateModals/CorrectAnswerModal";
import { WrongAnswerModal } from "../StateModals/WrongAnswerModal";

type OptionGroupProps = {
  activeDog: Dog;
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

type ModalState = "correct" | "wrong" | null;

export const OptionGroup = ({
  activeDog,
  onCorrectAnswer,
  onWrongAnswer,
}: OptionGroupProps) => {
  const options = useMemo<Dog[]>(() => {
    const generatedOptions = generateOptions(activeDog, 4);
    return shuffleArray(generatedOptions);
  }, [activeDog]);

  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  const assertSelection = (selectedDog: Dog) => {
    if (selectedDog.key === activeDog.key) {
      setActiveModal("correct");
      onCorrectAnswer(selectedDog);
    } else {
      setActiveModal("wrong");
      onWrongAnswer();
    }
  };

  return (
    <div className="doggy-options-container">
      <CorrectAnswerModal
        modalState={[activeModal === "correct", () => setActiveModal(null)]}
        selectedDog={selectedDog}
      />
      <WrongAnswerModal
        modalState={[activeModal === "wrong", () => setActiveModal(null)]}
        selectedDog={selectedDog}
      />
      {options.map((option) => (
        <OptionCard
          key={option.key}
          dog={option}
          onOptionSelect={(e, dog) => {
            e.preventDefault();

            setSelectedDog(dog);
            assertSelection(dog);
          }}
        />
      ))}
    </div>
  );
};
