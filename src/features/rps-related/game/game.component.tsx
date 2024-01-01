import {
  humanImage,
  paperImage,
  robotCamer,
  rockImage,
  scissorsImage,
} from "@features/rps-related/game/assets";
import { useGameHook } from "@features/rps-related/game/use-game.hook";
import classNames from "classnames";

import { useEffect, useRef, useState } from "react";

import styles from "./game.module.css";

export const GameComponent = () => {
  const [videoStream, setVideoStream] = useState<HTMLVideoElement | null>(null);
  const { gameState } = useGameHook(videoStream);
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
        <h3>Let's play Rock - Paper - Scissors </h3>

        <p className={styles.instructions}>
          After the countdown, show a hand gesture and hold it for a moment.
          <br />
          The computer will then make its move (don't worry, it doesn't cheat).
        </p>

        <div className={styles.gameContainer}>
          <div className={styles.player}>
            <h2 className={styles.playerHeadline}>
              <span className={styles.nick}>Human</span>
              <span className={styles.score}>{gameState.player.score}</span>
            </h2>
            <div className={styles.playerContainer}>
              <video
                id="video"
                width={150}
                height={150}
                ref={videoRef}
                className={styles.playerVideo}
                poster={humanImage}
                playsInline
              />

              <div className={styles.playerHandContainer}>
                <img
                  className={styles.playerHand}
                  src={gameState.player.image}
                />
                <svg height="100" width="100">
                  <circle
                    className={styles.timerRingCircle}
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={styles.timerRingCircle}
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.player}>
            <h2 className={styles.playerHeadline}>
              <span className={styles.nick}>Robot</span>
              <span className={styles.score}>{gameState.robot.score}</span>
            </h2>
            <div className={styles.robotContainer}>
              <div className={styles.playerHandContainer}>
                <img
                  className={styles.playerHand}
                  src={gameState.robot.image}
                />
                <svg height="100" width="100">
                  <circle
                    className={styles.timerRingCircle}
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={styles.timerRingCircle}
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="50"
                    cy="50"
                  />
                </svg>
              </div>

              <img className={styles.avatar} src={robotCamer} alt="" />
              <img
                className={styles.robotHand}
                alt=""
                src={gameState.robot.image}
              />
            </div>
          </div>

          <div className={styles.messages}>
            <span className={classNames(styles.messages, styles.fadeInOut)}>
              {gameState.status}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
