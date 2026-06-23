import { Navigate } from "react-router";
import DashboardRec from "../pages/receptionist/DashboardRec";
import ManagePatientRec from "../pages/receptionist/ManagePatientRec";
import HistoryRec from "../pages/receptionist/HistoryRec";
import SettingRec from "../pages/receptionist/SettingRec";
import ProtectedLayout from "../layouts/ProtectedLayout";

export const recRoutes = {
  path: "/rec",
  element: <ProtectedLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: "dashboard",
      element: <DashboardRec />,
    },
    {
      path: "manage-patient",
      element: <ManagePatientRec />,
    },
    {
      path: "history",
      element: <HistoryRec />,
    },
    {
      path: "settings",
      element: <SettingRec />,
    },
  ],
};
