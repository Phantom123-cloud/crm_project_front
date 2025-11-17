import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type { Roles } from "./rolesType";
import type { RolesObj } from "../role-templates/roleTemplatesTypes";

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
    updateUserRoles: builder.mutation<
      ApiResponse,
      {
        userId: string;
        unlock?: string[];
        removeIndividual?: string[];
        blockCurrent?: string[];
        addUnused?: string[];
      }
    >({
      query: ({ userId, unlock, removeIndividual, blockCurrent, addUnused }) => ({
        url: `/roles/update-roles-by-user/${userId}`,
        method: METHODS.PUT,
        body: { unlock, removeIndividual, blockCurrent, addUnused },
      }),
    }),

    allRole: builder.query<
      ApiResponse<{
        roles: Roles[];
        total: number;
        countPages: number;
        page: number;
        limit: number;
      }>,
      { page?: number; limit?: number }
    >({
      query: ({ page, limit }) => ({
        url: `/roles/all`,
        method: METHODS.GET,
        params: { page, limit },
      }),
    }),

    fullInformationOnRoles: builder.query<
      ApiResponse<{
        templateAvailableRoles: RolesObj[];
        blockedTemplateRoles: RolesObj[];
        individualAvailableRoles: RolesObj[];
        unusedRoles: RolesObj[];
        roleTemplate: string;
      }>,
      string
    >({
      query: (id) => ({
        url: `/roles/full-info-roles-by-user/${id}`,
        method: METHODS.GET,
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
  useFullInformationOnRolesQuery,
  useLazyFullInformationOnRolesQuery,
  useUpdateUserRolesMutation
} = rolesApi;
