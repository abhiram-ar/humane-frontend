import { TableCell, TableRow } from "@/components/ui/Table";
import React, { ComponentPropsWithoutRef } from "react";

type props = {
  colSpan: number;
  message?: string;
} & ComponentPropsWithoutRef<"p">;

const TableNoItemRow: React.FC<props> = ({ colSpan, message = "No Item found", ...props }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="">
        <p className="w-full text-center text-red-300/80" {...props}>
          {message}
        </p>
      </TableCell>
    </TableRow>
  );
};

export default TableNoItemRow;
