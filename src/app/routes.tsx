import { createBrowserRouter } from "react-router";
import AuthLayout from "../features/userAuth/layout/UserAuthLayout";
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
import AdminUserManagementPage from "@/features/adminDashboard/pages/AdminUserManagementPage";
import { adminLoginAuthChekerLoader } from "@/features/adminDashboard/services/loginAuthChecker.loader";
import PageNotFoundPage from "@/layout/PageNotFoundPage";
import HomeLayout from "@/features/home/layout/HomeLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: FadeTransitionLayout,
    children: [
      {
        loader: onStartLoader,
        hydrateFallbackElement: <HumaeLoader />,
        Component: HomeLayout,
        children: [
          { index: true, Component: PageNotFoundPage }, // feed page
          {
            path: "search",
            Component: PageNotFoundPage,
          },
          {
            path: "message",
            Component: PageNotFoundPage,
          },
          {
            path: "notification",
            Component: PageNotFoundPage,
          },
          {
            path: "profile",
            Component: PageNotFoundPage,
          },
          {
            path: "settings",
            Component: PageNotFoundPage,
          },
        ],
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
      { index: true, element: <PageNotFoundPage /> },
      {
        path: "login",
        loader: adminLoginAuthChekerLoader,
        Component: AdminAuthLayout,
        children: [{ index: true, Component: AdminLoginPage }],
      },
      {
        path: "dashboard",
        loader: isAdminAuthenticatedLoader, // inverse of is adminLoginAuthChekerLoader
        hydrateFallbackElement: <HumaeLoader />,
        Component: AdminDashboardLayout,
        children: [
          { index: true, Component: AdminHomePage },
          { path: "home", Component: AdminHomePage },
          {
            path: "user",
            Component: AdminUserManagementPage,
          },
        ],
      },
    ],
  },
  {
    path: "test",
    Component: HomeLayout,
    children: [{ index: true, Component: AdminHomePage }],
  },
]);
