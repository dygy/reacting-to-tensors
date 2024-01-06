import { PropsWithChildren } from "react";

import styles from "./space.module.scss";
export const SpaceBackground = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.container}>
      <div className={styles.stars}></div>
      <div className={styles.stars2}></div>
      <div className={styles.stars3}></div>
      {children}
    </div>
  );
};
