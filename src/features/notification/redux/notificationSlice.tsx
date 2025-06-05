import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CombinedNotificationWithActionableUser } from "../Types/CombinedNotiWithActionableUser";

export interface INotificationState {
  recentNoti: CombinedNotificationWithActionableUser[];
}

const initialState: INotificationState = {
  recentNoti: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationList: (
      state,
      action: PayloadAction<CombinedNotificationWithActionableUser[]>,
    ) => {
      state.recentNoti = action.payload;
    },

    add: (state, action: PayloadAction<CombinedNotificationWithActionableUser>) => {
      state.recentNoti.unshift(action.payload);
    },

    removeNotification: (state, action: PayloadAction<CombinedNotificationWithActionableUser>) => {
      state.recentNoti = state.recentNoti.filter((noti) => noti.id !== action.payload.id);
    },

    markAsRead: (state, action: PayloadAction<CombinedNotificationWithActionableUser>) => {
      const idx = state.recentNoti.findIndex((noti) => noti.id === action.payload.id);
      state.recentNoti[idx].isRead = true;
    },
  },
});

export const { setNotificationList, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
