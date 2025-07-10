import { Search } from "lucide-react";
import { useState } from "react";

const SearchChatBar: React.FC = () => {
  const [value, setValue] = useState("");

  // useEffect(() => {
  //   const timer = setTimeout(() => setQuery(value), 500);
  //   return () => clearTimeout(timer);
  // }, [value, setValue, setQuery]);

  return (
    <div className="bg-grey-light group mx-3 flex h-12 items-center justify-center gap-3 rounded-2xl px-5 py-2">
      <Search className="group-focus-within:text-pop-green text-zinc-300 transition-all duration-100 ease-in group-focus-within:opacity-100" />
      <input
        id="search-chat"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full text-lg text-white focus:outline-none"
        placeholder="search user"
      />
    </div>
  );
};

export default SearchChatBar;
