import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type {
  CitizenshipAndLanguage,
  CitizenshipAndLanguageData,
} from "./citizenshipType";

export const citizenshipsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCitizenship: builder.mutation<ApiResponse, CitizenshipAndLanguage>({
      query: (body) => ({
        url: `/citizenships/create`,
        method: METHODS.POST,
        body,
      }),
    }),

    deleteCitizenship: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/citizenships/delete/${id}`,
        method: METHODS.DELETE,
      }),
    }),

    updateCitizenship: builder.mutation<
      ApiResponse,
      { body: Partial<CitizenshipAndLanguage>; id: string }
    >({
      query: ({ body, id }) => ({
        url: `/citizenships/update/${id}`,
        method: METHODS.PUT,
        body,
      }),
    }),

    allCitizenships: builder.query<
      ApiResponse<CitizenshipAndLanguageData[]>,
      void
    >({
      query: () => ({
        url: `/citizenships/all`,
        method: METHODS.GET,
      }),
    }),
  }),
});

export const {
  useAllCitizenshipsQuery,
  useCreateCitizenshipMutation,
  useDeleteCitizenshipMutation,
  useLazyAllCitizenshipsQuery,
  useUpdateCitizenshipMutation,
} = citizenshipsApi;
