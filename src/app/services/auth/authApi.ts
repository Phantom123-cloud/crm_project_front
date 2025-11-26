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

    updateAccountCredentials: builder.mutation<
      ApiResponse,
      {
        oldPassword?: string;
        newPassword?: string;
        email?: string;
        userId: string;
      }
    >({
      query: ({ oldPassword, newPassword, email, userId }) => ({
        url: `/auth/update-account-credentials/${userId}`,
        method: METHODS.PUT,
        body: { oldPassword, newPassword, email },
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

    logoutByUserId: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/auth/logout-user/${id}`,
        method: METHODS.POST,
      }),
    }),

    getMe: builder.query<
      ApiResponse<{
        roles: string[];
        meData: { id: string; email: string; fullName: string };
      }>,
      void
    >({
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
  useUpdateAccountCredentialsMutation,
  useLogoutByUserIdMutation,
} = authApi;
