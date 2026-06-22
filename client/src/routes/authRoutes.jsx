import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

export const authRoutes = {
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
};
