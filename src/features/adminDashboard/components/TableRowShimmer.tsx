import { TableCell, TableRow } from "@/components/ui/Table";
import React from "react";

type props = {
  colSpan: number;
  rows: number;
};

const TableRowShimmer: React.FC<props> = ({ colSpan, rows }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          <TableCell colSpan={colSpan}>
            <p className="bg-green-subtle/50 w-full animate-pulse rounded text-transparent transition-all duration-300 ease-out">
              {" "}
              -{" "}
            </p>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default TableRowShimmer;
