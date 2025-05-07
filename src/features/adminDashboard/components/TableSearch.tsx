import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
  search: string;
  setFilter: React.Dispatch<
    React.SetStateAction<{
      search: string;
      limit: number;
      page: number;
    }>
  >;
}

const TableSearch: React.FC<Props> = ({ search, setFilter }) => {
  const [query, setQuery] = useState(search);

  useEffect(() => {
    const timer = setTimeout(
      () => setFilter((value) => ({ ...value, search: query, page: 1 })),
      300,
    );

    return () => clearTimeout(timer);
  }, [query, setFilter]);

  return (
    <div className="rounded-2xl border border-zinc-600/80 flex justify-center items-center px-5 py-2 gap-2 text-white w-96" >
      <Search />
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border-none outline-none"
      />
    </div>
  );
};

export default TableSearch;
