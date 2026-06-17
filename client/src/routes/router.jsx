import { createBrowserRouter } from "react-router";
import Home from '../pages/Home';
import MainLayout from "../layouts/MainLayout";
import Error404 from '../pages/Error404';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            }
        ]
    },
    {
        path: "/auth",
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "signup",
                element: <Signup />
            }
        ]
    },
    {
        path: "*",
        element: <Error404 />
    }
])