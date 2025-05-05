import { createBrowserRouter } from "react-router";
import AuthLayout from "../features/userAuth/layout/AuthLayout";
import LoginPage from "../features/userAuth/pages/loginPage";
import SignupPage from "../features/userAuth/pages/SignupPage";
import RecoverPasswordPage from "@/features/userAuth/pages/RecoverPasswordPage";
import ForgotPasswordPage from "@/features/userAuth/pages/ForgotPasswordPage";
import HomePage from "@/features/home/pages/HomePage";
import { onStartLoader } from "@/lib/onStartLoader";
import { isAuthenticatedLoader } from "@/features/userAuth/services/isUserAuthenticatedLoader";
import HumaeLoader from "@/components/HumaeLoader";
import FadeTransitionLayout from "@/layout/FadeTransitionLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: FadeTransitionLayout,
    children: [
      {
        index: true,
        loader: onStartLoader,
        hydrateFallbackElement: <HumaeLoader />,
        Component: HomePage,
      },
      {
        path: "auth",
        loader: isAuthenticatedLoader,
        hydrateFallbackElement: <HumaeLoader />,
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
    ],
  },
  {
    path: "/test",
    Component: HumaeLoader,
  },
]);
