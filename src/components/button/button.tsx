import styles from "./button.module.css";
import type { HTMLAttributes, PropsWithChildren } from "react";
import classNames from "classnames";
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
      {loading ? "loading" : props.children}
    </button>
  );
};
