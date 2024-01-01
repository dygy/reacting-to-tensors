import {
  paperImage,
  rockImage,
  scissorsImage,
} from "@features/rps-related/game/assets";
import config from "@features/rps-related/game/config";
import { handPoseDrawer } from "@features/rps-related/handpose/hand-pose.drawer";

import { useEffect, useState } from "react";

type Move = "rock" | "paper" | "scissors";
type GameState = Record<
  "player" | "robot",
  {
    score: number;
    moves: Array<Move>;
    image?: typeof rockImage;
  }
> & {
  status: string;
};
export const enum STATUSES {
  LOADING = "Loading",
  START = "On your marks",
  READY = "Ready",
  PLAY = "Show your hand!",
  NONE = "No one won this time",
  PLAYER_WON = "Player won this time",
  ROBOT_WON = "Robot won this time",
}
export const useGameHook = (videoRef: HTMLVideoElement | null) => {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      score: 0,
      moves: [],
    },
    robot: {
      score: 0,
      moves: [],
    },
    status: STATUSES.LOADING,
  });

  const makeResults = (playerMove: Move, robotMove: Move) => {
    if (playerMove === robotMove) {
      setNewMessage(STATUSES.NONE);
    } else {
      let won: "robot" | "player" = "robot";
      if (robotMove === "paper" && playerMove === "rock") {
        won = "robot";
      }
      if (robotMove === "paper" && playerMove === "scissors") {
        won = "player";
      }
      if (robotMove === "scissors" && playerMove === "rock") {
        won = "player";
      }
      if (robotMove === "scissors" && playerMove === "paper") {
        won = "robot";
      }
      if (robotMove === "rock" && playerMove === "scissors") {
        won = "robot";
      }
      if (robotMove === "rock" && playerMove === "paper") {
        won = "player";
      }
      setNewMessage(won === "robot" ? STATUSES.ROBOT_WON : STATUSES.PLAYER_WON);
      setGameState((currentState) => ({
        ...currentState,
        ...(won === "robot"
          ? {
              robot: {
                ...currentState.robot,
                score: currentState.robot.score + 1,
              },
            }
          : {
              player: {
                ...currentState.player,
                score: currentState.player.score + 1,
              },
            }),
      }));
    }
  };
  const makeMove = (move: Move, isRobot?: boolean) => {
    let image = rockImage;
    switch (move) {
      case "paper":
        image = paperImage;
        break;
      case "rock":
        image = rockImage;
        break;
      case "scissors":
        image = scissorsImage;
        break;
    }
    setGameState((currentState) => {
      if (isRobot === true) {
        makeResults(currentState.player.moves[0], move);
      }
      return {
        ...currentState,
        ...(isRobot === true
          ? {
              robot: {
                score: gameState.robot.score,
                moves: [move, ...gameState.robot.moves],
                image,
              },
            }
          : {
              player: {
                score: gameState.player.score,
                moves: [move, ...gameState.player.moves],
                image,
              },
            }),
      };
    });
  };

  const detectPlayerGesture = (requiredDuration) => {
    let lastGesture = "";
    let gestureDuration = 0;

    const predictNonblocking = () => {
      setTimeout(() => {
        const predictionStartTS = Date.now();
        if (!videoRef) {
          return;
        }
        setNewMessage(STATUSES.PLAY);
        // predict gesture (require high confidence)
        handPoseDrawer.predictGesture(videoRef, 9).then((playerGesture) => {
          if (playerGesture !== "") {
            if (playerGesture === lastGesture) {
              // player keeps holding the same gesture
              // -> keep timer running
              const deltaTime = Date.now() - predictionStartTS;
              gestureDuration += deltaTime;
            } else {
              // detected a different gesture
              // -> reset timer
              lastGesture = playerGesture;
              makeMove(playerGesture as Move);
              gestureDuration = 0;
            }
          } else {
            lastGesture = "";
            gestureDuration = 0;
          }

          if (gestureDuration < requiredDuration) {
            // update timer and repeat
            predictNonblocking();
          } else {
            // let computer make its move
            const computerGesture = getRandomGesture();
            makeMove(computerGesture, true);
          }
        });
      }, 0);
    };

    predictNonblocking();
  };
  const setNewMessage = (message: STATUSES) => {
    setGameState((currentState) => ({
      ...currentState,
      status: message,
    }));
  };

  useEffect(() => {
    if (videoRef) {
      Promise.all([initPlayerVideo(videoRef), handPoseDrawer.init()]).then(
        () => {
          setNewMessage(STATUSES.START);
          detectPlayerGesture(150);
        },
      );
    }
  }, [videoRef]);

  return { gameState, makeMove };
};

const initPlayerVideo = async (playerRef: HTMLVideoElement) => {
  // get cam video stream
  playerRef.srcObject = await navigator.mediaDevices.getUserMedia(config);

  return new Promise((resolve) => {
    playerRef.onloadedmetadata = () => {
      playerRef.onloadeddata = () => {
        playerRef.play().then(() => {
          resolve(playerRef);
        });
      };
    };
  });
};

function getRandomGesture(): Move {
  const gestures: Array<Move> = ["rock", "paper", "scissors"];
  const randomNum = Math.floor(Math.random() * gestures.length);
  return gestures[randomNum];
}
