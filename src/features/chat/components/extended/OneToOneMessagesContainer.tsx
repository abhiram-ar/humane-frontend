import React, { useEffect, useRef, useState } from "react";
import UserMessage from "./UserMessage.tsx";
import OtherParticipantMessage from "./OtherParticipantMessage.tsx.tsx";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks.ts";
import useUserId from "@/hooks/useUserId.tsx";
import { prependMessagesToOneToOneChat } from "../../redux/chatSlice.tsx";
import ScrollToView from "./ScrollToView.tsx";
import useChatHistoryInfiniteQuery from "../../hooks/useChatHistoryInfiniteQuery.tsx";
import Spinner from "@/components/Spinner.tsx";

type Props = {
  otherUserId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleOnMessageUpdate?: () => void;
};

const OneToOneMessagesContainer: React.FC<Props> = ({
  otherUserId,
  containerRef,
  handleOnMessageUpdate,
}) => {
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

  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } = useChatHistoryInfiniteQuery(
    otherUserId,
    messages?.[0],
  );

  const hasFirstMessage = messages?.[0]?.id ? true : false;

  // load data to redux state
  useEffect(() => {
    if (!data) return;

    data.pages.forEach((page, idx) => {
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

  // scroll restroration while loading message history
  useEffect(() => {
    if (!observerRef.current) return;

    if (chatHistorySliceIdx === 0) {
      observerRef.current.scrollTop = observerRef.current.scrollHeight;
    } else {
      observerRef.current.scrollTo({ top: observerRef.current.scrollHeight - prevScrollHeight });
    }
  }, [chatHistorySliceIdx]);

  // fire load more history based on scoll position
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

  // scroll if there is new incomming messages based on threshold
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

  // show scroll to bottom helper
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

  // set scoll to end when switch between chats
  useEffect(() => {
    if (!observerRef.current || !messages || messages.length === 0) return;

    const timeout = setTimeout(() => {
      observerRef.current!.scrollTop = observerRef.current!.scrollHeight;
    }, 10); // delay to allow DOM paint

    return () => clearTimeout(timeout);
  }, [hasFirstMessage, otherUserId]);

  // edge-case: save last-seen on chat for on app close unexectly
  // so all the user will have read the message
  useEffect(() => {
    if (!handleOnMessageUpdate) return;

    handleOnMessageUpdate();

    return () => handleOnMessageUpdate();
  }, [messages, handleOnMessageUpdate]);

  return (
    <>
      <div
        ref={observerRef}
        className="relative flex max-h-10/12 min-h-10/12 flex-col justify-end-safe overflow-y-scroll"
      >
        <div className="text-pop-green absolute inset-0 mt-5 pb-5">
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
