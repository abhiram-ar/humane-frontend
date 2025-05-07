import React from "react";
import { IQueryFilter } from "../types/QueryFilter";

type Props = {
  filter: IQueryFilter;
  totalPages: number;
  setFilter: React.Dispatch<React.SetStateAction<IQueryFilter>>;
};

const Pagination: React.FC<Props> = ({ filter, setFilter, totalPages }) => {
  return (
    <div className="mt-5 flex items-center justify-center gap-5 font-semibold">
      <button
        className="rounded-2xl border border-black bg-zinc-400 px-5 py-1 text-black hover:bg-[#abf600] disabled:bg-zinc-900 disabled:text-zinc-700"
        onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
        disabled={filter.page <= 1}
      >
        prev
      </button>
      <p className="text-white">
        {filter.page} of {totalPages}
      </p>
      <button
        className="rounded-2xl border border-black bg-zinc-400 px-5 py-1 text-black hover:bg-[#abf600] disabled:bg-zinc-900 disabled:text-zinc-700"
        onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
        disabled={filter.page >= totalPages}
      >
        next
      </button>
    </div>
  );
};

export default Pagination;
