import NumberFlow from "@number-flow/react";
import OverviewCard from "./base/OverviewCard";
import { Dot } from "lucide-react";

const UserOverviewContainer = () => {
  return (
    <>
      <OverviewCard title="New Signups" className="col-span-3">
        <p></p>
      </OverviewCard>

      <OverviewCard title="Login in last 24hrs">
        <div className="mx-auto flex flex-col justify-center">
          <NumberFlow className="text-2xl font-bold" value={100} />
          <p className="text-zinc-400">20% increase from last month</p>
        </div>
      </OverviewCard>
      <OverviewCard title="Total users">
        <div className="mx-auto flex flex-col justify-center">
          <NumberFlow className="text-2xl font-bold" value={100} />
          <p className="text-zinc-400">20% increase from last month</p>
        </div>
      </OverviewCard>
      <OverviewCard title="Users Online">
        <div className="mx-auto flex items-center gap-1">
          <div className="relative mt-1 aspect-square rounded-full">
            <Dot className="text-pop-green scale-150" />
            <div className="in bg-pop-green/50 absolute inset-0 animate-pulse rounded-full"></div>
          </div>
          <NumberFlow className="text-pop-green text-2xl font-semibold" value={100} />
        </div>
      </OverviewCard>
    </>
  );
};

export default UserOverviewContainer;
