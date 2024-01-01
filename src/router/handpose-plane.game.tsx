import { NavigationComponent } from "@components/navigation/navigation.component";
import { GameCanvas } from "@features/plane-related/game/game.canvas";
import { GameStateProvider } from "@features/plane-related/game-state.provider";
import { HandposeComponent } from "@features/plane-related/handpose";
import { Footer } from "@features/plane-related/views/footer";

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
