import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { ConversationWithLastMessage } from "../../Types/ConversationWithLastMessage";
import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import ConversationListItem from "./ConversationListItem";
import { useNavigate } from "react-router";
import useFindOtherUserOfOnetoOneConvo from "../../hooks/useFindOtherUserOfOnetoOneConvo";
import Spinner from "@/components/Spinner";
import ButtonPop from "@/components/ButtonPop";
import { useEffect, useState } from "react";
import useSearchUserConvo from "../../hooks/useSearchUserConvo";



const filtedConvosHashSet = new Set<string>();

const ConversationSearchList = () => {
  const searchQuery = useAppSelector((state) => state.chat.searchConvoQuery);
  const localConvos = useAppSelector((state) => state.chat.recentConvo);
  const initialLocalSearchRegex = new RegExp(searchQuery ?? "", "i");

  const [filteredConvo, setFilteredConvo] = useState<
    (ConversationWithLastMessage & { otherUser?: BasicUserDetails })[]
  >(
    localConvos.filter((convo) => {
      const username = `${convo.otherUser?.firstName || ""} ${convo.otherUser?.lastName || ""}`;
      if (initialLocalSearchRegex.test(username)) {
        filtedConvosHashSet.add(convo.id);
        return true;
      } else {
        return false;
      }
    }),
  );

  const navigate = useNavigate();
  const find = useFindOtherUserOfOnetoOneConvo();

  const { data, isLoading, isError, refetch } = useSearchUserConvo(searchQuery ?? "")

  useEffect(() => {
    if (!data || !localConvos) return;

    const searchRegex = new RegExp(searchQuery ?? "", "i");

    setFilteredConvo([]); // reset
    filtedConvosHashSet.clear();

    localConvos.forEach((convo) => {
      const username = `${convo.otherUser?.firstName || ""} ${convo.otherUser?.lastName || ""}`;
      if (searchRegex.test(username)) {
        setFilteredConvo((filtedConvos) => [...filtedConvos, convo]);
        filtedConvosHashSet.add(convo.id);
      }
    });

    data.existingConvos.forEach((convo) => {
      if (!filtedConvosHashSet.has(convo.id)) {
        setFilteredConvo((filteredConvo) => [...filteredConvo, convo]);
      }
    });
  }, [data, localConvos, searchQuery]);

  const handleConversationClick = (convo: ConversationWithLastMessage) => {
    if (convo.type === "one-to-one") {
      const otherUser = find(convo.participants);
      navigate(`/chat/user/${otherUser.userId}`);
    }
  };

  return (
    <div>
      <div className="text-white">
        {filteredConvo &&
          filteredConvo.map((convo) => (
            <div
              key={convo.id}
              onClick={() => handleConversationClick(convo)}
              className="border-b border-zinc-400/20 px-5 py-2"
            >
              <ConversationListItem convo={convo} />
            </div>
          ))}
      </div>
      {isLoading && <Spinner className="mt-1 flex justify-center" />}

      {!isLoading && filteredConvo.length === 0 && (
        <p className="text-center text-zinc-400">No more chats</p>
      )}

      {isError && !filteredConvo && (
        <div className="text-center text-red-400">
          <p>something went wrong</p>
          <ButtonPop className="mt-1" onClick={() => refetch()}>
            retry
          </ButtonPop>
        </div>
      )}
    </div>
  );
};

export default ConversationSearchList;
