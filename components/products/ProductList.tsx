/* eslint-disable @next/next/no-img-element */
import { useGetProducts } from "@/hooks/useGetProducts";
import { IProduct } from "@/types/product";

function ProductList() {
  const { data, isLoading, isError, error } = useGetProducts();

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Error loading products: {error?.message}</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.map((product: IProduct) => (
        <div key={product.id} className="p-4 border rounded-lg shadow-md">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
          <h3 className="mt-2 text-lg font-semibold">{product.title}</h3>
          <p className="text-sm text-gray-600">{product.description}</p>
          <span className="block mt-2 text-green-600 font-bold">
            ${product.price.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
