import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type { TripsData } from "./tripsType";

export const tripsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    allTrips: builder.query<
      ApiResponse<TripsData>,
      {
        page: number;
        limit: number;
        isActive?: boolean;
      }
    >({
      query: ({ page, limit, isActive }) => ({
        url: `/trips/all`,
        method: METHODS.GET,
        params: {
          page,
          limit,
          isActive,
        },
      }),
    }),

    isActiveTrip: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/trips/is-active/${id}`,
        method: METHODS.PUT,
      }),
    }),

    createTrip: builder.mutation<
      ApiResponse,
      {
        dateFrom: string;
        dateTo: string;
        tripTypesId: string;
        ownerUserId: string;
      }
    >({
      query: ({ dateFrom, dateTo, tripTypesId, ownerUserId }) => ({
        url: `/trips/create`,
        method: METHODS.POST,
        body: { dateFrom, dateTo },
        params: { tripTypesId, ownerUserId },
      }),
    }),
  }),
});

export const {
  useAllTripsQuery,
  useLazyAllTripsQuery,
  useIsActiveTripMutation,
  useCreateTripMutation,
} = tripsApi;
