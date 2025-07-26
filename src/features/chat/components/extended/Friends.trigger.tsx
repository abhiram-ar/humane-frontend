import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useRef } from "react";
import FriendList from "@/features/profile/components/extended/FriendList";
import useUserId from "@/hooks/useUserId";
import { FriendList as FriendListType } from "@/features/profile/hooks/useFriendsListInfniteQuery";
import { useNavigate } from "react-router";
import { DialogClose } from "@radix-ui/react-dialog";

type Props = {
  children: React.ReactNode;
};

const Friends: React.FC<Props> = ({ children }) => {
  const userId = useUserId();
  const navigate = useNavigate();
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  if (!userId) return;

  const handleOnUserClick = (data: FriendListType[0]) => {
    navigate(`/chat/user/${data.id}`);
    if (dialogCloseRef.current) {
      dialogCloseRef.current.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="border-grey-dark-bg bg-[#272727]" aria-describedby="edit profile">
        <DialogClose ref={dialogCloseRef} />
        <DialogHeader>
          <DialogTitle className="text-almost-white">Friends</DialogTitle>
        </DialogHeader>
        <FriendList userId={userId} onUserClick={handleOnUserClick} />
      </DialogContent>
    </Dialog>
  );
};

export default Friends;
