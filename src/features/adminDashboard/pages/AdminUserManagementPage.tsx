import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useState } from "react";
import { User } from "../types/userManagement.types";
import UserManagementRow from "../components/UserManagementRow";
import TableSearch from "../components/TableSearch";
import { IQueryFilter } from "../types/QueryFilter";
import { useUserListQuery } from "../hooks/useUserListQuery";
import { useUserMutation } from "../hooks/userUserMutation";
import Pagination from "../components/Pagination";

const AdminUserManagementPage = () => {
  const [filter, setFilter] = useState<IQueryFilter>({ search: "", page: 1, limit: 13 });

  const { data, isLoading } = useUserListQuery(filter);

  const { mutate: mutateUser } = useUserMutation(filter);

  const handleToogleBlock = (user: User) => {
    mutateUser({ userId: user.id, newBlockStatus: !user.isBlocked });
  };

  return (
    <div>
      <h2 className="text-almost-white mb-10 font-sans text-2xl font-semibold">User management</h2>
      <div>
        <div className="mb-2">
          <TableSearch search={filter.search} setFilter={setFilter} />
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
            {!data
              ? Array.from({ length: 13 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={7}>
                      <p className="bg-green-subtle/50 w-full animate-pulse rounded text-transparent transition-all duration-300 ease-out">
                        {" "}
                        -{" "}
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              : data.data.users.map((user) => (
                  <UserManagementRow
                    key={user.id}
                    user={user}
                    handleToogleBlock={handleToogleBlock}
                  />
                ))}
          </TableBody>
        </Table>

        {data?.data && 
          <Pagination filter={filter} setFilter={setFilter} totalPages={data.data.pagination?.totalPages} /> }
          {/* // <div className="mt-5 flex items-center justify-center gap-5 font-semibold">
          //   <button
          //     className="rounded-2xl border border-black bg-zinc-400 px-5 py-1 text-black hover:bg-[#abf600] disabled:bg-zinc-900 disabled:text-zinc-700"
          //     onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
          //     disabled={isLoading || filter.page <= 1}
          //   >
          //     prev
          //   </button>
          //   <p className="text-white">
          //     {filter.page} of {data.data.pagination.totalPages}
          //   </p>
          //   <button
          //     className="rounded-2xl border border-black bg-zinc-400 px-5 py-1 text-black hover:bg-[#abf600] disabled:bg-zinc-900 disabled:text-zinc-700"
          //     onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
          //     disabled={isLoading || filter.page >= data.data.pagination.totalPages}
          //   >
          //     next
          //   </button>
          // </div> */}
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
