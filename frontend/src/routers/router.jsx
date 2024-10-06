import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
