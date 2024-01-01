import { useButtonActions } from "@controls/hooks";

import { createContext, PropsWithChildren } from "react";

type GameStateContextType = ReturnType<typeof useButtonActions>;

export const GameStateContext = createContext<GameStateContextType>(
  null as unknown as GameStateContextType,
);

export const GameStateProvider = ({ children }: PropsWithChildren) => {
  const buttonActions = useButtonActions();
  return (
    <GameStateContext.Provider value={buttonActions}>
      {children}
    </GameStateContext.Provider>
  );
};
