import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./../../features/userAuth/redux/userAuthSlice";
import globalAppReducer from "./appSlice";
import adminAuthReducer from "@/features/admin/redux/adminAuthSlice";

export const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    globalApp: globalAppReducer,
    adminAuth: adminAuthReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
