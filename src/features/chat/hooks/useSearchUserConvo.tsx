import { API_ROUTES } from "@/lib/API_ROUTES";
import { useQuery } from "@tanstack/react-query";
import { ConversationWithLastMessage } from "../Types/ConversationWithLastMessage";
import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import { api } from "@/lib/axios";

export type SearchUserCovoReponse = {
  data: {
    existingConvos: (ConversationWithLastMessage & { otherUser: BasicUserDetails })[];
    startNewConvos: { otherUser: BasicUserDetails }[];
  };
};

const useSearchUserConvo = (searchQuery: string) => {
  return useQuery({
    queryKey: ["convo-search", searchQuery],
    queryFn: async () => {
      const res = await api.get<SearchUserCovoReponse>(`${API_ROUTES.CHAT_ROUTE}/convo/search`, {
        params: { searchQuery, page: 1, limit: 10 },
      });
      return res.data.data;
    },
    staleTime: 10 * 1000,
    enabled: !!searchQuery,
  });
};

export default useSearchUserConvo;
