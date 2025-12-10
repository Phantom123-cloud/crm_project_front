import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type {
  RolesObj,
  Templates,
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
      query: ({ id, arrayConnect, arrayDisconnect, name }) => ({
        url: `/role-templates/update/${id}`,
        method: METHODS.PUT,
        body: { arrayConnect, arrayDisconnect, name },
      }),
    }),
    allRoleTemplates: builder.query<
      ApiResponse<{
        templates: Templates[];
        total: number;
        countPages: number;
        page: number;
        limit: number;
      }>,
      { page?: number; limit?: number }
    >({
      query: ({ page, limit }) => ({
        url: `/role-templates/all`,
        method: METHODS.GET,
        params: { page, limit },
      }),
    }),

    allRoleTemplatesSelect: builder.query<
      ApiResponse<{ templates: Templates[] }>,
      void
    >({
      query: () => ({
        url: `/role-templates/select-all`,
        method: METHODS.GET,
      }),
    }),

    allRoleTemplatesById: builder.query<
      ApiResponse<{ roles: RolesObj[] }>,
      string
    >({
      query: (id) => ({
        url: `/role-templates/${id}`,
        method: METHODS.GET,
      }),
    }),
  }),
});

export const {
  useAllRoleTemplatesByIdQuery,
  useAllRoleTemplatesQuery,
  useAllRoleTemplatesSelectQuery,
  useCreateRoleTemplateMutation,
  useDeleteRoleTemplateMutation,
  useLazyAllRoleTemplatesByIdQuery,
  useLazyAllRoleTemplatesQuery,
  useLazyAllRoleTemplatesSelectQuery,
  useUpdateRoleTemplateMutation,
} = roleTemplatesApi;
