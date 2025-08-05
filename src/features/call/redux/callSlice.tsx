import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type IMainSearchState = {
  activeAudioDeviceId: string;
  activeVideoDeviceId: string;
};

const initialState: IMainSearchState = {
  activeAudioDeviceId: "",
  activeVideoDeviceId: "",
};

export const mainSearchSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setActiveAudioDeviceId: (state, action: PayloadAction<string>) => {
      state.activeAudioDeviceId = action.payload;
    },
    setActiveVideoDeviceId: (state, action: PayloadAction<string>) => {
      state.activeVideoDeviceId = action.payload;
    },
  },
});

export const { setActiveAudioDeviceId, setActiveVideoDeviceId } = mainSearchSlice.actions;
export default mainSearchSlice.reducer;
