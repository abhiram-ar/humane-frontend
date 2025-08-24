import { TableCell, TableRow } from "@/components/ui/Table";
import React from "react";
import { User } from "../types/userManagement.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { Ellipsis } from "lucide-react";

type props = {
  user: User;
  handleToogleBlock: (user: User) => void;
};
const UserManagementRow: React.FC<props> = ({ user, handleToogleBlock }) => {
  return (
    <TableRow>
      <TableCell>{user.firstName + " " + user.lastName}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{new Date(user.createdAt).toUTCString()}</TableCell>
      {/* <TableCell>{user.isHotUser ? "🔥" : "-"}</TableCell> */}
      {/* <TableCell>{user.humaneScore}</TableCell> */}
      <TableCell>{user.isBlocked ? "🔴" : "🟢"}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="bg-grey-light rounded-md p-1">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-grey-light border border-zinc-400/50 text-white">
            <DropdownMenuLabel className="text-zinc-300">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-pop-green" />
            <DropdownMenuItem>Go to Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToogleBlock(user)}>
              {user.isBlocked ? "Unblock user" : "Block user"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default UserManagementRow;
