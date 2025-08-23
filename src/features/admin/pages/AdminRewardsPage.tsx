import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import RewardOverviewContainer from "../components/RewardOverviewContainer";
import TableRowShimmer from "../components/TableRowShimmer";
import { useUserListQuery } from "../hooks/useUserListQuery";
import { useState } from "react";
import { IQueryFilter } from "../types/QueryFilter";
import TableNoItemRow from "../components/TableNoItemRow";
import Pagination from "../components/Pagination";
import UserManagementRow from "../components/UserManagementRow";
import EditRewardConfigButton from "../components/EditRewardConfigButton";

const AdminRewardsPage = () => {
  const [filter, setFilter] = useState<IQueryFilter>({ search: "", page: 1, limit: 9 });

  const { data, isLoading, isError } = useUserListQuery(filter);

  const handleToogleBlock = () => {};
  return (
    <div>
      <h2 className="text-almost-white mb-5 font-sans text-2xl font-semibold">
        Rewards management
      </h2>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <RewardOverviewContainer />
      </div>

      <div className="mb-2 flex justify-end">
        <EditRewardConfigButton />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-64">Name</TableHead>
            <TableHead className="w-80">Email</TableHead>
            <TableHead>Post Rewards</TableHead>
            <TableHead>Chat Rewards</TableHead>
            <TableHead>Total Rewarded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRowShimmer rows={filter.limit} colSpan={7} />}

          {data && data.data.users?.length > 0 ? (
            data.data.users.map((user) => (
              <UserManagementRow key={user.id} user={user} handleToogleBlock={handleToogleBlock} />
            ))
          ) : (
            <TableNoItemRow colSpan={7} message="No user found" />
          )}

          {isError && <TableNoItemRow colSpan={7} message="Something went wrong" />}
        </TableBody>
      </Table>

      {data?.data && (
        <Pagination
          filter={filter}
          setFilter={setFilter}
          totalPages={data.data.pagination?.totalPages}
        />
      )}
    </div>
  );
};

export default AdminRewardsPage;
