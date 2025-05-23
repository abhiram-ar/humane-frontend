import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type IMainSearchState = {
  query: string;
};

const initialState: IMainSearchState = {
  query: "",
};

export const mainSearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    resetSearchQuery: (state) => {
      state.query = "";
    },
  },
});

export const { setSearchQuery, resetSearchQuery } = mainSearchSlice.actions;
export default mainSearchSlice.reducer;
