import {
  GetProductsResponseSchema,
  GetProductsResponse,
} from "@/schemas/sample";
import { fetcher } from "@/lib/fetcher";
import { z } from "zod";

export const apiClient = {
  products: {
    getProducts: async (): Promise<GetProductsResponse> => {
      return fetcher<null, GetProductsResponse>(
        "https://fakestoreapi.com/products",
        null,
        z.null(),
        GetProductsResponseSchema
      );
    },
  },
};
