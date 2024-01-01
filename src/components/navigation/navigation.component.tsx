import { routes } from "@base/router";

import styles from "./navigation.module.css";

export const NavigationComponent = () => {
  return (
    <header>
      <nav className={styles.nav}>
        <ul className={styles.navContainer}>
          {routes.map((route) => {
            return (
              <li key={route.id} className={styles.navItem}>
                <a className={styles.href} href={route.path}>
                  {route.id}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};
