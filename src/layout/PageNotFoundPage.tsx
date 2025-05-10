import humanelogo from "@/assets/humaneSegoeScriptBold.svg";
import { Link, Outlet } from "react-router";

const ErrorPage = () => {
  return (
    <>
      <div className="bg-grey-dark-bg flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <img src={humanelogo} alt="" />
          <p className="text-offwhite mb-5 text-xl">Page not found 😵</p>
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
