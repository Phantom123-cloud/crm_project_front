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
        url: `/roles-type/create`,
        method: METHODS.POST,
        body: { name, descriptions },
      }),
    }),

    deleteRolesType: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/roles-type/delete/${id}`,
        method: METHODS.DELETE,
      }),
    }),

    updateRolesType: builder.mutation<
      ApiResponse,
      { name: string | undefined; id: string; descriptions: string | undefined }
    >({
      query: ({ id, name, descriptions }) => ({
        url: `/roles-type/update/${id}`,
        method: METHODS.PUT,
        body: { name, descriptions },
      }),
    }),

    allRolesType: builder.query<
      ApiResponse<
        {
          id: string;
          name: string;
          descriptions: string;
        }[]
      >,
      void
    >({
      query: () => ({
        url: `/roles-type/all`,
        method: METHODS.GET,
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
} = rolesTypeApi;
