import { Dog } from "./constants";

type OptionCardProps = {
  dog: Dog;
};

export const OptionCard = ({ dog }: OptionCardProps) => {
  return <div>{dog.key}</div>;
};
