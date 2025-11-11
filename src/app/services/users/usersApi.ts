import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type { User, UsersData } from "./usersType";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    logoutByUserId: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/users/logout-user/${id}`,
        method: METHODS.POST,
      }),
    }),

    isActiveUser: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/users/is-active/${id}`,
        method: METHODS.PUT,
      }),
    }),

    allUsers: builder.query<
      ApiResponse<UsersData>,
      {
        page: number;
        limit: number;
        isFullData: boolean;
        isActive?: boolean;
        isOnline?: boolean;
      }
    >({
      query: ({ page, limit, isActive, isOnline, isFullData }) => ({
        url: `/users/all`,
        method: METHODS.GET,
        params: {
          page,
          limit,
          isActive,
          isOnline,
          isFullData,
        },
      }),
    }),
    userById: builder.query<ApiResponse<{ user: User }>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: METHODS.GET,
      }),
    }),
  }),
});

export const {
  useAllUsersQuery,
  useLazyAllUsersQuery,
  useLogoutByUserIdMutation,
  useIsActiveUserMutation,
  useUserByIdQuery,
  useLazyUserByIdQuery,
} = usersApi;
