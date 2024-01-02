import { NavigationComponent } from "@components/navigation/navigation.component";
import { useEyes } from "@features/contactasino-related/eye-tracker/eye.tracker";
import { useGameHook } from "@features/contactasino-related/game/use-game.hook";

import { useEffect, useRef, useState } from "react";

export const EyeContactasinoGame = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && videoRef.current) {
      setCanvas(canvasRef.current);
      setVideo(videoRef.current);
    }
  }, []);
  const { eyeContact } = useEyes(video);
  useGameHook(canvas, eyeContact);

  return (
    <div>
      <NavigationComponent />
      <video style={{ display: "none" }} ref={videoRef} />
      <canvas ref={canvasRef} />
    </div>
  );
};
