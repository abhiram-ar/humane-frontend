import { useAppDispatch } from "@/features/userAuth/hooks/store.hooks";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { setConvoQuery } from "../../redux/chatSlice";

const SearchChatBar: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!value) {
      dispatch(setConvoQuery({ query: value }));
    } else {
      timer = setTimeout(() => dispatch(setConvoQuery({ query: value })), 500);
    }
    return () => clearTimeout(timer);
  }, [dispatch, value]);

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
