import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";

type InitialState = {
  offline: number | null;
  online: number | null;
  blocked: number | null;
};

const initialState: InitialState = {
  online: null,
  offline: null,
  blocked: null,
};

const socketSlice = createSlice({
  name: `socket`,
  initialState,
  reducers: {
    addData: (state, action: PayloadAction<InitialState>) => {
      state.offline = action.payload.offline;
      state.online = action.payload.online;
      state.blocked = action.payload.blocked;
    },
  },
});

export const { addData } = socketSlice.actions;

export const socketState = createSelector(
  (state: RootState) => state.socket,
  ({ offline, online, blocked }) => ({ offline, online, blocked })
);

export default socketSlice.reducer;
