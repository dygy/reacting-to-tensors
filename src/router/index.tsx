import { EyeContactasinoGame } from "@base/router/eye-contactasino.game";
import HandposePlaneGame from "@base/router/handpose-plane.game";
import { MainPage } from "@base/router/main.page";
import { RockPaperScissorsGame } from "@base/router/rock-paper-scissors.game";
import { createBrowserRouter } from "react-router-dom";

export const routes = [
  {
    path: "/",
    id: "home page",
    element: <MainPage />,
  },
  {
    path: "/handpose-plane",
    element: <HandposePlaneGame />,
    id: "hand-pose plane",
  },
  {
    path: "/rock-paper-scissors",
    element: <RockPaperScissorsGame />,
    id: "rock paper scissors",
  },
  {
    path: "/eye-contactasino",
    element: <EyeContactasinoGame />,
    id: "eye contactasino",
  },
];
export const router = createBrowserRouter(routes);
