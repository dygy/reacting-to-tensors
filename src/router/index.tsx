import { createBrowserRouter } from "react-router-dom";

import HandposePlaneGame from "@base/router/handpose-plane.game";
import { MainPage } from "@base/router/main.page";

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
