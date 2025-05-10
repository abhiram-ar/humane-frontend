import { useState } from "react";
import { User } from "../types/userManagement.types";
import UserManagementRow from "../components/UserManagementRow";
import TableSearch from "../components/TableSearch";
import { IQueryFilter } from "../types/QueryFilter";
import { useUserListQuery } from "../hooks/useUserListQuery";
import { useUserMutation } from "../hooks/userUserMutation";
import Pagination from "../components/Pagination";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import TableRowShimmer from "../components/TableRowShimmer";
import TableNoItemRow from "../components/TableNoItemRow";
import Refresh from "../components/Refresh";

const AdminUserManagementPage = () => {
  const [filter, setFilter] = useState<IQueryFilter>({ search: "", page: 1, limit: 11 });

  const { data, isLoading, isError, isRefetching, refetch } = useUserListQuery(filter);
  const { mutate: mutateUser } = useUserMutation(filter);

  const handleToogleBlock = (user: User) => {
    mutateUser({ userId: user.id, newBlockStatus: !user.isBlocked });
  };

  return (
    <div>
      <h2 className="text-almost-white mb-10 font-sans text-2xl font-semibold">User management</h2>
      <div>
        <div className="mb-2 flex justify-between">
          <TableSearch search={filter.search} setFilter={setFilter} />
          <Refresh isRefreshing={isRefetching} refetch={refetch} />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-64">Name</TableHead>
              <TableHead className="w-80">Email</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>isHotUser</TableHead>
              <TableHead>Humane Score</TableHead>
              <TableHead>isBlocked</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRowShimmer rows={filter.limit} colSpan={7} />}

            {data && data.data.users?.length > 0 ? (
              data.data.users.map((user) => (
                <UserManagementRow
                  key={user.id}
                  user={user}
                  handleToogleBlock={handleToogleBlock}
                />
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
    </div>
  );
};

export default AdminUserManagementPage;
