import OverviewCard from "./base/OverviewCard";
import { Dot } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { GetUsersOnlineResponse } from "../types/GetUsersOnlineResponse";

const UsersOnlineOverviewCard = () => {
  const { data } = useQuery({
    queryKey: ["admin-users-online-count"],
    queryFn: async () => {
      const res = await api.get<GetUsersOnlineResponse>(
        `${API_ROUTES.NOTIFICATION_SERVICE}/admin/users-online/count`,
      );
      return res.data.data;
    },
  });

  return (
    <>
      <OverviewCard title="Users Online">
        <div className="mx-auto flex items-center gap-1">
          <div className="relative mt-1 aspect-square rounded-full">
            <Dot className="text-pop-green scale-150" />
            <div className="in bg-pop-green/50 absolute inset-0 animate-pulse rounded-full"></div>
          </div>
          <NumberFlow
            className="text-pop-green text-2xl font-semibold"
            value={data?.usersOnline || 0}
          />
        </div>
      </OverviewCard>
    </>
  );
};

export default UsersOnlineOverviewCard;
