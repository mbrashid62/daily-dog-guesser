import { Dispatch, SetStateAction } from "react";

import { Modal } from "../../toolbox/Modal/Modal";
import { Dog } from "../../global-types";
import { isFirstCharVowel, kebabToTitleCase } from "../../utils";
import { Flex } from "../../toolbox/Flex/Flex";
import { Button } from "../../toolbox/Button/Button";
import { DogImage } from "../DogImage/DogImage";

type CorrectAnswerModalProps = {
  errorCopy: string;
  selectedDog: Dog | null;
  modalState: [boolean, Dispatch<SetStateAction<boolean>>];
};

export const CorrectAnswerModal = ({
  errorCopy,
  selectedDog,
  modalState,
}: CorrectAnswerModalProps) => {
  const [showCorrectAnswerModal, setShowCorrectAnswerModal] = modalState;

  const doesDogNameStartWithVowel = isFirstCharVowel(selectedDog?.key || "");

  return (
    <Modal
      isOpen={showCorrectAnswerModal}
      onClose={() => {
        setShowCorrectAnswerModal(false);
      }}
    >
      {selectedDog ? (
        <Flex flexDirection="column" alignItems="center">
          <DogImage size="large" dog={selectedDog} />
          <p>
            You are are right! That dog is{" "}
            {doesDogNameStartWithVowel ? "an" : "a"}{" "}
            <b>{kebabToTitleCase(selectedDog.key)}</b>.
          </p>
          <p>{selectedDog.info.bio}</p>
          <p>
            Want to learn more? Click{" "}
            <a href={selectedDog.info.wikipediaUrl} target="_blank">
              here
            </a>
            !
          </p>

          <Flex justifyContent="center">
            <Button
              onClick={() => setShowCorrectAnswerModal(false)}
              label="Play Again"
            />
          </Flex>
        </Flex>
      ) : (
        <p>{errorCopy}</p>
      )}
    </Modal>
  );
};
