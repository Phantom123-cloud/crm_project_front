import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type { User, UsersData } from "./usersType";

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // createRole: builder.mutation<
    //   ApiResponse,
    //   { name: string; descriptions: string; roleTypeId: string }
    // >({
    //   query: ({ name, descriptions, roleTypeId }) => ({
    //     url: `/roles/create`,
    //     method: METHODS.POST,
    //     body: { name, descriptions },
    //     params: { roleTypeId },
    //   }),
    // }),

    // deleteRole: builder.mutation<ApiResponse, string>({
    //   query: (id) => ({
    //     url: `/roles/delete/${id}`,
    //     method: METHODS.DELETE,
    //   }),
    // }),

    // updateRole: builder.mutation<
    //   ApiResponse,
    //   {
    //     name: string | undefined;
    //     id: string;
    //     descriptions: string | undefined;
    //     roleTypeId: string | undefined;
    //   }
    // >({
    //   query: ({ id, name, descriptions, roleTypeId }) => ({
    //     url: `/roles/update/${id}`,
    //     method: METHODS.PUT,
    //     body: { name, descriptions, roleTypeId },
    //   }),
    // }),

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
