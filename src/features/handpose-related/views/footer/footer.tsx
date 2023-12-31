import styles from "./footer.module.css";
import { Button } from "@components/button/button";
import { useContext } from "react";
import { GameStateContext } from "@features/handpose-related/game-state.provider";

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
