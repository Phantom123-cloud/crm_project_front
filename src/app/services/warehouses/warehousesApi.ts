import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";
import type {
  StockMovementsData,
  WarehouseById,
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

    allWarehousesSelect: builder.query<
      ApiResponse<{ id: string; name: string }[]>,
      string
    >({
      query: (notId) => ({
        url: `/warehouses/select-all`,
        method: METHODS.GET,
        params: { notId },
      }),
    }),

    allStockMovements: builder.query<
      ApiResponse<StockMovementsData>,
      {
        page: number;
        limit: number;
        warehouseId: string;
        status?: "TRANSIT" | "RECEIVED" | "CANCELLED" | undefined;
      }
    >({
      query: ({ page, limit, warehouseId, status }) => ({
        url: `/warehouses/all-stock-movements`,
        method: METHODS.GET,
        params: {
          page,
          limit,
          warehouseId,
          status,
        },
      }),
    }),

    warehouseByIdApi: builder.query<
      ApiResponse<WarehouseById>,
      { id: string; page: number; limit: number }
    >({
      query: ({ id, page, limit }) => ({
        url: `/warehouses/by/${id}`,
        method: METHODS.GET,
        params: {
          page,
          limit,
        },
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

    acceptProduct: builder.mutation<
      ApiResponse,
      { stockMovementsId: string; warehouseId: string }
    >({
      query: ({ stockMovementsId, warehouseId }) => ({
        url: `/warehouses/accept-product`,
        method: METHODS.PUT,
        params: { stockMovementsId, warehouseId },
      }),
    }),

    stockMovements: builder.mutation<
      ApiResponse,
      {
        productId: string;
        fromWarehouseId: string;
        toWarehouseId: string;
        quantity: number | null;
      }
    >({
      query: ({ productId, fromWarehouseId, toWarehouseId, quantity }) => ({
        url: `/warehouses/stock-movements`,
        method: METHODS.PUT,
        params: {
          productId,
          fromWarehouseId,
          toWarehouseId,
        },
        body: { quantity },
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
  useAllStockMovementsQuery,
  useLazyAllStockMovementsQuery,

  useStockMovementsMutation,
  useAllWarehousesSelectQuery,
  useLazyAllWarehousesSelectQuery,

  useAcceptProductMutation,
} = warehousesApi;
