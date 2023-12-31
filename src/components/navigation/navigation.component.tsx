import styles from "./navigation.module.css";

export const NavigationComponent = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navContainer}>
        <li className={styles.navItem}>
          <a className={styles.href} href="/">
            main page
          </a>
        </li>
        <li className={styles.navItem}>
          <a className={styles.href} href="/handpose-plane">
            hand-pose plane game
          </a>
        </li>
      </ul>
    </nav>
  );
};
