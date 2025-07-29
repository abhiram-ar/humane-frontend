import useUserId from "@/hooks/useUserId";
import { BaseConverstion } from "../Types/Conversation";

const useFindOtherUserOfOnetoOneConvo = () => {
  const currentUserId = useUserId();

  const find = (
    participants: BaseConverstion["participants"],
  ): BaseConverstion["participants"][0] => {
    if (participants.length !== 2) {
      throw new Error("less/greater than 2 user for one-to-one convo");
    }

    const user = participants.find((item) => item.userId !== currentUserId);
    if (!user) throw new Error("Unexpected error, cannot find other user of one to one convo");

    return user;
  };

  return find;
};

export default useFindOtherUserOfOnetoOneConvo;
