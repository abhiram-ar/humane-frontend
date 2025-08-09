import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type IMainSearchState = {
  callId: string | undefined;
  activeAudioDeviceId: string;
  activeVideoDeviceId: string;
  callStatus: "notInitiated" | "pending" | "ringing" | "rejected" | "joined" | "ended"; // pending => server not initiated callId, ringing => wating for peer to respond
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

    micOn: (state, action: PayloadAction<boolean>) => {
      state.micOn = action.payload;
    },

    cameraOn: (state, action: PayloadAction<boolean>) => {
      state.cameraOn = action.payload;
    },

    callStatus: (
      state,
      action: PayloadAction<
        "notInitiated" | "pending" | "ringing" | "rejected" | "joined" | "ended"
      >,
    ) => {
      state.callStatus = action.payload;
    },

    // --------------- outgoing  ----------------

    callInitiated: (state) => {
      state.callStatus = "pending";
    },

    ringing: (state, action: PayloadAction<{ callId: string }>) => {
      state.callStatus = "ringing";
      state.callId = action.payload.callId;
    },

    callDeclinedByPeer: (state, action: PayloadAction<{ callId: string }>) => {
      if (state.callId === action.payload.callId) {
        state.callId = undefined;
        state.callStatus = "rejected";
      }
    },

    callHangup: (state, action: PayloadAction<{ callId: string }>) => {
      if (state.callId !== action.payload.callId) return;

      state.callId = undefined;
      state.callStatus = "ended";
    },

    callConnected: (state, action: PayloadAction<{ callId: string }>) => {
      if (state.callId !== action.payload.callId) return;
      state.callStatus = "joined";
    },

    // -------------- in comming ------------------

    inComingCall: (
      state,
      action: PayloadAction<{ callId: string; callerId: string; at: string }>,
    ) => {
      if (state.incomingCall || state.callId) return;
      state.incomingCall = action.payload;
    },

    incomingCallAccepted: (state, action: PayloadAction<{ callId: string }>) => {
      state.callId = action.payload.callId;
      state.incomingCall = undefined;
      state.callStatus = "joined";
    },

    incomingCallRejected: (state, action: PayloadAction<{ callId: string }>) => {
      if (state.incomingCall?.callId === action.payload.callId) {
        state.incomingCall = undefined;
      }
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
  callConnected,
  callHangup,
  callDeclinedByPeer,
  incomingCallAccepted,
  incomingCallRejected,
  inComingCall,
  ringing,
} = mainSearchSlice.actions;
export default mainSearchSlice.reducer;
