import { createBrowserRouter, Navigate } from "react-router";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import Error404 from "../pages/Error404";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedLayout from "../layouts/ProtectedLayout";
import DashboardDoc from "../pages/doctor/DashboardDoc";
import HistoryDoc from "../pages/doctor/HistoryDoc";
import LiveSessionDoc from "../pages/doctor/LiveSessionDoc";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/doctor",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardDoc />,
      },
      {
        path: "live-session",
        element: <LiveSessionDoc />,
      },
      {
        path: "history",
        element: <HistoryDoc />,
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);
