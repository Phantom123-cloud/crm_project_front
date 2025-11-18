import { METHODS } from "@/utils/methods";
import { api } from "../api";
import type { ApiResponse } from "@/types";

export const filesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    deleteFile: builder.mutation<
      ApiResponse,
      { userId: string; fileName: string }
    >({
      query: ({ userId, fileName }) => ({
        url: `/files/delete`,
        method: METHODS.DELETE,
        params: { userId, fileName },
      }),
    }),

    importPasspostFiles: builder.mutation<
      ApiResponse,
      { userId: string; formData: FormData }
    >({
      query: ({ userId, formData }) => ({
        url: `/files/import-passport/${userId}`,
        method: METHODS.POST,
        body: formData,
      }),
    }),
  }),
});

export const { useDeleteFileMutation, useImportPasspostFilesMutation } =
  filesApi;
