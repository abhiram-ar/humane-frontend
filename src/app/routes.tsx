import { createBrowserRouter } from "react-router";
import AuthLayout from "../features/userAuth/layout/UserAuthLayout";
import LoginPage from "../features/userAuth/pages/loginPage";
import SignupPage from "../features/userAuth/pages/SignupPage";
import RecoverPasswordPage from "@/features/userAuth/pages/RecoverPasswordPage";
import ForgotPasswordPage from "@/features/userAuth/pages/ForgotPasswordPage";
import { onStartLoader } from "@/lib/onStartLoader";
import { isAuthenticatedLoader } from "@/features/userAuth/services/isUserAuthenticatedLoader";
import HumaeLoader from "@/components/HumaeLoader";
import FadeTransitionLayout from "@/layout/FadeTransitionLayout";
import AdminAuthLayout from "@/features/userAuth/layout/AdminAuthLayout";
import AdminLoginPage from "@/features/userAuth/pages/AdminLoginPage";
import PageNotFoundPage from "@/layout/PageNotFoundPage";
import HomeLayout from "@/features/home/layout/HomeLayout";
import { adminLoginAuthChekerLoader } from "@/features/admin/services/loginAuthChecker.loader";
import { isAdminAuthenticatedLoader } from "@/features/admin/services/isAdminAuthenticatedLoader";
import AdminDashboardLayout from "@/features/admin/layout/AdminDashboardLayout";
import AdminHomePage from "@/features/admin/pages/AdminHomePage";
import AdminUserManagementPage from "@/features/admin/pages/AdminUserManagementPage";
import CurrentUserProfilePage from "@/features/profile/pages/CurrentUserProfilePage";
import SearchPage from "@/features/search/pages/SearchPage";
import PubliicUserProfile from "@/features/profile/pages/PublicUserProfile";
import NotificationPage from "@/features/notification/pages/NotificationPage";
import HomePage from "@/features/home/pages/HomePage";
import PostPage from "@/features/home/pages/PostPage";

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
          { index: true, Component: HomePage }, // feed page
          {
            path: "search",
            Component: SearchPage,
          },
          {
            path: "message",
            Component: PageNotFoundPage,
          },
          {
            path: "notification",
            Component: NotificationPage,
          },
          {
            path: "profile",
            Component: CurrentUserProfilePage,
          },
          {
            path: "settings",
            Component: PageNotFoundPage,
          },
          {
            path: "user",
            children: [
              { index: true, Component: PageNotFoundPage },
              {
                path: ":userId",
                Component: PubliicUserProfile,
              },
            ],
          },
          {
            path: "post",
            children: [
              { index: true, Component: PageNotFoundPage },
              {
                path: ":postId",
                Component: PostPage,
              },
            ],
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
          {
            path: "reports",
            Component: PageNotFoundPage,
          },
        ],
      },
    ],
  },
  {
    path: "test",
    Component: HomeLayout,
    children: [{ index: true, Component: PubliicUserProfile }],
  },
]);
