import { RefetchOptions } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";

type props = {
  isRefreshing: boolean;
  refetch: (options?: RefetchOptions) => Promise<unknown>;
};
const Refresh: React.FC<props> = ({ isRefreshing = true, refetch }) => {
  return (
    <div className="flex items-center gap-1">
      <Loader
        className={`text-offwhite ${isRefreshing ? "animate-spin opacity-100 transition-all duration-100 ease-in-out" : "animate-none opacity-0"}`}
      />
      <button
        disabled={isRefreshing}
        onClick={() => refetch()}
        className="bg-grey-light hover:bg-pop-green rounded-xl px-5 py-1 text-white hover:text-black disabled:bg-zinc-600 disabled:text-zinc-900"
      >
        {" "}
        refresh
      </button>
    </div>
  );
};

export default Refresh;
