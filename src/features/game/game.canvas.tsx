import { useEffect, useRef, useState } from "react";

import { usePlane } from "@features/game/plane";
import styles from "./game.module.css";
import { useButtonActions } from "@controls/hooks";
import { BackgroundComponent } from "@features/game/background.component";
export const GameCanvas = ({
  buttonActions,
}: {
  buttonActions: ReturnType<typeof useButtonActions>;
}) => {
  const ref = useRef<HTMLCanvasElement>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | void>();
  useEffect(() => {
    if (ref.current) setCanvas(ref.current);
  }, []);
  const { loading, changeX } = usePlane(canvas);
  useEffect(() => {
    if (buttonActions.buttonState.right.loading) {
      changeX("right");
    }
    if (buttonActions.buttonState.left.loading) {
      changeX("left");
    }
  }, [
    buttonActions.buttonState.left.loading,
    buttonActions.buttonState.right.loading,
  ]);

  return (
    <div>
      <BackgroundComponent />
      {/* @ts-ignore */}
      <canvas className={styles.canvas} ref={ref} />
      {loading && <div>loading </div>}
    </div>
  );
};
