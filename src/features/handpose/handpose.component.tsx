import { useFingersClicks } from "./hand-pose.drawer"
import {useEffect} from "react";
import { useButtonActions } from "@controls/hooks";
import styles from "./hand-pose.module.css"
export const HandposeComponent = ({buttonActions}: {buttonActions: ReturnType<typeof useButtonActions>}) => {
    const fingerState = useFingersClicks()

  useEffect(() => {
      if (fingerState.clicked && fingerState.hand) {
          buttonActions.submitButton(fingerState.hand)
      }
  }, [buttonActions, fingerState]);

  return(
      <div>
          <video id="video" className={styles.layer} playsInline />
          <canvas id="canvas" className={styles.layer} />

      </div>
  )
}
