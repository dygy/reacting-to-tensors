import { Button } from "@components/button/button";
import {
  humanImage,
  paperImage,
  robotCamera,
  rockImage,
  scissorsImage,
} from "@features/rps-related/game/assets";
import { PlayerContainer } from "@features/rps-related/game/player.container";
import {
  STATUSES,
  useGameHook,
} from "@features/rps-related/game/use-game.hook";
import classNames from "classnames";

import { useEffect, useRef, useState } from "react";

import styles from "./game.module.css";

export const GameComponent = () => {
  const [videoStream, setVideoStream] = useState<HTMLVideoElement | null>(null);
  const { gameState, setReady } = useGameHook(videoStream);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      setVideoStream(videoRef.current);
    }
  }, []);
  return (
    <>
      <link rel="prefetch" href={scissorsImage} />
      <link rel="prefetch" href={paperImage} />
      <link rel="prefetch" href={rockImage} />
      <div id="root" className={styles.container}>
        <div className={styles.gameContainer}>
          <PlayerContainer
            ref={videoRef}
            score={gameState.player.score}
            name="Player"
            poster={humanImage}
            moveImage={gameState.player.image}
            isNotResolvedMove={gameState.status === STATUSES.PLAY}
          />

          <PlayerContainer
            score={gameState.robot.score}
            name="Robot"
            poster={robotCamera}
            moveImage={gameState.robot.image}
            isNotResolvedMove={false}
          />

          <div className={styles.messages}>
            <span className={classNames(styles.messages, styles.fadeInOut)}>
              {gameState.status}
            </span>
          </div>
          <div className={styles.messages}>
            <Button
              onClick={setReady}
              disabled={gameState.status !== STATUSES.READY}
            >
              Ready
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
