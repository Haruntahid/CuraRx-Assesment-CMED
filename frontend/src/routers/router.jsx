import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import MainLayout from "../layout/MainLayout";
import Overview from "../pages/Overview";
import Prescription from "../pages/Prescription";
import CreatePrescription from "../pages/CreatePrescription";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Overview />,
      },
      {
        path: "/prescription",
        element: <Prescription />,
      },
      {
        path: "/create-prescription",
        element: <CreatePrescription />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
