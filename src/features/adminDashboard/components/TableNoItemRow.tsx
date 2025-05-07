import { TableCell, TableRow } from "@/components/ui/Table";
import React from "react";

type props = {
  colSpan: number;
  message?: string;
};

const TableNoItemRow: React.FC<props> = ({ colSpan, message = "No Item found" }) => {
  return (
    <TableRow className="">
      <TableCell colSpan={colSpan} className="">
        <p className="w-full text-center text-red-300/80">{message}</p>
      </TableCell>
    </TableRow>
  );
};

export default TableNoItemRow;
