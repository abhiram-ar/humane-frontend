import { createBrowserRouter } from "react-router";
import AuthLayout from "../features/userAuth/layout/AuthLayout";
import Signup from "../features/userAuth/components/Singup";
import Login from "../features/userAuth/components/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>home</div>,
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        path: "signup",
        Component: Signup,
      },
      {
        path: "login",
        Component: Login,
      },
    ],
  },
  {
    path: "/test",
    Component: AuthLayout,
  },
]);
