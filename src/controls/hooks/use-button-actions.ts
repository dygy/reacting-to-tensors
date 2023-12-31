import { debounce } from "lodash";

import { useState } from "react";

export const useButtonActions = () => {
  const [buttonState, setButtonState] = useState({
    left: {
      loading: false,
      disabled: false,
    },
    right: {
      loading: false,
      disabled: false,
    },
  });
  const submitButton = debounce((which: "left" | "right") => {
    setButtonState((prevState) => ({
      ...prevState,
      [which]: {
        disabled: false,
        loading: true,
      },
    }));

    setTimeout(() => {
      setButtonState((prevState) => ({
        ...prevState,
        [which]: {
          disabled: false,
          loading: false,
        },
      }));
    }, 1400);
  }, 300);
  return {
    buttonState,
    submitButton,
  };
};
