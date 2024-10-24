import { Dispatch, SetStateAction } from "react";

import { Modal } from "../../toolbox/Modal/Modal";
import { Dog } from "../../constants";
import { kebabToTitleCase } from "../../utils";
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

  return (
    <Modal
      isOpen={showCorrectAnswerModal}
      onClose={() => {
        setShowCorrectAnswerModal(false);
      }}
    >
      {selectedDog ? (
        <Flex flexDirection="column" alignItems="center">
          <DogImage size="small" dog={selectedDog} />
          <p style={{ paddingBottom: 16 }}>
            You are are right! This dog is a(n){" "}
            <b>{kebabToTitleCase(selectedDog.key)}</b>.
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
