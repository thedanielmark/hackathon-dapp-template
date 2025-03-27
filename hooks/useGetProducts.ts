import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  GetProductsResponse,
  GetProductsResponseSchema,
} from "@/schemas/sample";

// Define a query key to avoid duplication and enable caching
const GET_PRODUCTS_QUERY_KEY = ["products"];

// Custom hook to fetch products
export function useGetProducts(
  options?: Omit<
    UseQueryOptions<GetProductsResponse, Error>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<GetProductsResponse, Error> {
  return useQuery<GetProductsResponse, Error>({
    queryKey: GET_PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const data = await apiClient.products.getProducts();

      // Validate API response to ensure consistent data
      const parsedData = GetProductsResponseSchema.safeParse(data);
      if (!parsedData.success) {
        throw new Error(
          `Invalid API response: ${JSON.stringify(parsedData.error.format())}`
        );
      }
      return parsedData.data;
    },
    staleTime: 60 * 1000, // Cache data for 1 minute (adjust for hackathon)
    retry: 2, // Retry twice on failure
    refetchOnWindowFocus: false, // Avoid refetching on window focus during hackathon
    ...options, // Spread options for customization if needed
  });
}
