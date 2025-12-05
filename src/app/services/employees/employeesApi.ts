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

    addContactNumberToEmployee: builder.mutation<
      ApiResponse,
      {
        option: "mobile" | "whatsapp" | "telegram";
        number: string;
        userId: string;
      }
    >({
      query: ({ userId, option, number }) => ({
        url: `/employees/add-contact/${userId}`,
        method: METHODS.POST,
        body: { option, number },
      }),
    }),

    deleteContactNumberToEmployee: builder.mutation<
      ApiResponse,
      {
        userId: string;
        phoneId: string;
      }
    >({
      query: ({ userId, phoneId }) => ({
        url: `/employees/delete-contact`,
        method: METHODS.DELETE,
        params: { userId, phoneId },
      }),
    }),

    addLanguageToEmployee: builder.mutation<
      ApiResponse,
      {
        level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "SPOKEN" | "NATIVE";
        languageId: string;
        userId: string;
      }
    >({
      query: ({ userId, level, languageId }) => ({
        url: `/employees/add-language/${userId}`,
        method: METHODS.POST,
        body: { level, languageId },
      }),
    }),

    deleteLanguageToEmployee: builder.mutation<
      ApiResponse,
      {
        userId: string;
        languageId: string;
      }
    >({
      query: ({ userId, languageId }) => ({
        url: `/employees/delete-language`,
        method: METHODS.DELETE,
        params: { userId, languageId },
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

    allEmployeeTradings: builder.query<
      ApiResponse<
        {
          fullName: string | null;
          userId: string;
          user: { email: string };
        }[]
      >,
      { isNotAll: boolean }
    >({
      query: ({ isNotAll }) => ({
        url: `/employees/all-employee-tradings`,
        method: METHODS.GET,
        params: { isNotAll },
      }),
    }),
  }),
});

export const {
  useUpdateEmployeeFormMutation,
  useUpdateEmployeePassportMutation,
  useDisconnectCitizenshipMutation,
  useAllEmployeeTradingsQuery,
  useLazyAllEmployeeTradingsQuery,
  useAddContactNumberToEmployeeMutation,
  useAddLanguageToEmployeeMutation,
  useDeleteContactNumberToEmployeeMutation,
  useDeleteLanguageToEmployeeMutation,
} = employeesApi;
