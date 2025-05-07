import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { api } from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UserListResponse } from "../types/userManagement.types";
import UserManagementRow from "../components/UserManagementRow";
import TableSearch from "../components/TableSearch";

const fetchUsers = async (search: string, page: number, limit: number) => {
  const response = await api.get<UserListResponse>("/api/v1/admin/manage/user/list", {
    params: { search, page, limit },
  });
  return response.data;
};

const AdminUserManagementPage = () => {
  const [filter, setFilter] = useState({ search: "", page: 1, limit: 10 });

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", filter.search, filter.page],
    queryFn: () => fetchUsers(filter.search, filter.page, filter.limit),
    placeholderData: keepPreviousData,
  });

  console.log("data", data);
  console.log("error", error);
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
              ? Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={7}>
                      <p className="bg-green-subtle/50 w-full animate-pulse rounded text-transparent transition-all duration-300 ease-out">
                        {" "}
                        -{" "}
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              : data.data.users.map((user) => <UserManagementRow user={user} />)}
          </TableBody>
        </Table>

        {data?.data && (
          <div className="mt-5 flex items-center justify-center gap-5 font-semibold">
            <button
              className="rounded-2xl border border-black bg-zinc-400 px-5 py-1 text-black hover:bg-[#abf600] disabled:bg-zinc-900 disabled:text-zinc-700"
              onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
              disabled={isLoading || filter.page <= 1}
            >
              prev
            </button>
            <p className="text-white">
              {filter.page} of {data.data.pagination.totalPages}
            </p>
            <button
              className="rounded-2xl border border-black bg-zinc-400 px-5 py-1 text-black hover:bg-[#abf600] disabled:bg-zinc-900 disabled:text-zinc-700"
              onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
              disabled={isLoading || filter.page >= data.data.pagination.totalPages}
            >
              next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
