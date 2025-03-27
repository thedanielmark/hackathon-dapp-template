import { z } from "zod";

// Single product schema
const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string().url(),
  rating: z.object({
    rate: z.number(),
    count: z.number(),
  }),
});

export const GetProductsResponseSchema = z.array(ProductSchema);

// Types inferred from Zod
export type GetProductsResponse = z.infer<typeof GetProductsResponseSchema>;
