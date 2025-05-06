import { TableCell, TableRow } from "@/components/ui/Table";
import React from "react";
import { User } from "../types/userManagement.types";

type props = {
  user: User;
};
const UserManagementRow: React.FC<props> = ({ user }) => {
  return (
    <TableRow>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.firstName}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{String(user.isBlocked)}</TableCell>
      <TableCell>...</TableCell>
    </TableRow>
  );
};

export default UserManagementRow;
