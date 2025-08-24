import { TableCell, TableRow } from "@/components/ui/Table";
import React from "react";
import { Reward } from "../types/GetUserRewardListResponse";

type props = {
  reward: Reward;
};
const UserReardTableRow: React.FC<props> = ({ reward }) => {
  return (
    <TableRow>
      <TableCell>{reward.firstName + " " + reward.lastName}</TableCell>
      <TableCell>{reward.score}</TableCell>
    </TableRow>
  );
};

export default UserReardTableRow;
