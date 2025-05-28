import React, { ComponentPropsWithRef } from "react";

const ButtonLowPriority: React.FC<ComponentPropsWithRef<"button">> = ({ className, ...props }) => {
  return (
    <button
      className={`cursor-pointer rounded-full bg-zinc-400/90 px-4 py-1 font-semibold text-black hover:bg-zinc-400 ${className}`}
      {...props}
    ></button>
  );
};

export default ButtonLowPriority;
