import { useCallback, useEffect, useRef } from "react";
import SearchUserBar from "../components/SearchUserBar";
import UserListItem from "../components/UserListItem";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { setSearchQuery } from "../redux/mainSearchSlice";
import Spinner from "@/components/Spinner";
import useUserSearchInfiniteQuery from "../hooks/useUserSearchInfiniteQuery";

const SearchPage = () => {
  const query = useAppSelector((state) => state.mainSearch.query);
  const dispatch = useAppDispatch();

  const setQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch],
  );

  const observerRef = useRef<HTMLDivElement | null>(null);

  const { isLoading, data, fetchNextPage, hasNextPage, isFetching } =
    useUserSearchInfiniteQuery(query);

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

  console.log("hasnext", hasNextPage, data);
  return (
    <div className="min-h-full w-120 border-x border-zinc-400/50">
      <div className="sticky top-0 z-20">
        <SearchUserBar query={query} setQuery={setQuery} />
      </div>

      <div className="px-5 pt-5 text-lg text-white">
        {data?.pages
          .flatMap((page) => [...page.users])
          .map((user) => (
            <Link key={user.id} to={`/user/${user.id}`}>
              <UserListItem
                className="mb-4"
                profileURL={user.avatarURL}
                userName={`${user.firstName} ${user.lastName || ""}`}
              />
            </Link>
          ))}
      </div>

      <div ref={observerRef} />

      <div className="pb-5">
        {(isFetching || isLoading) && <Spinner />}

        {data && !hasNextPage && !isFetching && (
          <p className="text-center text-sm text-zinc-400">No more matches</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
