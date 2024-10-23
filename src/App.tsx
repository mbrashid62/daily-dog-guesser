import { useState } from "react";
import "./App.css";

import Beagle from "./assets/beagle.svg";
import Boxer from "./assets/boxer.svg";
import GermanS from "./assets/GermanS.svg";
import GoldenR from "./assets/GoldenR.svg";
import Pitbull from "./assets/pitbull.svg";
import Pug from "./assets/pug-bulldog.svg";

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DOGGIES = [Beagle, Boxer, GermanS, GoldenR, Pitbull, Pug];

function App() {
  const [successCount, setSuccessCount] = useState(0);

  const [randomInt, setRandomInt] = useState(getRandomInt(0, DOGGIES.length));

  return (
    <div>
      <h1>Who Dis Doggy??</h1>
      <img
        style={{ width: 100, height: 100, cursor: "pointer" }}
        src={DOGGIES[randomInt]}
      ></img>
      <div className="card">
        <button
          onClick={() => {
            setSuccessCount((count) => count + 1);

            // TODO: Ensure the same number can't be set in a row
            setRandomInt(() => {
              return getRandomInt(0, DOGGIES.length);
            });
          }}
        >
          Count is {successCount}
        </button>
        <button
          style={{ marginLeft: 8 }}
          onClick={() => setSuccessCount(() => 0)}
        >
          Reset count
        </button>
      </div>
    </div>
  );
}

export default App;
