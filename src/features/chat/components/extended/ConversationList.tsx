import testProfile from "@/assets/testProfile.png";
import { useNavigate } from "react-router";
import ConversationListItem from "./ConversationListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ConversationWithLastMessage } from "../../Types/ConversationWithLastMessage";
import { CurosrPagination } from "@/types/CursorPagination.type";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { useEffect, useRef } from "react";
import Spinner from "@/components/Spinner";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { addToConversationList } from "../../redux/chatSlice";

const demoUsers: {
  id: number;
  name: string;
  unreadCount: number;
  lastMessage: { isRead: boolean; message: string; senderId: string };
  profile: string;
}[] = [
  {
    id: 1,
    name: "Alice Johnson",
    unreadCount: 2,
    lastMessage: { isRead: false, message: "Hey, how are you?", senderId: "1" },
    profile: testProfile,
  },
  {
    id: 2,
    name: "Bob Smith",
    unreadCount: 0,
    lastMessage: { isRead: true, message: "See you soon!", senderId: "2" },
    profile: testProfile,
  },
  {
    id: 3,
    name: "Charlie Brown",
    unreadCount: 1,
    lastMessage: { isRead: false, message: "Let's catch up.", senderId: "3" },
    profile: testProfile,
  },
  {
    id: 4,
    name: "Diana Prince",
    unreadCount: 3,
    lastMessage: { isRead: false, message: "Meeting at 5?", senderId: "4" },
    profile: testProfile,
  },
  {
    id: 5,
    name: "Ethan Hunt",
    unreadCount: 0,
    lastMessage: { isRead: true, message: "Mission accomplished.", senderId: "5" },
    profile: testProfile,
  },
  {
    id: 6,
    name: "Fiona Gallagher",
    unreadCount: 4,
    lastMessage: { isRead: false, message: "Call me!", senderId: "6" },
    profile: testProfile,
  },
  {
    id: 7,
    name: "George Miller",
    unreadCount: 0,
    lastMessage: { isRead: true, message: "Thanks!", senderId: "7" },
    profile: testProfile,
  },
  {
    id: 8,
    name: "Hannah Lee",
    unreadCount: 1,
    lastMessage: { isRead: false, message: "See you tomorrow.", senderId: "8" },
    profile: testProfile,
  },
  {
    id: 9,
    name: "Ian Curtis",
    unreadCount: 0,
    lastMessage: { isRead: true, message: "No problem.", senderId: "9" },
    profile: testProfile,
  },
  {
    id: 10,
    name: "Julia Roberts",
    unreadCount: 2,
    lastMessage: { isRead: false, message: "Let's meet up.", senderId: "10" },
    profile: testProfile,
  },
  {
    id: 11,
    name: "Kevin Durant",
    unreadCount: 1,
    lastMessage: { isRead: false, message: "Game tonight?", senderId: "11" },
    profile: testProfile,
  },
  {
    id: 12,
    name: "Laura Palmer",
    unreadCount: 0,
    lastMessage: { isRead: true, message: "See you at the lodge.", senderId: "12" },
    profile: testProfile,
  },
  {
    id: 13,
    name: "Michael Scott",
    unreadCount: 3,
    lastMessage: {
      isRead: false,
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. At rerum similique esse excepturi, adipisci molestias architecto quam voluptatum reprehenderit maiores! Aut ipsam maiores assumenda similique consectetur illum iure incidunt eum?",
      senderId: "13",
    },
    profile: testProfile,
  },
  {
    id: 14,
    name: "Nancy Drew",
    unreadCount: 2,
    lastMessage: { isRead: false, message: "Solved the case!", senderId: "14" },
    profile: testProfile,
  },
  {
    id: 15,
    name: "Oscar Wilde",
    unreadCount: 0,
    lastMessage: { isRead: true, message: "Be yourself; everyone else is taken.", senderId: "15" },
    profile: testProfile,
  },
];

type GetUserRecentConvoReponse = {
  data: { pagination: CurosrPagination; conversations: ConversationWithLastMessage[] };
};

const ConversationList = () => {
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement>(null);
  const dispath = useAppDispatch();

  const conversation = useAppSelector((state) => state.chat.recentConvo);

  const { data, isLoading, hasNextPage, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ["recent-converstions-list"],
    queryFn: async ({ pageParam }) => {
      const params =
        pageParam === "ini"
          ? {
              limit: 10,
            }
          : {
              limit: 5,
              from: pageParam,
            };

      const res = await api.get<GetUserRecentConvoReponse>(`${API_ROUTES.CHAT_ROUTE}/recent`, {
        params,
      });
      return res.data.data;
    },
    initialPageParam: "ini",
    getNextPageParam: (lastPage) => (lastPage.pagination.hasMore ? lastPage.pagination.from : null),
  });

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

  useEffect(() => {
    if (!data) return;
    dispath(addToConversationList(data.pages.flatMap((page) => page.conversations)));
  }, [data, dispath]);

  return (
    <div className="text-white">
      {/* {demoUsers.map((user) => (
        <div
          key={user.id}
          onClick={() => navigate("/user/")}
          className="border-b border-zinc-400/20 px-5 py-2"
        >
          <ConversationListItem
            userName={user.name}
            profileURL={user.profile}
            lastMessage={user.lastMessage}
            unreadCount={user.unreadCount}
            type={"one-to-one"}
          />
        </div>
      ))} */}

      {conversation &&
        conversation.map((convo) => (
          <>
            <div
              key={convo.id}
              onClick={() => navigate("/user/")}
              className="border-b border-zinc-400/20 px-5 py-2"
            >
              <ConversationListItem
                userName={convo.id}
                profileURL={""}
                lastMessage={convo.lastMessage}
                unreadCount={convo.unreadCount}
                type={"one-to-one"}
              />
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
