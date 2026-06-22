import Home from "../pages/public/Home";
import MainLayout from "../layouts/MainLayout";

export const publicRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <Home />,
    },
  ],
};
