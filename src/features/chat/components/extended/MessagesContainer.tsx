import React from "react";
import UserMessage from "./UserMessage";
import OtherParticipantMessage from "./OtherParticipantMessage.tsx";
import { useAppSelector } from "@/features/userAuth/hooks/store.hooks.ts";
import useUserId from "@/hooks/useUserId.tsx";

type Props = { otherUserId: string };
const OneToOneMessagesContainer: React.FC<Props> = ({ otherUserId }) => {
  const authenticatedUserId = useUserId();
  const messages = useAppSelector((state) => state.chat.oneToOnechats[otherUserId]);

  return (
    <div className="overflow-clip border pt-2">
      {messages &&
        messages.map((message) =>
          authenticatedUserId && authenticatedUserId === message.senderId ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <OtherParticipantMessage key={message.id} message={message.message} />
          ),
        )}
    </div>
  );
};

export default OneToOneMessagesContainer;
