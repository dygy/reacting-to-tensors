import { routes } from "@base/router";

import styles from "./navigation.module.css";

export const NavigationComponent = () => {
  return (
    <header>
      <nav className={styles.nav}>
        <ul className={styles.navContainer}>
          {routes.map((route) => {
            return (
              <a className={styles.href} href={route.path}>
                <li key={route.id} className={styles.navItem}>
                  {route.id}
                </li>
              </a>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};
