import { createBrowserRouter } from "react-router";
import { publicRoutes } from "./publicRoutes";
import { authRoutes } from "./authRoutes";
import { doctorRoutes } from "./doctorRoutes";
import { recRoutes } from "./recRoutes";
import Error404 from "../pages/error/Error404";
import InternalServerError from "../pages/error/InternalServerError";

const routeGroups = [
  publicRoutes,
  authRoutes,
  doctorRoutes,
  recRoutes,
].map((route) => ({
  ...route,
  errorElement: <InternalServerError />,
}));

export const router = createBrowserRouter([
  ...routeGroups,
  {
    path: "*",
    element: <Error404 />,
  },
]);

