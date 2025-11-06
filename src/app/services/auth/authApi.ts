import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type { Login, Register } from "./authTypes";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse, Register>({
      query: (data) => ({
        url: `/auth/register`,
        method: METHODS.POST,
        body: data,
      }),
    }),

    login: builder.mutation<ApiResponse, Login>({
      query: (body) => ({
        url: `/auth/login`,
        method: METHODS.POST,
        body,
      }),
    }),

    logoutMe: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: `/auth/logout/me`,
        method: METHODS.POST,
      }),
    }),

    getMe: builder.query<ApiResponse<string[]>, void>({
      query: () => ({
        url: `/auth/me`,
        method: METHODS.GET,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLogoutMeMutation,
  useLazyGetMeQuery,
  useRegisterMutation,
} = authApi;
