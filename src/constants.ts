import Beagle from "./assets/beagle.svg";
import Boxer from "./assets/boxer.svg";
import GermanS from "./assets/GermanS.svg";
import GoldenR from "./assets/GoldenR.svg";
import Pitbull from "./assets/pitbull.svg";
import Pug from "./assets/pug-bulldog.svg";

export type DogKeys =
  | "beagle"
  | "boxer"
  | "german-shepherd"
  | "golden-retriever"
  | "pit-bull"
  | "pug";

export type Dog = {
  key: DogKeys;
  // TOOD: figure how to type an SVG
  image: string;
  info: {
    bio: string;
    wikipediaUrl: string;
  };
};

export const DOGGIES: Array<Dog> = [
  {
    key: "beagle",
    image: Beagle,
    info: {
      bio: "Beagles are excellent sniffers.",
      wikipediaUrl: "",
    },
  },
  {
    key: "boxer",
    image: Boxer,
    info: {
      bio: "Boxers are great little companions",
      wikipediaUrl: "",
    },
  },
  {
    key: "german-shepherd",
    image: GermanS,
    info: {
      bio: "German Shepherd are as smart as they are athletic.",
      wikipediaUrl: "",
    },
  },
  {
    key: "golden-retriever",
    image: GoldenR,
    info: {
      bio: "Golden Retrievers are docile and adorable.",
      wikipediaUrl: "",
    },
  },
  {
    key: "pit-bull",
    image: Pitbull,
    info: {
      bio: "Pit Bulls are tough and loveable.",
      wikipediaUrl: "",
    },
  },
  {
    key: "pug",
    image: Pug,
    info: {
      bio: "Pugs are wide-eyed and insanely cute.",
      wikipediaUrl: "",
    },
  },
];
