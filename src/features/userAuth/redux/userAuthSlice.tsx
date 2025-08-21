import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IUserAuthState {
  token: string | null;
  type: "user" | "admin" | null;
}

const initialState: IUserAuthState = {
  token: null,
  type: null,
};

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; type: "user" | "admin" | null }>,
    ) => {
      state.token = action.payload.token;
      state.type = action.payload.type;
    },
    logout: (state) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
