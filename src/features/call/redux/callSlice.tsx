import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type IMainSearchState = {
  activeAudioDeviceId: string;
  activeVideoDeviceId: string;
  callStatus: "notInitiated" | "pending" | "rejected" | "joined";
  micOn: boolean;
  cameraOn: boolean;
};

const initialState: IMainSearchState = {
  activeAudioDeviceId: "",
  activeVideoDeviceId: "",
  callStatus: "notInitiated",
  micOn: true,
  cameraOn: false,
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

    callStatus: (
      state,
      action: PayloadAction<"notInitiated" | "pending" | "rejected" | "joined">,
    ) => {
      state.callStatus = action.payload;
    },

    micOn: (state, action: PayloadAction<boolean>) => {
      state.micOn = action.payload;
    },

    cameraOn: (state, action: PayloadAction<boolean>) => {
      state.cameraOn = action.payload;
    },
  },
});

export const { setActiveAudioDeviceId, setActiveVideoDeviceId, callStatus, cameraOn, micOn } =
  mainSearchSlice.actions;
export default mainSearchSlice.reducer;
