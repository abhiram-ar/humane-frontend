import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CombinedNotification } from "../Types/CombinedNoti";

export interface INotificationState {
  noti: CombinedNotification[];
}

const initialState: INotificationState = {
  noti: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationList: (state, action: PayloadAction<CombinedNotification[]>) => {
      state.noti = action.payload;
    },
    removeNotification: (state, action: PayloadAction<CombinedNotification>) => {
      state.noti = state.noti.filter((noti) => noti.id !== action.payload.id);
    },

    markAsRead: (state, action: PayloadAction<CombinedNotification>) => {
      const idx = state.noti.findIndex((noti) => noti.id === action.payload.id);
      state.noti[idx].isRead = true;
    },
  },
});

export const { setNotificationList, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
