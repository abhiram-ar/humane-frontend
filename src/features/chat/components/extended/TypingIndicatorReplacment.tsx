import React, { ComponentPropsWithoutRef } from "react";
import useChatTyping from "../../hooks/useChatTyping";

type Props = {
  convoId?: string;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<"p">;

const TypingIndicatorReplacement: React.FC<Props> = ({ convoId, children, ...props }) => {
  const { typing } = useChatTyping(convoId);

  return <div>{typing ? <p {...props}>Typing.. </p> : children}</div>;
};

export default TypingIndicatorReplacement;
