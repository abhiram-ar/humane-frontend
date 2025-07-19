import { useNavigate } from "react-router";
import ConversationListItem from "./ConversationListItem";
import { ConversationWithLastMessage } from "../../Types/ConversationWithLastMessage";
import { useEffect, useRef } from "react";
import Spinner from "@/components/Spinner";
import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import useConversaionListInifiteQuery from "../../hooks/useConversaionListInifiteQuery";
import useFindOtherUserOfOnetoOneConvo from "../../hooks/useFindOtherUserOfOnetoOneConvo";

const ConversationList = () => {
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement>(null);
  const conversation = useAppSelector((state) => state.chat.recentConvo);
  const findOtherUser = useFindOtherUserOfOnetoOneConvo();

  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } =
    useConversaionListInifiteQuery();

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) {
      return;
    }
    const observer = new IntersectionObserver((entry) => {
      // make sure we dont fetch the page when a request is in flight
      if (entry[0].isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    });
    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching]);

  const handleConversationClick = (convo: ConversationWithLastMessage) => {
    if (convo.type === "one-to-one") {
      const otherUser = findOtherUser(convo.participants);
      navigate(`/chat/user/${otherUser.userId}`);
    }
  };

  return (
    <div className="text-white">
      {conversation &&
        conversation.map((convo) => (
          <>
            <div
              key={convo.id}
              onClick={() => handleConversationClick(convo)}
              className="border-b border-zinc-400/20 px-5 py-2"
            >
              <ConversationListItem convo={convo} />
            </div>
          </>
        ))}

      <div ref={observerRef} />

      <div className="pb-5">
        {(isFetching || isLoading) && <Spinner />}

        {data && !hasNextPage && !isFetching && (
          <p className="text-center text-sm text-zinc-400">No more Chats</p>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
