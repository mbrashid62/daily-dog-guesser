import { Dispatch, SetStateAction, useContext } from "react";

import { Modal } from "../../toolbox/Modal/Modal";
import { isFirstCharVowel, kebabToTitleCase } from "../../utils";
import { Flex } from "../../toolbox/Flex/Flex";
import { Button } from "../../toolbox/Button/Button";
import { SelectedDogContext } from "../OptionGroup/OptionGroup";

type WrongAnswerModalProps = {
  modalState: [boolean, Dispatch<SetStateAction<boolean>>];
};

export const WrongAnswerModal = ({ modalState }: WrongAnswerModalProps) => {
  const [showWrongAnswerModal, setShowWrongAnswerModal] = modalState;
  const selectedDog = useContext(SelectedDogContext);

  if (!selectedDog) {
    return (
      <Modal
        isOpen={showWrongAnswerModal}
        onClose={() => {
          setShowWrongAnswerModal(false);
        }}
      >
        <p>Uh oh! Something went wrong. Pleases refresh the page.</p>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={showWrongAnswerModal}
      onClose={() => setShowWrongAnswerModal(false)}
    >
      <Flex flexDirection="column" alignItems="center">
        <span>Not quite!</span>
        <span style={{ paddingTop: 24, paddingBottom: 32 }}>
          That dog is not {isFirstCharVowel(selectedDog.key) ? "an" : "a"}{" "}
          <b>{kebabToTitleCase(selectedDog.key)}</b>.
        </span>
        <Flex justifyContent="center">
          <Button
            onClick={() => setShowWrongAnswerModal(false)}
            label="Try again"
          />
        </Flex>
      </Flex>
    </Modal>
  );
};
