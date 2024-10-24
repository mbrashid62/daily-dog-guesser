import { Dog } from "../../constants";
import { kebabToTitleCase } from "../../utils";

type DogImageProps = {
  dog: Dog;
  size: "small" | "medium" | "large";
};

function getSize(size: DogImageProps["size"]) {
  switch (size) {
    default:
    case "small":
      return 50;
    case "medium":
      return 100;
    case "large":
      return 150;
  }
}

export const DogImage = ({ dog, size }: DogImageProps) => {
  const dimension = getSize(size);

  return (
    <img
      alt={kebabToTitleCase(dog.key)}
      width={dimension}
      height={dimension}
      src={dog.image}
    />
  );
};
