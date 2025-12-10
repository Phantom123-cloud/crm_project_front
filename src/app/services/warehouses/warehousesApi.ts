import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type {
  ProductsByWarehouse,
  Warehouse,
  WarehousesApiData,
} from "./warehousesType";

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

    warehouseByIdApi: builder.query<
      ApiResponse<{ warehouse: Warehouse & ProductsByWarehouse }>,
      string
    >({
      query: (id) => ({
        url: `/warehouses/by/${id}`,
        method: METHODS.GET,
      }),
    }),

    isActiveWarehouse: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/warehouses/is-active/${id}`,
        method: METHODS.PUT,
      }),
    }),

    updateWarehouse: builder.mutation<
      ApiResponse,
      { name: string; id: string }
    >({
      query: ({ id, name }) => ({
        url: `/warehouses/update/${id}`,
        method: METHODS.PUT,
        body: { name },
      }),
    }),

    addProductByWarehouse: builder.mutation<
      ApiResponse,
      { productId: string; warehouseId: string; quantity: number | null }
    >({
      query: ({ productId, warehouseId, quantity }) => ({
        url: `/warehouses/add-stock-item`,
        method: METHODS.PUT,
        body: { quantity },
        params: { productId, warehouseId },
      }),
    }),

    createWarehouse: builder.mutation<
      ApiResponse,
      {
        name: string;
        type: "CENTRAL" | "PERSONAL" | "TRIP";
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
  useLazyWarehouseByIdApiQuery,
  useWarehouseByIdApiQuery,
  useUpdateWarehouseMutation,
  useAddProductByWarehouseMutation,
} = warehousesApi;
