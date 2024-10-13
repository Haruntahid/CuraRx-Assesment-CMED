import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import MainLayout from "../layout/MainLayout";
import Overview from "../pages/Overview";
import Prescription from "../pages/Prescription";
import CreatePrescription from "../pages/CreatePrescription";
import PrivateRoute from "./PrivateRoute";
import PrescriptionDetails from "../pages/PrescriptionDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
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
        path: "/prescription/:id",
        element: <PrescriptionDetails />,
        loader: ({ params }) =>
          fetch(`http://localhost:8000/all-prescription/${params.id}`),
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
