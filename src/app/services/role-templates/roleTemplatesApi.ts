import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type {
  AllRoleTemplates,
  UpdateRoleTemplates,
} from "./roleTemplatesTypes";

export const roleTemplatesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createRoleTemplate: builder.mutation<
      ApiResponse,
      { array: Array<string>; name: string }
    >({
      query: ({ name, array }) => ({
        url: `/role-templates/create`,
        method: METHODS.POST,
        body: { name, array },
      }),
    }),

    deleteRoleTemplate: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/role-templates/delete/${id}`,
        method: METHODS.DELETE,
      }),
    }),

    updateRoleTemplate: builder.mutation<ApiResponse, UpdateRoleTemplates>({
      query: ({ id, key, array, name }) => ({
        url: `/role-templates/update/${id}`,
        method: METHODS.PUT,
        body: { key, array, name },
      }),
    }),

    allRoleTemplates: builder.query<ApiResponse<AllRoleTemplates>, void>({
      query: () => ({
        url: `/role-templates/all`,
        method: METHODS.GET,
      }),
    }),
  }),
});

export const {
  useAllRoleTemplatesQuery,
  useCreateRoleTemplateMutation,
  useDeleteRoleTemplateMutation,
  useUpdateRoleTemplateMutation,
  useLazyAllRoleTemplatesQuery,
} = roleTemplatesApi;
