import { createBrowserRouter } from "react-router";
import { publicRoutes } from "./publicRoutes";
import { authRoutes } from "./authRoutes";
import { doctorRoutes } from "./doctorRoutes";
import { recRoutes } from "./recRoutes";
import Error404 from "../pages/error/Error404";

export const router = createBrowserRouter([
  publicRoutes,
  authRoutes,
  doctorRoutes,
  recRoutes,
  {
    path: "*",
    element: <Error404 />,
  },
]);
