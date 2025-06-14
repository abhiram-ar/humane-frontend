import React, { ComponentPropsWithRef } from "react";

const ButtonPop: React.FC<ComponentPropsWithRef<"button">> = ({ className, ...props }) => {
  return (
    <button
      className={`bg-pop-green/95 hover:bg-pop-green cursor-pointer rounded-full px-4 py-1 font-semibold text-black disabled:cursor-not-allowed disabled:bg-zinc-400 ${className}`}
      {...props}
    ></button>
  );
};

export default ButtonPop;
