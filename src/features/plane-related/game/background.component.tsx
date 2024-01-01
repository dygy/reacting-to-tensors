import classNames from "classnames";

import styles from "./game.module.css";

export const BackgroundComponent = () => {
  return (
    <div className={styles.content}>
      <div className={styles.paralax}>
        <div className={classNames(styles.layer, styles.rocks2)}></div>
        <div className={classNames(styles.layer, styles.rocks1)}></div>
        <div className={classNames(styles.layer, styles.hills)}></div>
        <div className={classNames(styles.layer, styles.foreground)}></div>
      </div>
    </div>
  );
};
