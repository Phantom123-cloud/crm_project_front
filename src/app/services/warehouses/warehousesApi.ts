import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type { WarehousesApiData } from "./warehousesType";

export const warehousesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    allWarehousesApi: builder.query<
      ApiResponse<WarehousesApiData>,
      {
        page: number;
        limit: number;
        isActive?: boolean;
      }
    >({
      query: ({ page, limit, isActive }) => ({
        url: `/warehouses/all`,
        method: METHODS.GET,
        params: {
          page,
          limit,
          isActive,
        },
      }),
    }),

    isActiveWarehouse: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/warehouses/is-active/${id}`,
        method: METHODS.PUT,
      }),
    }),

    createWarehouse: builder.mutation<
      ApiResponse,
      {
        name: string;
        type: string;
        ownerUserId: string;
      }
    >({
      query: ({ name, type, ownerUserId }) => ({
        url: `/warehouses/create`,
        method: METHODS.POST,
        body: { name, type },
        params: { ownerUserId },
      }),
    }),
  }),
});

export const {
  useAllWarehousesApiQuery,
  useIsActiveWarehouseMutation,
  useLazyAllWarehousesApiQuery,
  useCreateWarehouseMutation,
} = warehousesApi;
