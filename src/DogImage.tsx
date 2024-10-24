import { Dog } from "./constants";

type DogImageProps = {
  dog: Dog;
  size: "small" | "medium" | "large";
};

function getDimensions(size: DogImageProps["size"]) {
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
  const dimension = getDimensions(size);
  return <img width={dimension} height={dimension} src={dog.image} />;
};
