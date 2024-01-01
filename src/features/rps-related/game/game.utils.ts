export type Move = "rock" | "paper" | "scissors";

export function gameLogic(firstValue: Move, secondValue: Move): 0 | 1 | 2 {
  if (firstValue === secondValue) {
    return 0;
  }
  if (firstValue === "paper" && secondValue === "rock") {
    return 1;
  }
  if (firstValue === "scissors" && secondValue === "paper") {
    return 1;
  }
  if (firstValue === "rock" && secondValue === "scissors") {
    return 1;
  }
  if (firstValue === "paper" && secondValue === "scissors") {
    return 2;
  }
  if (firstValue === "scissors" && secondValue === "rock") {
    return 2;
  }
  if (firstValue === "rock" && secondValue === "paper") {
    return 2;
  }
  return 0;
}

export function getRandomMove(): Move {
  const gestures: Array<Move> = ["rock", "paper", "scissors"];
  const randomNum = Math.floor(Math.random() * gestures.length);
  return gestures[randomNum];
}
