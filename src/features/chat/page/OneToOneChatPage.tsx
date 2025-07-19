import { useChatSocketProvider } from "@/app/providers/ChatSocketProvider";
import ChatHeader from "../components/extended/ChatHeader";
import MessagesContainer from "../components/extended/MessagesContainer";
import SendMessageBar from "../components/extended/SendMessageBar";
import { CreateMessageFields } from "../Types/CreateMessageFields";
import { SendOneToOneMessageInputDTO } from "@/app/providers/Types/CreateOneToOneMessage.dto";
import { useParams } from "react-router";
import ErrorPage from "@/layout/PageNotFoundPage";
import { getPostMediaPresignedURL } from "@/features/home/services/GetPostMediaPresingedURL";
import axios from "axios";

const OneToOneChatPage = () => {
  const { socket } = useChatSocketProvider();
  const { userId } = useParams();

  console.log("cotet", socket);

  if (!userId) return ErrorPage({ message: "User not found" });

  const handleOnSubmit = async (data: CreateMessageFields) => {
    if (socket) {
      console.log(data);
      let attachment: SendOneToOneMessageInputDTO["attachment"];

      const typedAttachement = data.attachment as FileList | undefined;

      if (typedAttachement && typedAttachement.length > 0) {
        const file = typedAttachement[0];

        const result = await getPostMediaPresignedURL(file);
        await axios.put(result.preSignedURL, file);
        attachment = { attachmentKey: result.key, attachmentType: file.type };
      }

      const messageData: SendOneToOneMessageInputDTO = {
        message: data.message,
        to: userId,
        attachment,
      };

      socket.emit("send-one-to-one-message", messageData, (ack) => {
        console.log("message recived", ack);
      });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-y-hidden">
      <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 backdrop-blur-lg">
        <ChatHeader />
      </div>

      <div className="max-h-10/12 overflow-y-scroll">
        <MessagesContainer />
      </div>
      <div className="absolute bottom-0 left-1/2 z-30 w-4/5 -translate-x-1/2">
        <SendMessageBar handleOnSubmit={handleOnSubmit} />
      </div>
    </div>
  );
};

export default OneToOneChatPage;
