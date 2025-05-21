import { Search } from "lucide-react";

const SearchUserBar = () => {
  return (
    <div className="bg-grey-light group w-full flex h-25 items-center justify-center gap-2 px-5 py-2">
      <Search className="text-zinc-300 group-focus-within:text-pop-green transition-all duration-100 ease-in group-focus-within:opacity-100" />
      <input
        type="text"
        className="w-full text-lg text-white focus:outline-none"
        placeholder="search user"
      />
    </div>
  );
};

export default SearchUserBar;
