import { Navigate } from "react-router";
import TrackPatientPage from "../pages/public/patient/TrackPatientPage";
import PatientDashboardPage from "../pages/public/patient/PatientDashboardPage";

export const patientRoutes = {
  path: "/patient",
  children: [
    {
      index: true,
      element: <Navigate to="/patient/track" replace />,
    },
    {
      path: "track",
      element: <TrackPatientPage />,
    },
    {
      path: "track/:trackingId",
      element: <PatientDashboardPage />,
    },
  ],
};
