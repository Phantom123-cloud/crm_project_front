import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type {
  UpdateEmployeeForm,
  UpdateEmployeePassport,
} from "./employeesType";

export const employeesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateEmployeeForm: builder.mutation<
      ApiResponse,
      {
        body: Partial<UpdateEmployeeForm>;
        id: string;
      }
    >({
      query: ({ id, body }) => ({
        url: `/employees/update-form/${id}`,
        method: METHODS.PUT,
        body,
      }),
    }),
    updateEmployeePassport: builder.mutation<
      ApiResponse,
      {
        body: Partial<UpdateEmployeePassport>;
        id: string;
      }
    >({
      query: ({ id, body }) => ({
        url: `/employees/update-passport/${id}`,
        method: METHODS.PUT,
        body,
      }),
    }),
    disconnectCitizenship: builder.mutation<
      ApiResponse,
      {
        citizenshipId: string;
        userId: string;
      }
    >({
      query: ({ citizenshipId, userId }) => ({
        url: `/employees/disconnect-citizenship`,
        method: METHODS.PATCH,
        params: { citizenshipId, userId },
      }),
    }),
  }),
});

export const {
  useUpdateEmployeeFormMutation,
  useUpdateEmployeePassportMutation,
  useDisconnectCitizenshipMutation,
} = employeesApi;
