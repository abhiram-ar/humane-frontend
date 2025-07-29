import { combineReducers, configureStore, createAction, PayloadAction } from "@reduxjs/toolkit";
import userAuthReducer from "./../../features/userAuth/redux/userAuthSlice";
import globalAppReducer from "./appSlice";
import adminAuthReducer from "@/features/admin/redux/adminAuthSlice";
import mainSearchReducer from "@/features/search/redux/mainSearchSlice";
import notificationReducer from "@/features/notification/redux/notificationSlice";
import chatReducer from "@/features/chat/redux/chatSlice";
export const appReducer = combineReducers({
  userAuth: userAuthReducer,
  globalApp: globalAppReducer,
  adminAuth: adminAuthReducer,
  mainSearch: mainSearchReducer,
  notifications: notificationReducer,
  chat: chatReducer,
});

export const resetStore = createAction("RESET_STORE");

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: PayloadAction) => {
  if (action.type === resetStore.type) {
    state = undefined; // this resets all slices to their initial state
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
