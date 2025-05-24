import humanelogo from "@/assets/humaneSegoeScriptBold.svg";
import React from "react";
import { Link, Outlet } from "react-router";

type Props = {
  message?: string;
};
const ErrorPage: React.FC<Props> = ({ message = "Page not found 😵" }) => {
  return (
    <>
      <div className="bg-grey-dark-bg flex h-screen w-full items-center justify-center">
        <div className="-mt-30 text-center">
          <img src={humanelogo} alt="" />
          <p className="text-offwhite mb-5 text-xl">{message}</p>
          <Link
            to="/"
            className="bg-pop-green/95 hover:bg-pop-green rounded-3xl px-5 py-2 font-semibold"
            replace={true}
          >
            Go Home
          </Link>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default ErrorPage;
