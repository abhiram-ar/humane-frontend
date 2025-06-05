import React, { ComponentPropsWithRef } from "react";

const ButtonLowPriority: React.FC<ComponentPropsWithRef<"button">> = ({
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={`rounded-full bg-zinc-400/90 px-4 py-1 font-semibold text-black ${!disabled && "cursor-pointer hover:bg-zinc-400"} ${className} `}
      {...props}
    ></button>
  );
};

export default ButtonLowPriority;
