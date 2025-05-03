import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./../../features/userAuth/redux/userAuthSlice";

export const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
