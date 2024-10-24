import { SyntheticEvent } from "react";
import { Dog } from "../../constants";
import { kebabToTitleCase } from "../../utils";

type OptionCardProps = {
  dog: Dog;
  onOptionSelect: (e: SyntheticEvent<HTMLDivElement>, dog: Dog) => void;
};

export const OptionCard = ({ dog, onOptionSelect }: OptionCardProps) => {
  return (
    <div
      className="doggy-option"
      onClick={(e) => {
        onOptionSelect(e, dog);
      }}
    >
      {kebabToTitleCase(dog.key)}
    </div>
  );
};
