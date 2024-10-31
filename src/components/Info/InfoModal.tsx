import { useState } from "react";

import { Modal } from "../../toolbox/Modal/Modal";
import { DOGGIES } from "../../constants";

export const InfoModal = () => {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  return (
    <div className="help-container">
      <img
        alt="Info Icon"
        src="/info.png"
        onClick={() => setShowHelp(true)}
        style={{ width: 20, height: 20, cursor: "pointer" }}
      />
      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)}>
        <div className="help-modal-container">
          <h3>How it works</h3>
          <p>
            As you answer each dog correctly, it will be removed from the list
            and you will be asked to name another dog at random.
          </p>
          <p>
            For every dog you name correctly, your score will increase by one.
            If you name consecutive dogs correctly, your streak will increase by
            one well.
          </p>
          <p>
            For every five dogs you answer correctly, you will see an animation.
            The same applies when your streak grows to multiple of five.
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
