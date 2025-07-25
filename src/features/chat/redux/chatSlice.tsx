import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConversationWithLastMessage } from "../Types/ConversationWithLastMessage";
import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import { Message } from "../Types/Message";

const oneToOneMessagesHistorySliceIdx = new Map<string, number>();

export interface IChatState {
  recentConvo: (ConversationWithLastMessage & { otherUser?: BasicUserDetails })[];
  recentConvoIdxHashMap: Record<string, number>;
  unReadConvo: number;

  oneToOnechats: Record<string, Message[]>;
  lastAddedMessageTypeMap: Record<string, "real-time" | "chat-history" | undefined>;

  activeConvo: string | null;
}

const initialState: IChatState = {
  recentConvo: [],
  recentConvoIdxHashMap: {},
  unReadConvo: 0,

  oneToOnechats: {},
  lastAddedMessageTypeMap: {},
  activeConvo: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addToConversationList: (state, action: PayloadAction<ConversationWithLastMessage[]>) => {
      action.payload.forEach((convo, idx) => {
        if (state.recentConvoIdxHashMap[convo.id] !== undefined) return;

        state.recentConvo.push(convo);
        state.recentConvoIdxHashMap[convo.id] = idx;

        if (convo.unreadCount > 0) {
          state.unReadConvo += 1;
        }
      });
    },

    markOneToOneConvoAsRead: (state, action: PayloadAction<{ convoId: string }>) => {
      const convoIdx = state.recentConvo.findIndex((convo) => convo.id === action.payload.convoId);
      if (convoIdx < 0) return;

      const convo = state.recentConvo[convoIdx];
      convo.unreadCount = 0;
    },

    setActiveConvo: (state, action: PayloadAction<{ converId: string }>) => {
      state.activeConvo = action.payload.converId;
    },

    /**
     *
     * @remarks
     * wont process the messages if the provided idx is already processed
     *
     */
    prependMessagesToOneToOneChat: (
      state,
      action: PayloadAction<{
        otherUserId: string;
        messages: Message[];
        chatHistorySliceIdx: number;
      }>,
    ) => {
      const { otherUserId, messages, chatHistorySliceIdx } = action.payload;
      const prevIdx = oneToOneMessagesHistorySliceIdx.get(otherUserId);

      if (prevIdx !== undefined && chatHistorySliceIdx <= prevIdx) return;

      let existingChat = state.oneToOnechats[otherUserId];
      if (!existingChat) {
        existingChat = [];
      }

      const newChat = [...messages, ...existingChat];
      oneToOneMessagesHistorySliceIdx.set(otherUserId, chatHistorySliceIdx);

      state.oneToOnechats[otherUserId] = newChat;
      state.lastAddedMessageTypeMap[otherUserId] = "chat-history";
    },

    addMessageToChat: (state, action: PayloadAction<{ otherUserId: string; message: Message }>) => {
      let chatMessages = state.oneToOnechats[action.payload.otherUserId];
      if (!chatMessages) {
        chatMessages = [];
      }

      action.payload.message.sendAt.toString();

      chatMessages.push(action.payload.message);
      state.oneToOnechats[action.payload.otherUserId] = chatMessages;
      state.lastAddedMessageTypeMap[action.payload.otherUserId] = "real-time";

      const convoIdx = state.recentConvo.findIndex(
        (convo) => convo.id === action.payload.message.conversationId,
      );
      if (convoIdx !== -1) {
        const [deletedConvo] = state.recentConvo.splice(convoIdx, 1);
        if (!deletedConvo) return;

        deletedConvo.lastMessage = action.payload.message;

        if (state.activeConvo !== deletedConvo.id) {
          deletedConvo.unreadCount = (deletedConvo.unreadCount ?? 0) + 1;
        }

        state.recentConvo.unshift(deletedConvo);
      } else {
        // fetch the convo from api
        // upadte convo list
      }
    },

    updateLastMessageOfConvo: (
      state,
      action: PayloadAction<{ convoId: string; message: Message }>,
    ) => {
      const convoIdx = state.recentConvo.findIndex((convo) => convo.id === action.payload.convoId);
      if (convoIdx !== -1) {
        const [deleted] = state.recentConvo.splice(convoIdx, 1);
        if (!deleted) return;

        deleted.lastMessage = action.payload.message;
        state.recentConvo.unshift(deleted);
      }
    },

    replaceOneToOneMessage: (
      state,
      action: PayloadAction<{ otherUserId: string; messageId: string; newMessage: Message }>,
    ) => {
      const chatMessages = state.oneToOnechats[action.payload.otherUserId];
      if (chatMessages) {
        action.payload.newMessage.sendAt.toString();
        const existingIdx = chatMessages.findIndex((item) => item.id === action.payload.messageId);

        if (existingIdx !== -1) {
          state.oneToOnechats[action.payload.otherUserId][existingIdx] = action.payload.newMessage;
        }
      }
    },
  },
});

export const {
  addToConversationList,
  markOneToOneConvoAsRead,
  addMessageToChat,
  setActiveConvo,
  updateLastMessageOfConvo,
  replaceOneToOneMessage,
  prependMessagesToOneToOneChat,
} = chatSlice.actions;
export default chatSlice.reducer;
