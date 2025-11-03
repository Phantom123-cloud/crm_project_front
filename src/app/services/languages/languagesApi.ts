import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type {
  CitizenshipAndLanguage,
  CitizenshipAndLanguageData,
} from "./languagesType";

export const languagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createLanguage: builder.mutation<ApiResponse, CitizenshipAndLanguage>({
      query: (body) => ({
        url: `/languages/create`,
        method: METHODS.POST,
        body,
      }),
    }),

    deleteLanguage: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/languages/delete/${id}`,
        method: METHODS.DELETE,
      }),
    }),

    updateLanguage: builder.mutation<
      ApiResponse,
      { body: Partial<CitizenshipAndLanguage>; id: string }
    >({
      query: ({ body, id }) => ({
        url: `/languages/update/${id}`,
        method: METHODS.PUT,
        body,
      }),
    }),

    allLanguages: builder.query<
      ApiResponse<CitizenshipAndLanguageData[]>,
      void
    >({
      query: () => ({
        url: `/languages/all`,
        method: METHODS.GET,
      }),
    }),
  }),
});

export const {
  useAllLanguagesQuery,
  useCreateLanguageMutation,
  useDeleteLanguageMutation,
  useLazyAllLanguagesQuery,
  useUpdateLanguageMutation,
} = languagesApi;
