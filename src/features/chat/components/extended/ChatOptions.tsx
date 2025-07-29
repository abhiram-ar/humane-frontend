import { API_ROUTES } from "@/lib/API_ROUTES";
import { api } from "@/lib/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import React from "react";
import { Conversation } from "../../Types/Conversation";
import { useAppDispatch } from "@/features/userAuth/hooks/store.hooks";
import { clearOneToOneChat } from "../../redux/chatSlice";
import useFindOtherUserOfOnetoOneConvo from "../../hooks/useFindOtherUserOfOnetoOneConvo";

type Props = {
  convoId?: string;
  children?: React.ReactNode;
};

type ClearUserChatReponse = {
  data: { convo: Conversation };
};

const ChatOptions: React.FC<Props> = ({ convoId, children }) => {
  const dispatch = useAppDispatch();
  const find = useFindOtherUserOfOnetoOneConvo();

  const { mutate } = useMutation({
    mutationKey: ["clear-chat", convoId],
    mutationFn: async (convoId: string) => {
      const res = await api.patch<ClearUserChatReponse>(
        `${API_ROUTES.CHAT_ROUTE}/convo/${convoId}/clearedAt`,
      );
      return res.data.data;
    },
    onSuccess: (res) => {
      if (res.convo.type === "one-to-one") {
        const otherUser = find(res.convo.participants);
        dispatch(clearOneToOneChat({ otherUserId: otherUser.userId }));
      }
    },
  });

  const handleClearChat = (convoId: string) => {
    mutate(convoId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children ? children : <EllipsisVertical />}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-grey-light overflow-hidden rounded-md border border-zinc-400/50 text-white">
        <DropdownMenuLabel className="px-2 py-1 text-zinc-300">Options</DropdownMenuLabel>
        <hr />
        <div className="">
          {convoId && (
            <DropdownMenuItem
              className="cursor-pointer px-2 py-1 outline-none hover:bg-zinc-400/50"
              onClick={() => handleClearChat(convoId)}
            >
              Clear chat
            </DropdownMenuItem>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatOptions;
