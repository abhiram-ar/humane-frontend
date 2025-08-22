import React, { ComponentPropsWithoutRef } from "react";

type Prosp = {
  title: string;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<"div">;
const OverviewCard: React.FC<Prosp> = ({ children, className, title, ...props }) => {
  return (
    <div
      {...props}
      className={`bg-[#313131] hover:border-pop-green rounded-2xl border border-zinc-500/50 p-4 text-white transition-colors duration-100 ease-out  ${className}`}
    >
      <h3 className="text-offwhite/80 text-lg mb-2">{title}</h3>
      {children}
    </div>
  );
};

export default OverviewCard;
