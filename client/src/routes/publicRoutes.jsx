import Home from "../pages/public/Home";
import MainLayout from "../layouts/MainLayout";
import { patientRoutes } from "./patientRoutes";
import { legalRoutes } from "./legalRoutes";
import ChangelogPage from "../pages/public/blog/ChangelogPage";
import ChangelogDetail from "../pages/public/blog/ChangelogDetail";

export const publicRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: "blog",
      element: <ChangelogPage />,
    },
    {
      path: "blog/:id",
      element: <ChangelogDetail />,
    },
    patientRoutes,
    legalRoutes,
  ],
};
