import { createBrowserRouter } from "react-router";
import { publicRoutes } from "./publicRoutes";
import { authRoutes } from "./authRoutes";
import { doctorRoutes } from "./doctorRoutes";
import { recRoutes } from "./recRoutes";
import { patientRoutes } from "./patientRoutes";
import Error404 from "../pages/error/Error404";

export const router = createBrowserRouter([
  publicRoutes,
  authRoutes,
  doctorRoutes,
  recRoutes,
  patientRoutes,
  {
    path: "*",
    element: <Error404 />,
  },
]);
