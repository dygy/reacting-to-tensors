import { NavigationComponent } from "@components/navigation/navigation.component";
import { GameComponent } from "@features/rps-related/game/game.component";

export const RockPaperScissorsGame = () => {
  return (
    <div>
      <NavigationComponent />
      <GameComponent />
    </div>
  );
};
