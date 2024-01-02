import { Dispatch, useEffect, useState } from "react";

import { gaze } from "./gazer";

export const useEyes = (videoElement: HTMLVideoElement | null) => {
  const [isInited, setIsInited] = useState<boolean>(false);
  const [eyeContact, setEyeContact] = useState<number>(0);
  useEffect(() => {
    if (videoElement && !isInited) {
      setIsInited(true);
      init(videoElement).then(() => {
        predict(setEyeContact);
      });
    }
    return () => {
      stop();
    };
  }, [isInited, videoElement]);

  return {
    eyeContact,
  };
};

let raf: number;
const init = async (videoElement: HTMLVideoElement) => {
  await gaze.loadModel();
  await gaze.setUpCamera(videoElement);
};

const predict = async (handler: Dispatch<React.SetStateAction<number>>) => {
  try {
    const gazePrediction = await gaze.getGazePrediction();
    console.log("Gaze direction: ", gazePrediction); //will return 'RIGHT', 'LEFT', 'STRAIGHT' or 'TOP'
    if (gazePrediction === "UP") {
      // handler((current: number) => current + 1);
    }
  } catch (e) {
    console.warn(e);
  } finally {
    setTimeout(() => {
      raf = requestAnimationFrame(predict.bind(window, handler));
    }, 1000);
  }
};

const stop = () => {
  cancelAnimationFrame(raf);
};
