import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";

export const rolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createRole: builder.mutation<
      ApiResponse,
      { name: string; descriptions: string; roleTypeId: string }
    >({
      query: ({ name, descriptions, roleTypeId }) => ({
        url: `/roles/create`,
        method: METHODS.POST,
        body: { name, descriptions },
        params: { roleTypeId },
      }),
    }),

    deleteRole: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/roles/delete/${id}`,
        method: METHODS.DELETE,
      }),
    }),

    updateRole: builder.mutation<
      ApiResponse,
      {
        name: string | undefined;
        id: string;
        descriptions: string | undefined;
        roleTypeId: string | undefined;
      }
    >({
      query: ({ id, name, descriptions, roleTypeId }) => ({
        url: `/roles/update/${id}`,
        method: METHODS.PUT,
        body: { name, descriptions, roleTypeId },
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
        url: `/roles/all`,
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
} = rolesApi;
