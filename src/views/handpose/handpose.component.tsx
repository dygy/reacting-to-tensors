import { useFingersClicks } from "./hand-pose.drawer"
import { useEffect, useRef, useState } from "react";
import { useButtonActions } from "../../controll/use-button-actions";
import styles from "./hand-pose.module.css"
export const HandposeComponent = ({buttonActions}: {buttonActions: ReturnType<typeof useButtonActions>}) => {
  const video = useRef<HTMLVideoElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [items, setItems] = useState({video, canvas})

  const fingerState = useFingersClicks(items.video.current, items.canvas.current)

  useEffect(() => {
      setItems({
          video,
          canvas,
      })
  }, [video, canvas]);

  useEffect(() => {
      if (fingerState.clicked && fingerState.hand) {
          buttonActions.submitButton(fingerState.hand)
      }
  }, [buttonActions, fingerState]);

  return(
      <div>
          <video ref={video} className={styles.layer} playsInline />
          <canvas ref={canvas} className={styles.layer} />

      </div>
  )
}
