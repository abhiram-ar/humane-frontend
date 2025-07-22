import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConversationWithLastMessage } from "../Types/ConversationWithLastMessage";
import { BasicUserDetails } from "@/features/notification/Types/CombinedNotiWithActionableUser";
import { Message } from "../Types/Message";

const conversationIdSet = new Set<string>();
export interface IChatState {
  recentConvo: (ConversationWithLastMessage & { otherUser?: BasicUserDetails })[];
  unReadConvo: number;

  oneToOnechats: Record<string, Message[]>;
}

const initialState: IChatState = {
  recentConvo: [],
  unReadConvo: 0,
  oneToOnechats: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addToConversationList: (state, action: PayloadAction<ConversationWithLastMessage[]>) => {
      action.payload.forEach((convo) => {
        if (conversationIdSet.has(convo.id)) return;

        state.recentConvo.push(convo);
        conversationIdSet.add(convo.id);

        state.unReadConvo += 1;
      });

      state.recentConvo.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    },

    addMessageToChat: (state, action: PayloadAction<{ otherUserId: string; message: Message }>) => {
      let chatMessages = state.oneToOnechats[action.payload.otherUserId];
      if (!chatMessages) {
        chatMessages = [];
      }

      action.payload.message.sendAt.toString();

      chatMessages.push(action.payload.message);
      state.oneToOnechats[action.payload.otherUserId] = chatMessages;
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

export const { addToConversationList, addMessageToChat, replaceOneToOneMessage } =
  chatSlice.actions;
export default chatSlice.reducer;
