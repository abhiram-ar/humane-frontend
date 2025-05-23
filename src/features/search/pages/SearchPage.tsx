import { Fragment, useState } from "react";
import SearchUserBar from "../components/SearchUserBar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InfiniteScrollResponse } from "../Types/SearchResult";
import { api } from "@/lib/axios";
import UserListItem from "../components/UserListItem";
import { Link } from "react-router";

const SearchPage = () => {
  const [query, setQuery] = useState<string | null>("emma");

  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["find-users", query],
    queryFn: async ({ pageParam }) => {
      const queryParams =
        pageParam !== 0
          ? {
              searchQuery: query,
              searchAfter: pageParam,
              limit: 15,
            }
          : {
              searchQuery: query,
              limit: 15,
            };

      const res = await api.get<InfiniteScrollResponse>("/api/v1/query/public/user", {
        params: queryParams,
      });
      return res.data.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.scroll.cursor ?? undefined,
  });

  console.log(data);
  return (
    <div className="w-120 border-x border-zinc-400/50">
      <div className="sticky top-0 z-20">
        <SearchUserBar />
      </div>

      <div className="p-5 text-lg text-white">
        {data?.pages
          .flatMap((page) => [...page.users])
          .map((user) => (
            <Link key={user.id} to={`/user/${user.id}`}>
              <UserListItem
                profileURL={user.avatarURL}
                userName={`${user.firstName + (user.lastName || "")}`}
              />
            </Link>
          ))}
        <div onClick={() => fetchNextPage()}>end</div>
      </div>
    </div>
  );
};

export default SearchPage;
