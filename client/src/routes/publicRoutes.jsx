import Home from "../pages/public/Home";
import MainLayout from "../layouts/MainLayout";
import { patientRoutes } from "./patientRoutes";
import { legalRoutes } from "./legalRoutes";

export const publicRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <Home />,
    },
    patientRoutes,
    legalRoutes,
  ],
};
