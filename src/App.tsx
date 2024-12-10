import { Home } from "./components/Home/Home";
import { InfoModal } from "./components/Info/InfoModal";
import { SideBar } from "./components/SideBar/SideBar";

import "./App.css";
import { useState } from "react";

function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const toggleSideBar = () => setIsSideBarOpen(!isSideBarOpen);

  return (
    <>
      <div className="side-menu-parent-container">
        <SideBar
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
        <header>
          {/* <button
            onClick={() => setIsSideBarOpen(true)}
            className="menu-button"
          >
            ☰
          </button> */}
          <img
            alt="Info Icon"
            src="/info.png"
            onClick={() => toggleSideBar()}
            style={{ width: 20, height: 20, cursor: "pointer" }}
          />
        </header>
      </div>
      <div className="app-container">
        <InfoModal />
        <Home setIsSideBarOpen={setIsSideBarOpen} />
      </div>
    </>
  );
}

export default App;
