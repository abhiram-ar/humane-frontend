import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type IProfileState = {
  lastRewardedAt: string | undefined;
};

const initialState: IProfileState = {
  lastRewardedAt: undefined,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setLastRewaredAt: (state, action: PayloadAction<string>) => {
      state.lastRewardedAt = action.payload;
    },
  },
});

export const { setLastRewaredAt } = profileSlice.actions;
export default profileSlice.reducer;
