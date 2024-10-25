import { SyntheticEvent } from "react";
import { Dog } from "../../global-types";
import { kebabToTitleCase } from "../../utils";
import { Button } from "../../toolbox/Button/Button";

type OptionCardProps = {
  dog: Dog;
  onOptionSelect: (e: SyntheticEvent<HTMLButtonElement>, dog: Dog) => void;
};

export const OptionCard = ({ dog, onOptionSelect }: OptionCardProps) => {
  return (
    <Button
      className="doggy-option"
      onClick={(e) => {
        onOptionSelect(e, dog);
      }}
      label={kebabToTitleCase(dog.key)}
    />
  );
};
