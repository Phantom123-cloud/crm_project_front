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
      ApiResponse<{ templates: Templates[] }>,
      void
    >({
      query: () => ({
        url: `/role-templates/all`,
        method: METHODS.GET,
      }),
    }),

    getSelectTeamplates: builder.query<
      ApiResponse<
        {
          id: string;
          name: string;
        }[]
      >,
      void
    >({
      query: () => ({
        url: `/role-templates/all-select`,
        method: METHODS.GET,
      }),
    }),

    // getTemplateById: builder.query<
    //   ApiResponse<RoleItem[]
    //   >,
    //   string
    // >({
    //   query: (id) => ({
    //     url: `/role-templates/${id}`,
    //     method: METHODS.GET,
    //   }),
    // }),

    allRoleTemplatesById: builder.query<
      ApiResponse<{ roles: RolesObj[] }>,
      string
    >({
      query: (id) => ({
        url: `/role-templates/${id}`,
        method: METHODS.GET,
      }),
    }),

    getRolesNotInTemplate: builder.query<
      ApiResponse<{ roles: RolesObj[] }>,
      string
    >({
      query: (id) => ({
        url: `/role-templates/by-not-id/${id}`,
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
  useAllRoleTemplatesByIdQuery,
  useLazyAllRoleTemplatesByIdQuery,
  useGetSelectTeamplatesQuery,
  // useGetTemplateByIdQuery,
  // useLazyGetTemplateByIdQuery,
  useLazyGetSelectTeamplatesQuery,
  useGetRolesNotInTemplateQuery,
  useLazyGetRolesNotInTemplateQuery,
} = roleTemplatesApi;
