import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface IAppState {
  appLoading: boolean;
}

const initialState: IAppState = {
  appLoading: true,
};

export const appSlice = createSlice({
  name: "globalApp",
  initialState,
  reducers: {
    setAppLoadingState: (state, action: PayloadAction<boolean>) => {
      state.appLoading = action.payload;
    },
  },
});

export const { setAppLoadingState } = appSlice.actions;
export default appSlice.reducer;
