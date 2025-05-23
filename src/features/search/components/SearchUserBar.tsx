import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  state: ReturnType<typeof useState<string>>;
};

const SearchUserBar: React.FC<Props> = ({ state: [query, setQuery] }) => {
  const [value, setValue] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(value), 500);
    return () => clearTimeout(timer);
  }, [value, setValue, setQuery]);

  return (
    <div className="bg-grey-light group flex h-25 w-full items-center justify-center gap-3 px-5 py-2">
      <Search className="group-focus-within:text-pop-green text-zinc-300 transition-all duration-100 ease-in group-focus-within:opacity-100" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full text-lg text-white focus:outline-none"
        placeholder="search user"
      />
    </div>
  );
};

export default SearchUserBar;
