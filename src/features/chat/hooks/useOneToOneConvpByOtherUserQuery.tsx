import { API_ROUTES } from "@/lib/API_ROUTES";
import { useQuery } from "@tanstack/react-query";
import { OneToOneConversation } from "../Types/Conversation";
import { api } from "@/lib/axios";

export type GetOneToOneConvoResponse = {
  data: { conversation: OneToOneConversation | null };
};

const useConversationByOtherUserQuery = (
  otherUserId?: string,
  initialData?: OneToOneConversation,
) => {
  return useQuery({
    queryKey: ["one-to-one-convo", otherUserId],
    queryFn: async () => {
      const res = await api.get<GetOneToOneConvoResponse>(
        `${API_ROUTES.CHAT_ROUTE}/convo/one-to-one/`,
        {
          params: { otherUserId },
        },
      );
      return res.data.data.conversation;
    },
    enabled: !!otherUserId,
    initialData: initialData ?? undefined,
    staleTime: Infinity,
  });
};

export default useConversationByOtherUserQuery;
