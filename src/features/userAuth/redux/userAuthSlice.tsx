import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IUserAuthState {
  token: string | null;
}

const initialState: IUserAuthState = {
  token: null,
};

export const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
