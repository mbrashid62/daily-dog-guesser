import { Dog, DOGGIES } from "./constants";
import { OptionCard } from "./OptionCard";
import { shuffleArray } from "./utils";

type OptionGroupProps = {
  activeDog: Dog;
  totalOptions: number;
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

export const OptionGroup = ({ activeDog, totalOptions }: OptionGroupProps) => {
  const options = generateOptions(activeDog, totalOptions);

  return (
    <div>
      <h2>Choose a Doggy</h2>
      {shuffleArray(options).map((option) => {
        return <OptionCard key={option.key} dog={option} />;
      })}
    </div>
  );
};
