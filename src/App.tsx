import { useState, useMemo } from "react";
import "./App.css";

import { Dog, DOGGIES } from "./constants";
import { getRandomInt } from "./utils";
import { OptionGroup } from "./OptionGroup";

function App() {
  const [successCount, setSuccessCount] = useState(0);

  const [randomInt, setRandomInt] = useState(getRandomInt(0, DOGGIES.length));

  // const activeDog = useMemo<Dog>(() => DOGGIES[randomInt], [randomInt]);
  const activeDog = DOGGIES[randomInt];
  console.log("activeDog --> ", activeDog);

  if (!activeDog) {
    return <div>Uh OH! No doggy.</div>;
  }

  return (
    <div>
      <h1>Who Dis Doggy?</h1>
      <img
        style={{ width: 100, height: 100, cursor: "pointer" }}
        src={activeDog.image}
      />
      <div>
        <OptionGroup activeDog={activeDog} totalOptions={4} />
      </div>
      <div className="card">
        <button
          onClick={() => {
            setSuccessCount((count) => count + 1);

            // TODO: Ensure the same number can't be set twice in a row
            setRandomInt(() => {
              return getRandomInt(0, DOGGIES.length);
            });
          }}
        >
          Count is {successCount}
        </button>
        <button
          style={{ marginLeft: 8 }}
          onClick={() => {
            setSuccessCount(() => 0);
            // set
          }}
        >
          Reset state
        </button>
      </div>
    </div>
  );
}

export default App;
