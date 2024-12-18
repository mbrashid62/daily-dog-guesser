import { Dispatch, SetStateAction, useState } from "react";

import { Modal } from "../../toolbox/Modal/Modal";
import { DOGGIES } from "../../constants";
import { Flex } from "../../toolbox/Flex/Flex";

type InfoModalProps = {
  showHelp: boolean;
  setShowHelp: Dispatch<SetStateAction<boolean>>;
};
export const InfoModal = ({ showHelp, setShowHelp }: InfoModalProps) => {
  return (
    <div className="help-container">
      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)}>
        <div className="help-modal-container">
          <Flex alignItems="center" justifyContent="center">
            <h3 style={{ marginRight: 8 }}>How it works</h3>
            <img
              alt="Info Icon"
              src="/info.png"
              onClick={() => setShowHelp(true)}
              style={{ width: 20, height: 20 }}
            />
          </Flex>
          <p>
            You will be shown a dog at random and asked to name its breed. If
            you answer correctly, it will be removed from the list.
          </p>
          <p>
            When you name a dog correctly, your score will increase by one. If
            you answer correctly consecutively, your streak will increase by one
            also.
          </p>
          <p>
            You will see an animation for every five dogs you name correctly or
            when you achieve a streak that is a multiple of five.
          </p>
          <p>To reset your score, simply refresh the page.</p>
          <p>To win, name all {DOGGIES.length} dogs!</p>
          <button
            style={{ margin: "16px 0" }}
            onClick={() => setShowHelp(false)}
          >
            Sounds good
          </button>
          <div className="github-link-container">
            <img
              style={{ width: 20, height: 20, marginRight: 8 }}
              src="/github-mark.png"
              alt="GitHub logo"
            />
            See an issue?
            <span style={{ margin: "0 4px" }} />
            <a
              href="https://github.com/mbrashid62/daily-dog-guesser/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Log it on GitHub
            </a>
            .
          </div>
        </div>
      </Modal>
    </div>
  );
};
