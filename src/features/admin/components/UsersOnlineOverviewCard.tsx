import OverviewCard from "./base/OverviewCard";
import { Dot } from "lucide-react";
import NumberFlow from "@number-flow/react";

const UsersOnlineOverviewCard = () => {
  return (
    <>
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

export default UsersOnlineOverviewCard;
