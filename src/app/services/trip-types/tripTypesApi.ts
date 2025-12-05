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

    allTripTypes: builder.query<
      ApiResponse<
        {
          id: string;
          name: string;
        }[]
      >,
      void
    >({
      query: () => ({
        url: `/trip-types/all`,
        method: METHODS.GET,
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
} = tripTypesApi;
