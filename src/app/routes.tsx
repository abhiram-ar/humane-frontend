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
import AdminAuthLayout from "@/features/userAuth/layout/AdminAuthLayout";
import AdminLoginPage from "@/features/userAuth/pages/AdminLoginPage";
import AdminDashboardLayout from "@/features/adminDashboard/layout/AdminDashboardLayout";
import AdminHomePage from "@/features/adminDashboard/pages/AdminHomePage";
import { isAdminAuthenticatedLoader } from "@/features/adminDashboard/services/isAdminAuthenticatedLoader";

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
    path: "/admin",
    children: [
      {
        path: "login",
        Component: AdminAuthLayout,
        children: [{ index: true, Component: AdminLoginPage }],
      },
      {
        path: "dashboard",
        loader: isAdminAuthenticatedLoader,
        hydrateFallbackElement: <HumaeLoader />,
        Component: AdminDashboardLayout,
        children: [
          { index: true, Component: AdminHomePage },
          {
            path: "home",
            Component: AdminHomePage,
          },
        ],
      },
    ],
  },
]);
