import React, { ComponentPropsWithoutRef } from "react";

const ButtonNeutal: React.FC<ComponentPropsWithoutRef<"button">> = ({ className, ...props }) => {
  return (
    <button
      className={`bg-offwhite cursor-pointer rounded-full px-4 py-1 font-semibold text-black hover:bg-white ${className}`}
      {...props}
    ></button>
  );
};

export default ButtonNeutal;
