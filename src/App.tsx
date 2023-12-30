import React from "react";
import "./App.css";
import { Footer } from "@views/footer";
import { HandposeComponent } from "@features/handpose";
import { useButtonActions } from "@controls/hooks";
import { GameCanvas } from "@features/game/game.canvas";

function App() {
  const buttonActions = useButtonActions();
  return (
    <div className="App">
      <header className="App-header">
        <GameCanvas buttonActions={buttonActions} />
        <HandposeComponent buttonActions={buttonActions} />
      </header>
      <Footer buttonActions={buttonActions} />
    </div>
  );
}

export default App;
