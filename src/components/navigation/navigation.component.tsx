import { routes } from "@base/router";
import classNames from "classnames";

import styles from "./navigation.module.css";

export const NavigationComponent = () => {
  return (
    <header>
      <nav className={styles.nav}>
        <ul className={styles.navContainer}>
          {routes.map((route) => {
            return (
              <a
                key={route.id}
                className={classNames(styles.href, {
                  [styles.active]: window.location.pathname === route.path,
                })}
                href={route.path}
              >
                <li className={styles.navItem}>{route.id}</li>
              </a>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};
