import React, { ComponentPropsWithoutRef } from "react";

type Prosp = {
  title: string;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<"div">;
const OverviewCard: React.FC<Prosp> = ({ children, className, title, ...props }) => {
  return (
    <div
      {...props}
      className={`bg-grey-light/90 hover:bg-grey-light shadow-pop-green rounded-2xl border border-zinc-400/50 p-4 text-white transition-shadow duration-100 ease-out hover:shadow-[0_5px_20px_-8px_rgba(0,0,0,0.3)] ${className}`}
    >
      <h3 className="text-offwhite/80 text-lg mb-2">{title}</h3>
      {children}
    </div>
  );
};

export default OverviewCard;
