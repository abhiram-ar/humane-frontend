import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type IMainSearchState = {
  callId: string | undefined;
  activeAudioDeviceId: string;
  activeVideoDeviceId: string;
  callStatus: "notInitiated" | "pending" | "ringing" | "rejected" | "joined"; // pending => server not initiated callId, ringing => wating for peer to respond
  micOn: boolean;
  cameraOn: boolean;
  incomingCall: { callId: string; callerId: string; at: string } | undefined;
};

const initialState: IMainSearchState = {
  callId: undefined,
  activeAudioDeviceId: "",
  activeVideoDeviceId: "",
  callStatus: "notInitiated",
  micOn: true,
  cameraOn: false,
  incomingCall: undefined,
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
      action: PayloadAction<"notInitiated" | "pending" | "ringing" | "rejected" | "joined">,
    ) => {
      state.callStatus = action.payload;
    },

    callInitiated: (state) => {
      state.callStatus = "pending";
    },

    ringing: (state, action: PayloadAction<{ callId: string }>) => {
      state.callStatus = "ringing";
      state.callId = action.payload.callId;
    },

    incomingCallAccepted: (state, action: PayloadAction<{ callId: string }>) => {
      state.callStatus = "joined";
      state.callId = action.payload.callId;
      state.incomingCall = undefined;
    },

    incomingCallRejected: (state, action: PayloadAction<{ callId: string }>) => {
      if (state.incomingCall?.callId === action.payload.callId) {
        state.callStatus = "notInitiated";
        state.incomingCall = undefined;
      }
    },

    micOn: (state, action: PayloadAction<boolean>) => {
      state.micOn = action.payload;
    },

    cameraOn: (state, action: PayloadAction<boolean>) => {
      state.cameraOn = action.payload;
    },

    inComingCall: (
      state,
      action: PayloadAction<{ callId: string; callerId: string; at: string }>,
    ) => {
      state.incomingCall = action.payload;
      state.callStatus = "ringing";
    },
  },
});

export const {
  setActiveAudioDeviceId,
  setActiveVideoDeviceId,
  callStatus,
  cameraOn,
  micOn,
  callInitiated,
  incomingCallAccepted,
  incomingCallRejected,
  inComingCall,
  ringing,
} = mainSearchSlice.actions;
export default mainSearchSlice.reducer;
