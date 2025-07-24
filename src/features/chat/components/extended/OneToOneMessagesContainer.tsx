import React, { useEffect, useRef, useState } from "react";
import UserMessage from "./UserMessage.tsx";
import OtherParticipantMessage from "./OtherParticipantMessage.tsx.tsx";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks.ts";
import useUserId from "@/hooks/useUserId.tsx";
import { prependMessagesToOneToOneChat } from "../../redux/chatSlice.tsx";
import ScrollToView from "./ScrollToView.tsx";
import useChatHistoryInfiniteQuery from "../../hooks/useChatHistoryInfiniteQuery.tsx";
import Spinner from "@/components/Spinner.tsx";

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

  const scrollToViewTargetRef = useRef<HTMLDivElement>(null);
  const [showScrollToView, setShowScrollToView] = useState(false);

  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } =
    useChatHistoryInfiniteQuery(otherUserId);

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
    if (
      lastInsertedMessageType === "real-time" &&
      Math.abs(elem.scrollHeight - elem.scrollTop - elem.clientHeight) <= elem.clientHeight
    ) {
      elem.scrollTop = elem.scrollHeight;
    }
  }, [lastInsertedMessageType, messages]);

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = observerRef.current;

    const handleScroll = () => {
      if (
        Math.abs(observer.scrollHeight - observer.scrollTop - observer.clientHeight) >
        observer.clientHeight
      ) {
        setShowScrollToView(true);
      } else {
        setShowScrollToView(false);
      }
    };

    observer.addEventListener("scroll", handleScroll);

    return () => observer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div ref={observerRef} className="relative max-h-10/12 overflow-y-scroll">
        <div className="text-pop-green absolute inset-0 mt-2 pb-5">
          {(isFetching || isLoading) && <Spinner />}
        </div>
        <div className="pt-2">
          {messages &&
            messages.map((message, idx) => (
              <div
                ref={idx === messages.length - 1 ? scrollToViewTargetRef : undefined}
                key={message.id}
              >
                {authenticatedUserId && authenticatedUserId === message.senderId ? (
                  <UserMessage message={message} />
                ) : (
                  <OtherParticipantMessage message={message} />
                )}
              </div>
            ))}
        </div>
      </div>
      {showScrollToView && (
        <div className="absolute right-10 bottom-20">
          <ScrollToView targetElemRef={scrollToViewTargetRef} />
        </div>
      )}
    </>
  );
};

export default OneToOneMessagesContainer;
