import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../services/auth/authApi";
import type { RootState } from "../store";

const initialState: { data: string[] | undefined; roleType: string } = {
  data: [],
  roleType: "users",
};

const slice = createSlice({
  name: `roles`,
  initialState,
  reducers: {
    typeToggle(state, action) {
      state.roleType = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        state.data = action.payload.data;
      }
    );
  },
});

export const rolesState = (state: RootState) => {
  return state.roles
};
export const { typeToggle } = slice.actions;
export default slice.reducer;
