import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConversationWithLastMessage } from "../Types/ConversationWithLastMessage";

const conversationIdSet = new Set<string>();
export interface IChatState {
  recentConvo: ConversationWithLastMessage[];
  unReadConvo: number;
}

const initialState: IChatState = {
  recentConvo: [],
  unReadConvo: 0,
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
  },
});

export const { addToConversationList } = chatSlice.actions;
export default chatSlice.reducer;
