import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserBlockStatus } from "../services/UserManagement.services";
import { IQueryFilter } from "../types/QueryFilter";
import { UserListResponse } from "../types/userManagement.types";

export const useUserMutation = (filter: IQueryFilter) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserBlockStatus,
    onSuccess: (newResponse) => {
      queryClient.setQueryData(
        ["user", { search: filter.search, page: filter.page }],
        (oldData: UserListResponse | undefined) => {
          if (!oldData) return oldData;

          const newData: UserListResponse = {
            ...oldData,
            data: {
              ...oldData.data,
              users: oldData.data.users.map((user) =>
                user.id === newResponse.data.user.id ? newResponse.data.user : user,
              ),
            },
          };

          return newData;
        },
      );
    },
  });
};
