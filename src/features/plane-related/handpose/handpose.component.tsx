import { GameStateContext } from "@features/plane-related/game-state.provider";

import { useContext, useEffect } from "react";

import { useFingersClicks } from "./hand-pose.drawer";
import styles from "./hand-pose.module.css";

export const HandposeComponent = () => {
  const { submitButton } = useContext(GameStateContext);
  const fingerState = useFingersClicks();

  useEffect(() => {
    if (fingerState.clicked && fingerState.hand !== undefined) {
      submitButton(fingerState.hand);
    }
  }, [submitButton, fingerState]);

  return (
    <div>
      <video id="video" className={styles.layer} playsInline />
    </div>
  );
};
