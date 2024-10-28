import { Dispatch, SetStateAction } from "react";

import { Modal } from "../../toolbox/Modal/Modal";
import { Dog } from "../../global-types";
import { isFirstCharVowel, kebabToTitleCase } from "../../utils";
import { Flex } from "../../toolbox/Flex/Flex";
import { Button } from "../../toolbox/Button/Button";

type WrongAnswerModalProps = {
  errorCopy: string;
  selectedDog: Dog | null;
  modalState: [boolean, Dispatch<SetStateAction<boolean>>];
};

export const WrongAnswerModal = ({
  errorCopy,
  selectedDog,
  modalState,
}: WrongAnswerModalProps) => {
  const [showWrongAnswerModal, setShowWrongAnswerModal] = modalState;

  const doesDogNameStartWithVowel = isFirstCharVowel(selectedDog?.key || "");

  return (
    <Modal
      isOpen={showWrongAnswerModal}
      onClose={() => {
        setShowWrongAnswerModal(false);
      }}
    >
      {selectedDog ? (
        <Flex flexDirection="column" alignItems="center">
          <p style={{ paddingBottom: 16 }}>
            Not quite! That dog is not {doesDogNameStartWithVowel ? "an" : "a"}{" "}
            <b>{kebabToTitleCase(selectedDog.key)}</b>.
          </p>
          <Flex justifyContent="center">
            <Button
              onClick={() => setShowWrongAnswerModal(false)}
              label="Try again"
            />
          </Flex>
        </Flex>
      ) : (
        <p>{errorCopy}</p>
      )}
    </Modal>
  );
};
