import { createBrowserRouter } from "react-router";
import Home from '../pages/Home';
import MainLayout from "../layouts/MainLayout";
import Error404 from '../pages/Error404';

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
        path: "*",
        element: <Error404 />
    }
])