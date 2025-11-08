import { createSelector, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../services/auth/authApi";
import type { RootState } from "../store";
import type { RolesObj } from "../services/role-templates/roleTemplatesTypes";

const initialState: {
  roles: RolesObj[] | null;
  meData: { id: string; email: string; fullName: string } | null;
} = {
  roles: null,
  meData: null,
};

const slice = createSlice({
  name: `auth`,
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        if (action.payload.data) {
          const { roles, meData } = action.payload.data;
          state.roles = roles;
          state.meData = meData;
        } else {
          state.roles = null;
          state.meData = null;
        }
      }
    );
  },
});

export const authState = createSelector(
  (state: RootState) => state.auth,
  ({ roles, meData }) => ({ roles, meData })
);
export default slice.reducer;
