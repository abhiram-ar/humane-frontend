import { useEffect, useRef, useState } from "react";
import SearchUserBar from "../components/SearchUserBar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InfiniteScrollResponse } from "../Types/SearchResult";
import { api } from "@/lib/axios";
import UserListItem from "../components/UserListItem";
import { Link } from "react-router";
import { Loader } from "lucide-react";

const SearchPage = () => {
  const [query, setQuery] = useState<string | undefined>("emma");
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
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
    // note: in our api, if send the request after the last page, cusor will be null
    // returing undefined makes the hasNestPage turn false
    getNextPageParam: (lastPage) => (lastPage.scroll.hasMore ? lastPage.scroll.cursor : undefined),
  });

  useEffect(() => {
    if (!observerRef.current) {
      return;
    }
    const observer = new IntersectionObserver((entry) => {
      // make sure we dont fetch the page when a request is in fligh
      if (entry[0].isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    });
    observer.observe(observerRef.current);

    return () => observer.disconnect();
  });

  console.log("hasnext", hasNextPage);
  return (
    <div className="min-h-full w-120 border-x border-zinc-400/50">
      <div className="sticky top-0 z-20">
        <SearchUserBar state={[query, setQuery]} />
      </div>

      <div className="px-5 pt-5 text-lg text-white">
        {data?.pages
          .flatMap((page) => [...page.users])
          .map((user) => (
            <Link key={user.id} to={`/user/${user.id}`}>
              <UserListItem
                profileURL={user.avatarURL}
                userName={`${user.firstName} ${user.lastName || ""}`}
              />
            </Link>
          ))}
      </div>

      <div ref={observerRef} />

      <div className="pb-5">
        {hasNextPage && isFetching ? (
          <div className="flex justify-center">
            <Loader className="text-pop-green/75 animate-spin" />
          </div>
        ) : (
          <p className="text-center text-sm text-zinc-400">No more matches</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
