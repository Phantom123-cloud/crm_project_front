import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";

export const roleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createRole: builder.mutation<
      ApiResponse,
      { name: string; descriptions: string }
    >({
      query: ({ name, descriptions }) => ({
        url: `/role/create`,
        method: METHODS.POST,
        body: { name, descriptions },
      }),
    }),

    deleteRole: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/role/delete/${id}`,
        method: METHODS.DELETE,
      }),
    }),

    updateRole: builder.mutation<
      ApiResponse,
      { name: string | undefined; id: string; descriptions: string | undefined }
    >({
      query: ({ id, name, descriptions }) => ({
        url: `/role/update/${id}`,
        method: METHODS.PUT,
        body: { name, descriptions },
      }),
    }),

    allRole: builder.query<
      ApiResponse<{
        roles: {
          id: string;
          name: string;
          descriptions: string;
          typeName: string;
          typeId: string;
        }[];
        total: number;
        countPages: number;
        page: number;
        limit: number;
      }>,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `/role/all`,
        method: METHODS.GET,
        params: { page, limit },
      }),
    }),
  }),
});

export const {
  useAllRoleQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useLazyAllRoleQuery,
  useUpdateRoleMutation,
} = roleApi;
