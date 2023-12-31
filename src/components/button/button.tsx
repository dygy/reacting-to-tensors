import classNames from "classnames";

import type { HTMLAttributes, PropsWithChildren } from "react";

import styles from "./button.module.css";
type Props = PropsWithChildren<HTMLAttributes<HTMLButtonElement>> & {
  disabled?: boolean;
  loading?: boolean;
};
export const Button = ({ disabled, loading, ...props }: Props) => {
  return (
    <button
      {...props}
      className={classNames(styles.button, {
        [styles.disabled]: disabled,
        [styles.loading]: loading,
      })}
    >
      {loading === true ? "loading" : props.children}
    </button>
  );
};
