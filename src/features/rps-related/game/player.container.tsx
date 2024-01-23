import { humanImage } from "@features/rps-related/game/assets";
import styles from "@features/rps-related/game/game.module.css";
import classNames from "classnames";

import { forwardRef, Ref } from "react";

type Props = {
  score: number;
  name: string;
  poster: typeof humanImage;
  moveImage: string | undefined;
  isNotResolvedMove: boolean;
  isWon: boolean;
};
export const PlayerContainer = forwardRef(
  (
    { score, name, poster, moveImage, isNotResolvedMove, isWon }: Props,
    ref: Ref<HTMLVideoElement>,
  ) => {
    return (
      <div
        className={classNames(styles.player, {
          [styles.focus]: isWon,
        })}
      >
        <h2 className={styles.playerHeadline}>
          <span className={styles.nick}>{name}</span>
          <span
            className={classNames(styles.score, {
              [styles.fadeInOut]: isWon,
            })}
          >
            {score}
          </span>
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

          <div
            className={classNames(styles.playerHandContainer, {
              [styles.fadeInOut]: isNotResolvedMove,
            })}
          >
            {moveImage != null && (
              <>
                <img className={styles.playerHand} src={moveImage} alt={name} />
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
