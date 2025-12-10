import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";

export const tripTypesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTripTypes: builder.mutation<ApiResponse, { name: string }>({
      query: ({ name }) => ({
        url: `/trip-types/create`,
        method: METHODS.POST,
        body: { name },
      }),
    }),

    deleteTripTypes: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/trip-types/delete/${id}`,
        method: METHODS.DELETE,
      }),
    }),

    updateTripTypes: builder.mutation<
      ApiResponse,
      { name?: string; id: string }
    >({
      query: ({ id, name }) => ({
        url: `/trip-types/update/${id}`,
        method: METHODS.PUT,
        body: { name },
      }),
    }),

    allTripTypesSelect: builder.query<
      ApiResponse<{ name: string; id: string }[]>,
      void
    >({
      query: () => ({
        url: `/trip-types/select-all`,
        method: METHODS.GET,
      }),
    }),

    allTripTypes: builder.query<
      ApiResponse<{
        tripTypes: {
          id: string;
          name: string;
        }[];
        total: number;
        countPages: number;
        page: number;
        limit: number;
      }>,
      { page?: number; limit?: number }
    >({
      query: ({ page, limit }) => ({
        url: `/trip-types/all`,
        method: METHODS.GET,
        params: { page, limit },
      }),
    }),
  }),
});

export const {
  useAllTripTypesQuery,
  useCreateTripTypesMutation,
  useDeleteTripTypesMutation,
  useLazyAllTripTypesQuery,
  useUpdateTripTypesMutation,
  useAllTripTypesSelectQuery,
  useLazyAllTripTypesSelectQuery,
} = tripTypesApi;
