import React, { useEffect, useRef, useState } from "react";
import UserMessage from "./UserMessage.tsx";
import OtherParticipantMessage from "./OtherParticipantMessage.tsx.tsx";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks.ts";
import useUserId from "@/hooks/useUserId.tsx";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios.ts";
import { Message } from "../../Types/Message.ts";
import { CurosrPagination } from "@/types/CursorPagination.type.ts";
import { API_ROUTES } from "@/lib/API_ROUTES.ts";
import Spinner from "@/components/Spinner.tsx";
import { prependMessagesToOneToOneChat } from "../../redux/chatSlice.tsx";

type GetOneToOneMessagesResponse = {
  data: { messages: Message[]; pagination: CurosrPagination };
};

type Props = { otherUserId: string; containerRef: React.RefObject<HTMLDivElement | null> };
const OneToOneMessagesContainer: React.FC<Props> = ({ otherUserId, containerRef }) => {
  const authenticatedUserId = useUserId();
  const { messages, lastInsertedMessageType } = useAppSelector((state) => ({
    messages: state.chat.oneToOnechats[otherUserId],
    lastInsertedMessageType: state.chat.lastAddedMessageTypeMap[otherUserId],
  }));
  const observerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  containerRef.current = observerRef.current;

  const [chatHistorySliceIdx, setChatHistorySliceIdx] = useState<number>(-1);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["one-to-one-messages", otherUserId],
    queryFn: async (data) => {
      const param =
        data.pageParam === "init"
          ? {
              limit: 20,
              otherUserId,
            }
          : {
              limit: 10,
              from: data.pageParam,
              otherUserId,
            };

      const res = await api.get<GetOneToOneMessagesResponse>(
        `${API_ROUTES.CHAT_ROUTE}/convo/one-to-one/messages`,
        { params: param },
      );
      return res.data.data;
    },
    initialPageParam: "init",
    getNextPageParam: (lastPage) => (lastPage.pagination.hasMore ? lastPage.pagination.from : null),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!data) return;

    data.pages.forEach((page, idx) => {
      if (idx <= chatHistorySliceIdx) return;
      dispatch(
        prependMessagesToOneToOneChat({
          otherUserId,
          // incomming message are in new-to-old order
          messages: page.messages.reverse(),
          chatHistorySliceIdx: idx,
        }),
      );
      setChatHistorySliceIdx(idx);
    });
  }, [data, otherUserId]);

  useEffect(() => {
    if (!observerRef.current) return;

    if (chatHistorySliceIdx === 0) {
      observerRef.current.scrollTop = observerRef.current.scrollHeight;
    } else {
      observerRef.current.scrollTo({ top: observerRef.current.scrollHeight - prevScrollHeight });
    }
  }, [chatHistorySliceIdx]);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const elem = observerRef.current;

    const fireLoadMoreHistory = (e: Event) => {
      const typedElem = e.target as HTMLDivElement;
      if (typedElem.scrollTop === 0 && hasNextPage && !isFetching) {
        setPrevScrollHeight(typedElem.scrollHeight);
        fetchNextPage();
      }
    };

    elem.addEventListener("scroll", fireLoadMoreHistory);

    return () => {
      elem.removeEventListener("scroll", fireLoadMoreHistory);
    };
  }, [fetchNextPage, hasNextPage, isFetching]);

  useEffect(() => {
    if (!observerRef.current) return;
    const elem = observerRef.current;

    // only scorll to last message if the current scoll is within the threshold limit to
    // and last inserted messge was a real-time message
    console.log(elem.scrollHeight, elem.scrollTop, elem.clientHeight);
    if (
      lastInsertedMessageType === "real-time" &&
      Math.abs(elem.scrollHeight - elem.scrollTop - elem.clientHeight) <= elem.clientHeight
    )
      elem.scrollTop = elem.scrollHeight;

    return () => {};
  }, [lastInsertedMessageType, messages]);

  return (
    <>
      <div ref={observerRef} className="relative max-h-10/12 overflow-y-scroll">
        <div className="text-pop-green absolute inset-0 mt-2 pb-5">
          {(isFetching || isLoading) && <Spinner />}
        </div>
        <div className="pt-2">
          {messages &&
            messages.map((message) =>
              authenticatedUserId && authenticatedUserId === message.senderId ? (
                <UserMessage key={message.id} message={message} />
              ) : (
                <OtherParticipantMessage key={message.id} message={message} />
              ),
            )}
        </div>
      </div>
    </>
  );
};

export default OneToOneMessagesContainer;
