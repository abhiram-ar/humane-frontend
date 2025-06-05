import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./../../features/userAuth/redux/userAuthSlice";
import globalAppReducer from "./appSlice";
import adminAuthReducer from "@/features/admin/redux/adminAuthSlice";
import mainSearchReducer from "@/features/search/redux/mainSearchSlice";
import notificationReducer from "@/features/notification/redux/notificationSlice";
export const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    globalApp: globalAppReducer,
    adminAuth: adminAuthReducer,
    mainSearch: mainSearchReducer,
    notifications: notificationReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
