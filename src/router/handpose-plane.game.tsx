import React from "react";
import { Footer } from "@views/footer";
import { HandposeComponent } from "@features/handpose";
import { useButtonActions } from "@controls/hooks";
import { GameCanvas } from "@features/game/game.canvas";
import { NavigationComponent } from "@components/navigation/navigation.component";

function HandposePlaneGame() {
  const buttonActions = useButtonActions();
  return (
    <div className="App">
      <header className="App-header">
        <NavigationComponent />
      </header>
      <GameCanvas buttonActions={buttonActions} />
      <HandposeComponent buttonActions={buttonActions} />
      <Footer buttonActions={buttonActions} />
    </div>
  );
}

export default HandposePlaneGame;
