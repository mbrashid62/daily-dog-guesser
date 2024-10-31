import { Home } from "./components/Home/Home";
import { InfoModal } from "./components/Info/InfoModal";

import "./App.css";

function App() {
  return (
    <div className="app-container">
      <InfoModal />
      <Home />
    </div>
  );
}

export default App;
