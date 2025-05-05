import { createBrowserRouter } from "react-router";
import AuthLayout from "../features/userAuth/layout/AuthLayout";
import LoginPage from "../features/userAuth/pages/loginPage";
import SignupPage from "../features/userAuth/pages/SignupPage";
import RecoverPasswordPage from "@/features/userAuth/pages/RecoverPasswordPage";
import ForgotPasswordPage from "@/features/userAuth/pages/ForgotPasswordPage";
import HomePage from "@/features/home/pages/HomePage";
import { onStartLoader } from "@/lib/onStartLoader";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: onStartLoader,
    hydrateFallbackElement: <div>loading</div>,
    Component: HomePage,
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "signup",
        Component: SignupPage,
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
