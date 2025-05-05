import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./../../features/userAuth/redux/userAuthSlice";
import globalAppReducer from "./appSlice";

export const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    globalApp: globalAppReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
