import { humanImage } from "@features/rps-related/game/assets";
import styles from "@features/rps-related/game/game.module.css";

import { forwardRef, Ref } from "react";

type Props = {
  score: number;
  name: string;
  poster: typeof humanImage;
  moveImage: string | undefined;
};
export const PlayerContainer = forwardRef(
  ({ score, name, poster, moveImage }: Props, ref: Ref<HTMLVideoElement>) => {
    return (
      <div className={styles.player}>
        <h2 className={styles.playerHeadline}>
          <span className={styles.nick}>{name}</span>
          <span className={styles.score}>{score}</span>
        </h2>
        <div className={styles.playerContainer}>
          <video
            width={150}
            height={150}
            ref={ref}
            className={styles.playerVideo}
            poster={poster}
            playsInline
          />

          <div className={styles.playerHandContainer}>
            {moveImage != null && (
              <>
                <img className={styles.playerHand} src={moveImage} />
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
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);
