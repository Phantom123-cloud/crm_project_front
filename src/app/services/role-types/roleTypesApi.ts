import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";

export const rolesTypeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createRolesType: builder.mutation<
      ApiResponse,
      { name: string; descriptions: string }
    >({
      query: ({ name, descriptions }) => ({
        url: `/role-types/create`,
        method: METHODS.POST,
        body: { name, descriptions },
      }),
    }),

    deleteRolesType: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/role-types/delete/${id}`,
        method: METHODS.DELETE,
      }),
    }),

    updateRolesType: builder.mutation<
      ApiResponse,
      { name?: string; id: string; descriptions?: string }
    >({
      query: ({ id, name, descriptions }) => ({
        url: `/role-types/update/${id}`,
        method: METHODS.PUT,
        body: { name, descriptions },
      }),
    }),

    allSelectRolesType: builder.query<
      ApiResponse<{ id: string; name: string; descriptions: string }[]>,
      void
    >({
      query: () => ({
        url: `/role-types/select-all`,
        method: METHODS.GET,
      }),
    }),

    allRolesType: builder.query<
      ApiResponse<{
        rolesTypeData: { id: string; name: string; descriptions: string }[];
        total: number;
        countPages: number;
        page: number;
        limit: number;
      }>,
      { page?: number; limit?: number }
    >({
      query: ({ page, limit }) => ({
        url: `/role-types/all`,
        method: METHODS.GET,
        params: { page, limit },
      }),
    }),
  }),
});

export const {
  useAllRolesTypeQuery,
  useCreateRolesTypeMutation,
  useDeleteRolesTypeMutation,
  useLazyAllRolesTypeQuery,
  useUpdateRolesTypeMutation,
  useAllSelectRolesTypeQuery,
  useLazyAllSelectRolesTypeQuery,
} = rolesTypeApi;
