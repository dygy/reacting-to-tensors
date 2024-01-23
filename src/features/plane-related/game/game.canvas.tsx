import { BackgroundComponent } from "@features/plane-related/game/background.component";
import { usePlane } from "@features/plane-related/game/plane";
import { GameStateContext } from "@features/plane-related/game-state.provider";

import { useContext, useEffect, useRef, useState } from "react";

import styles from "./game.module.css";

export const GameCanvas = () => {
  const { buttonState } = useContext(GameStateContext);
  const ref = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | void>();
  useEffect(() => {
    if (ref.current) setCanvas(ref.current);
  }, []);
  const { loading, changeX } = usePlane(canvas);
  useEffect(() => {
    if (buttonState.right.loading) {
      changeX("right");
    }
    if (buttonState.left.loading) {
      changeX("left");
    }
  }, [buttonState.left.loading, buttonState.right.loading, changeX]);

  return (
    <div>
      <BackgroundComponent />
      <canvas className={styles.canvas} ref={ref} />
      {loading && <div>loading </div>}
    </div>
  );
};
