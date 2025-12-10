import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<ApiResponse, { name: string }>({
      query: (name) => ({
        url: `/products/create`,
        method: METHODS.POST,
        body: name,
      }),
    }),

    deleteProduct: builder.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `/products/delete/${id}`,
        method: METHODS.DELETE,
      }),
    }),

    updateProduct: builder.mutation<ApiResponse, { name: string; id: string }>({
      query: ({ name, id }) => ({
        url: `/products/update/${id}`,
        method: METHODS.PUT,
        body: { name },
      }),
    }),

    allProductsSelect: builder.query<
      ApiResponse<{ name: string; id: string }[]>,
      void
    >({
      query: () => ({
        url: `/products/select-all`,
        method: METHODS.GET,
      }),
    }),

    allProducts: builder.query<
      ApiResponse<{
        products: {
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
        url: `/products/all`,
        method: METHODS.GET,
        params: { page, limit },
      }),
    }),
  }),
});

export const {
  useAllProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useLazyAllProductsQuery,
  useUpdateProductMutation,
  useAllProductsSelectQuery,
  useLazyAllProductsSelectQuery,
} = productsApi;
