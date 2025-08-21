import { createSlice } from "@reduxjs/toolkit";

export interface IAdminAuthState {
  empty: null;
}

const initialState: IAdminAuthState = {
  empty: null,
};

export const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    empty: () => {},
  },
});

export const { empty: logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
