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
      bio: "Beagles are small hounds known for their strong sense of smell and tracking instinct. Originally bred for hunting, they are friendly, curious, and enjoy being around people and other animals.",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Beagle",
    },
  },
  {
    key: "boxer",
    image: Boxer,
    info: {
      bio: "Boxers are medium to large-sized dogs known for their muscular build, playful spirit, and loyalty. They are highly energetic, making them great companions for active families, and are also used as working dogs.",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Boxer_(dog)",
    },
  },
  {
    key: "german-shepherd",
    image: GermanS,
    info: {
      bio: "German Shepherds are large, intelligent, and versatile dogs, originally bred for herding sheep. They are often employed in roles such as police work, search-and-rescue, and assistance for disabled individuals due to their strength, intelligence, and trainability.",
      wikipediaUrl: "https://en.wikipedia.org/wiki/German_Shepherd",
    },
  },
  {
    key: "golden-retriever",
    image: GoldenR,
    info: {
      bio: "Golden Retrievers are known for their friendly, tolerant attitudes, making them great family pets. They are intelligent, highly trainable, and often excel in roles like service dogs or therapy dogs. Their love for retrieving objects also makes them excellent sporting dogs.",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Golden_Retriever",
    },
  },
  {
    key: "pit-bull",
    image: Pitbull,
    info: {
      bio: "Pit Bulls are a group of breeds including the American Pit Bull Terrier and American Staffordshire Terrier. They are known for their muscular build, strength, and loyalty. Despite their tough appearance, they are affectionate and enjoy human interaction.",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Pit_bull",
    },
  },
  {
    key: "pug",
    image: Pug,
    info: {
      bio: "Pugs are small, sturdy dogs with a wrinkled face and distinctive curled tail. Known for their sociable and playful nature, pugs are great companion dogs that thrive on human attention.",
      wikipediaUrl: "https://en.wikipedia.org/wiki/Pug",
    },
  },
];
