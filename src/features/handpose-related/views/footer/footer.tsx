import { Button } from "@components/button/button";
import { GameStateContext } from "@features/handpose-related/game-state.provider";

import { useContext } from "react";

import styles from "./footer.module.css";

export const Footer = () => {
  const { submitButton, buttonState } = useContext(GameStateContext);
  return (
    <div className={styles.footer}>
      <Button {...buttonState.left} onClick={() => submitButton("left")}>
        Left
      </Button>
      <Button {...buttonState.right} onClick={() => submitButton("right")}>
        Right
      </Button>
    </div>
  );
};
