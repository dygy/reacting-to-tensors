import HandposePlaneGame from "@base/router/handpose-plane.game";
import { MainPage } from "@base/router/main.page";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/handpose-plane",
    element: <HandposePlaneGame />,
  },
]);
