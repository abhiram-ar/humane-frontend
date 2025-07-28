import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConversationWithLastMessage } from "../Types/ConversationWithLastMessage";
import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import { Message } from "../Types/Message";

const oneToOneMessagesHistorySliceIdx = new Map<string, number>();
const unReadConvoHahsset = new Set<string>();
export const recentConvoIdxHashMap: Record<string, number> = {};

export interface IChatState {
  recentConvo: (ConversationWithLastMessage & { otherUser?: BasicUserDetails })[];
  unReadConvo: number;
  activeConvo: string | null;
  searchConvoQuery: string | null;

  oneToOnechats: Record<string, Message[]>; // key => otherUserId
  oneToOneChatTypingRegisteredAtMap: Record<string, string>;
  lastAddedMessageTypeMap: Record<string, "real-time" | "chat-history" | undefined>;
}

const initialState: IChatState = {
  recentConvo: [],
  unReadConvo: 0,
  searchConvoQuery: null,
  activeConvo: null,

  oneToOnechats: {},
  oneToOneChatTypingRegisteredAtMap: {},
  lastAddedMessageTypeMap: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addToConversationList: (state, action: PayloadAction<ConversationWithLastMessage[]>) => {
      action.payload.forEach((convo, idx) => {
        if (recentConvoIdxHashMap[convo.id] !== undefined) return;

        state.recentConvo.push(convo);
        recentConvoIdxHashMap[convo.id] = idx;

        if (convo.unreadCount > 0) {
          state.unReadConvo += 1;
          unReadConvoHahsset.add(convo.id);
        }

        state.recentConvo.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      });
    },

    markOneToOneConvoAsRead: (state, action: PayloadAction<{ convoId: string }>) => {
      const convoIdx = state.recentConvo.findIndex((convo) => convo.id === action.payload.convoId);
      if (convoIdx < 0) return;

      const convo = state.recentConvo[convoIdx];
      convo.unreadCount = 0;

      // we might call markOneToOneConvoAsReadFrequenctly
      // so check if the conversation is unread before decrementing the counter
      if (unReadConvoHahsset.has(action.payload.convoId)) {
        state.unReadConvo -= 1;
        unReadConvoHahsset.delete(action.payload.convoId);
      }
    },

    setActiveConvo: (state, action: PayloadAction<{ converId: string }>) => {
      state.activeConvo = action.payload.converId;
    },

    setConvoQuery: (state, action: PayloadAction<{ query: string }>) => {
      if (!action.payload.query || action.payload.query.trim().length === 0) {
        state.searchConvoQuery = null;
      } else {
        state.searchConvoQuery = action.payload.query.trim();
      }
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

          // we might have frequent addMessageToChat
          // so check if the conversation is read before incrementing the counter
          if (!unReadConvoHahsset.has(deletedConvo.id)) {
            state.unReadConvo += 1;
            unReadConvoHahsset.add(deletedConvo.id);
          }
        }

        state.recentConvo.unshift(deletedConvo);
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

    deleteOneToOneMessage: (
      state,
      action: PayloadAction<{ otherUserId: string; deletedMessage: Message }>,
    ) => {
      const chatMessage = state.oneToOnechats[action.payload.otherUserId];
      if (chatMessage) {
        const deleteMessageIdx = chatMessage.findIndex(
          (message) => message.id === action.payload.deletedMessage.id,
        );

        if (deleteMessageIdx !== -1) {
          chatMessage[deleteMessageIdx] = action.payload.deletedMessage;
        }

        state.oneToOnechats[action.payload.otherUserId] = chatMessage;

        const convoIdx = state.recentConvo.findIndex(
          (convo) => convo.id === action.payload.deletedMessage.conversationId,
        );
        if (
          convoIdx !== -1 &&
          state.recentConvo[convoIdx].lastMessage?.id === action.payload.deletedMessage.id
        ) {
          state.recentConvo[convoIdx].lastMessage = action.payload.deletedMessage;
        }
      }
    },

    setOneToOneChatTypingIndicator: (
      state,
      action: PayloadAction<{
        otherUserId: string;
      }>,
    ) => {
      state.oneToOneChatTypingRegisteredAtMap[action.payload.otherUserId] = new Date().toString();
    },
  },
});

export const {
  addToConversationList,
  markOneToOneConvoAsRead,
  addMessageToChat,
  setConvoQuery,
  setActiveConvo,
  updateLastMessageOfConvo,
  replaceOneToOneMessage,
  deleteOneToOneMessage,
  setOneToOneChatTypingIndicator,
  prependMessagesToOneToOneChat,
} = chatSlice.actions;
export default chatSlice.reducer;
