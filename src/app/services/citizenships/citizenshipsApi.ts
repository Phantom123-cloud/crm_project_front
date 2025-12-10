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

    allCitizenshipsSelect: builder.query<
      ApiResponse<CitizenshipAndLanguageData[]>,
      void
    >({
      query: () => ({
        url: `/citizenships/select-all`,
        method: METHODS.GET,
      }),
    }),

    allCitizenships: builder.query<
      ApiResponse<{
        citizenships: CitizenshipAndLanguageData[];
        total: number;
        countPages: number;
        page: number;
        limit: number;
      }>,
      { page?: number; limit?: number }
    >({
      query: ({ page, limit }) => ({
        url: `/citizenships/all`,
        method: METHODS.GET,
        params: { page, limit },
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
  useAllCitizenshipsSelectQuery,
  useLazyAllCitizenshipsSelectQuery,
} = citizenshipsApi;
