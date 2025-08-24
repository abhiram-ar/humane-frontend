import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/UserManagement.services";
import { IQueryFilter } from "../types/QueryFilter";

export const useUserListQuery = (filter: IQueryFilter) => {
  return useQuery({
    queryKey: ["user", { search: filter.search, page: filter.page }],
    queryFn: () => fetchUsers(filter.search, filter.page, filter.limit),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    refetchOnMount: false,
  });
};
