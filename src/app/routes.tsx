import { createBrowserRouter } from "react-router";
import AuthLayout from "../features/userAuth/layout/AuthLayout";
import LoginPage from "../features/userAuth/pages/loginPage";
import SignupPage from "../features/userAuth/pages/SignupPage";
import RecoverPasswordPage from "@/features/userAuth/pages/RecoverPasswordPage";
import ForgotPasswordPage from "@/features/userAuth/pages/ForgotPasswordPage";

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
      {
        path: "forgot-password",
        Component: ForgotPasswordPage,
      },
      {
        path: "recover-password",
        Component: RecoverPasswordPage,
      },
    ],
  },
  {
    path: "/test",
    Component: AuthLayout,
  },
]);
