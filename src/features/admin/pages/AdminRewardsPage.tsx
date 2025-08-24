import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import RewardOverviewContainer from "../components/RewardOverviewContainer";
import TableRowShimmer from "../components/TableRowShimmer";
import { useState } from "react";
import { IQueryFilter } from "../types/QueryFilter";
import TableNoItemRow from "../components/TableNoItemRow";
import Pagination from "../components/Pagination";
import EditRewardConfigButton from "../components/EditRewardConfigButton";
import TableSearch from "../components/TableSearch";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { GetUsersScoreResponse } from "../types/GetUserRewardListResponse";
import UserReardTableRow from "../components/UserRewardTableRow";
import { API_ROUTES } from "@/lib/API_ROUTES";

const AdminRewardsPage = () => {
  const [filter, setFilter] = useState<IQueryFilter>({ search: "", page: 1, limit: 9 });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-user-rewards-list", { search: filter.search, page: filter.page }],
    queryFn: async () => {
      const response = await api.get<GetUsersScoreResponse>(`${API_ROUTES.REWARD_ROUTE}/list`, {
        params: { search: filter.search, page: filter.page, limit: filter.limit },
      });
      return response.data.data;
    },

    staleTime: 60 * 1000,
    refetchOnMount: false,
  });
  return (
    <div>
      <h2 className="text-almost-white mb-5 font-sans text-2xl font-semibold">
        Rewards management
      </h2>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <RewardOverviewContainer />
      </div>

      <div className="mb-2 flex justify-between">
        <TableSearch search={filter.search} setFilter={setFilter} />
        <EditRewardConfigButton />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="">Name</TableHead>
            <TableHead className="w-40">Total Rewarded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRowShimmer rows={filter.limit} colSpan={7} />}

          {data &&
            data.rewards.length > 0 &&
            data.rewards.map((reward) => <UserReardTableRow key={reward.userId} reward={reward} />)}

          {filter.limit - (data?.rewards.length ?? 0) > 0 &&
            Array(filter.limit - (data?.rewards.length || 0))
              .fill(undefined)
              .map((_, i) =>
                data?.rewards.length === 0 && i === 0 ? (
                  <TableNoItemRow colSpan={7} message="No user found" />
                ) : (
                  <TableNoItemRow key={i} className="text-transparent" colSpan={7} message="." />
                ),
              )}

          {isError && <TableNoItemRow colSpan={7} message="Something went wrong" />}
        </TableBody>
      </Table>

      {data?.pagination && (
        <Pagination
          filter={filter}
          setFilter={setFilter}
          totalPages={data.pagination?.totalPages}
        />
      )}
    </div>
  );
};

export default AdminRewardsPage;
