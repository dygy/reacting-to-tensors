import { NavigationComponent } from "@components/navigation/navigation.component";
import { GameCanvas } from "@features/handpose-related/game/game.canvas";
import { GameStateProvider } from "@features/handpose-related/game-state.provider";
import { HandposeComponent } from "@features/handpose-related/handpose";
import { Footer } from "@features/handpose-related/views/footer";

import React from "react";

function HandposePlaneGame() {
  return (
    <div className="App">
      <NavigationComponent />
      <GameStateProvider>
        <GameCanvas />
        <HandposeComponent />
        <Footer />
      </GameStateProvider>
    </div>
  );
}

export default HandposePlaneGame;
