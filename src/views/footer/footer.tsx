import styles from "./footer.module.css";
import { Button } from "@components/button/button";
import { useButtonActions } from "@controls/hooks";

export const Footer = ({
  buttonActions,
}: {
  buttonActions: ReturnType<typeof useButtonActions>;
}) => {
  return (
    <div className={styles.footer}>
      <Button
        {...buttonActions.buttonState.left}
        onClick={() => buttonActions.submitButton("left")}
      >
        Left
      </Button>
      <Button
        {...buttonActions.buttonState.right}
        onClick={() => buttonActions.submitButton("right")}
      >
        Right
      </Button>
    </div>
  );
};
