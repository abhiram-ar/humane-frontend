import { TableCell, TableRow } from "@/components/ui/Table";
import React from "react";
import { User } from "../types/userManagement.types";

type props = {
  user: User;
};
const UserManagementRow: React.FC<props> = ({ user }) => {
  return (
    <TableRow>
      <TableCell>{user.firstName + " " + user.lastName}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{new Date(user.createdAt).toUTCString()}</TableCell>
      <TableCell>{user.isHotUser ? "🔥" : "-"}</TableCell>
      <TableCell>{user.humaneScore}</TableCell>
      <TableCell>{user.isBlocked ? "🔴" : "🟢"}</TableCell>
      <TableCell>...</TableCell>
    </TableRow>
  );
};

export default UserManagementRow;
