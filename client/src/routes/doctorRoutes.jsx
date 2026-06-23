import { Navigate } from "react-router";
import DashboardDoc from "../pages/doctor/DashboardDoc";
import HistoryDoc from "../pages/doctor/HistoryDoc";
import LiveSessionDoc from "../pages/doctor/LiveSessionDoc";
import SettingDoc from "../pages/doctor/SettingDoc";
import ProtectedLayout from "../layouts/ProtectedLayout";

export const doctorRoutes = {
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
    {
      path: "settings",
      element: <SettingDoc />,
    },
  ],
};
