import { createBrowserRouter } from "react-router";
import AuthLayout from "../features/userAuth/layout/AuthLayout";
import LoginPage from "../features/userAuth/pages/loginPage";
import SignupPage from "../features/userAuth/pages/SignupPage";

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
        Component: SignupPage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
    ],
  },
  {
    path: "/test",
    Component: AuthLayout,
  },
]);
