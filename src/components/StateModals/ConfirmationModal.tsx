import { Dispatch, SetStateAction } from "react";

import { Modal } from "../../toolbox/Modal/Modal";
import { Dog } from "../../global-types";
import { isFirstCharVowel, kebabToTitleCase } from "../../utils";
import { Flex } from "../../toolbox/Flex/Flex";
import { Button } from "../../toolbox/Button/Button";

type ConfirmationModalProps = {
  assertSelection: (selectedDog: Dog) => void;
  errorCopy: string;
  selectedDog: Dog | null;
  modalState: [boolean, Dispatch<SetStateAction<boolean>>];
};

export const ConfirmationModal = ({
  assertSelection,
  errorCopy,
  modalState,
  selectedDog,
}: ConfirmationModalProps) => {
  const [showConfirmationModal, setShowConfirmationModal] = modalState;

  const doesDogNameStartWithVowel = isFirstCharVowel(selectedDog?.key || "");
  return (
    <Modal
      isOpen={showConfirmationModal}
      onClose={() => {
        setShowConfirmationModal(false);
      }}
    >
      {selectedDog ? (
        <Flex flexDirection="column">
          <p style={{ paddingBottom: 16 }}>
            {doesDogNameStartWithVowel ? "An " : "A "}
            <b>{kebabToTitleCase(selectedDog.key)}</b>! Are you sure?
            <p>Double click to skip this next time.</p>
          </p>
          <Flex justifyContent="center">
            <Button
              onClick={() => setShowConfirmationModal(false)}
              label="No, Go Back"
            />
            <Button
              margin="0 0 0 16px"
              onClick={() => assertSelection(selectedDog)}
              label="Yes, I'm Sure"
            />
          </Flex>
        </Flex>
      ) : (
        <p>{errorCopy}</p>
      )}
    </Modal>
  );
};
