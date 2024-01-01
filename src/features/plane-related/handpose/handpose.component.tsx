import { GameStateContext } from "@features/plane-related/game-state.provider";

import { useContext, useEffect, useRef, useState } from "react";

import { useFingersClicks } from "./hand-pose.drawer";
import styles from "./hand-pose.module.css";

export const HandposeComponent = () => {
  const [videoStream, setVideoStream] = useState<HTMLVideoElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      setVideoStream(videoRef.current);
    }
  }, []);
  const { submitButton } = useContext(GameStateContext);
  const fingerState = useFingersClicks(videoStream);

  useEffect(() => {
    if (fingerState.clicked && fingerState.hand !== undefined) {
      submitButton(fingerState.hand);
    }
  }, [submitButton, fingerState]);

  return (
    <div>
      <video ref={videoRef} className={styles.layer} playsInline />
    </div>
  );
};
