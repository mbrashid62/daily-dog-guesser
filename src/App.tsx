import { useState } from "react";
import "./App.css";

import { DOGGIES } from "./constants";
import { getRandomInt } from "./utils";
import { OptionGroup } from "./OptionGroup";
import { Flex } from "./Flex";
import Modal from "./Modal";

function App() {
  const [successCount, setSuccessCount] = useState(0);

  const [randomInt, setRandomInt] = useState(
    getRandomInt(0, DOGGIES.length - 1),
  );

  const activeDog = DOGGIES[randomInt];

  const [streak, setStreak] = useState(0);

  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  if (!activeDog) {
    return <div>Uh Oh! No doggy.</div>;
  }

  return (
    <div>
      <h1>Can you name this dog?</h1>
      <img
        style={{ width: 100, height: 100, cursor: "pointer", marginBottom: 32 }}
        src={activeDog.image}
      />
      <OptionGroup
        activeDog={activeDog}
        totalOptions={4}
        setStreak={setStreak}
        onCorrectAnswer={() => {
          setSuccessCount((count) => count + 1);
          setRandomInt(() => getRandomInt(0, DOGGIES.length - 1));
        }}
      />
      <div className="card">
        {!!successCount && (
          <Flex flexDirection="column">
            <span>
              {" "}
              You correclty named <b>{successCount}</b>{" "}
              {successCount === 1 ? "doggy" : "doggies"}.
            </span>
            {!!streak && (
              <span style={{ paddingTop: 8 }}>
                Streak (<b>{streak}</b>)
              </span>
            )}
            <div style={{ marginTop: 32 }}>
              <button onClick={() => setShowResetConfirmation(true)}>
                Reset your score
              </button>
              <Modal
                isOpen={showResetConfirmation}
                onClose={() => setShowResetConfirmation(false)}
              >
                <p>Are you sure? You will lose your streak too.</p>
                <button
                  onClick={() => {
                    setSuccessCount(0);
                    setStreak(0);
                    setShowResetConfirmation(false);
                  }}
                >
                  Yup
                </button>
              </Modal>
            </div>
          </Flex>
        )}
      </div>
    </div>
  );
}

export default App;
