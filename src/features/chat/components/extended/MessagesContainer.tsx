import React from "react";
import UserMessage from "./UserMessage";
import OtherParticipantMessage from "./OtherParticipantMessage.tsx";

const text =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas molestiae quae mollitia, nam itaque blanditiis, reiciendis soluta expedita quam, sed cupiditate alias architecto vel totam aliquam ipsa accusamus eveniet laborum.";

const MessagesContainer = () => {
  return (
    <div className="overflow-clip border pt-2">
      {Array(20)
        .fill(0)
        .map((e, i) => (
          <>
            
            {Math.random() > 0.4 ? (
              <UserMessage key={i} message={text.slice(0, Math.random() * 100)} />
            ) : (
              <OtherParticipantMessage message={text.slice(0, Math.random() * 200)} />
            )}
          </>
        ))}
    </div>
  );
};

export default MessagesContainer;
