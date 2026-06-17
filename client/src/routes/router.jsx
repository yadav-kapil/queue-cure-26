import { createBrowserRouter } from "react-router";
import Home from '../pages/Home';
import MainLayout from "../layouts/MainLayout";
import Error404 from '../pages/Error404';
import Login from '../pages/Login';

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
            }
        ]
    },
    {
        path: "*",
        element: <Error404 />
    }
])