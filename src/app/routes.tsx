import { createBrowserRouter } from "react-router";
import AuthLayout from "../features/userAuth/layout/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>home</div>,
  },
  {
    path: "/test",
    Component: AuthLayout,
  },
]);
