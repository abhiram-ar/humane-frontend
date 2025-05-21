import SearchUserBar from "../components/SearchUserBar";
import UserList from "../components/UserList";

const SearchPage = () => {
  return (
    <div className="w-120 border-x border-zinc-400/50">
      <div className="sticky top-0 z-20">
        <SearchUserBar />
      </div>

      <UserList />
    </div>
  );
};

export default SearchPage;
