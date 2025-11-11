import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";

export const employeesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // logoutByUserId: builder.mutation<ApiResponse, string>({
    //   query: (id) => ({
    //     url: `/users/logout-user/${id}`,
    //     method: METHODS.POST,
    //   }),
    // }),

    updateEmployees: builder.mutation<
      ApiResponse,
      {
        formData: FormData;
        id: string;
      }
    >({
      query: ({ id, formData }) => ({
        url: `/employees/update/${id}`,
        method: METHODS.PUT,
        body: formData,
      }),
    }),
  }),
});

export const { useUpdateEmployeesMutation } = employeesApi;
