import React from "react";
import { Footer } from "@features/handpose-related/views/footer";
import { HandposeComponent } from "@features/handpose-related/handpose";
import { GameCanvas } from "@features/handpose-related/game/game.canvas";
import { NavigationComponent } from "@components/navigation/navigation.component";
import { GameStateProvider } from "@features/handpose-related/game-state.provider";

function HandposePlaneGame() {
  return (
    <div className="App">
      <header className="App-header">
        <NavigationComponent />
      </header>
      <GameStateProvider>
        <GameCanvas />
        <HandposeComponent />
        <Footer />
      </GameStateProvider>
    </div>
  );
}

export default HandposePlaneGame;
