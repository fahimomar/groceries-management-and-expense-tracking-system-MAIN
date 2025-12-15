"use client";

interface PopularProduct {
  productId: string;
  name: string;
  stockQuantity: number;
  totalSold?: number | null;
}

interface Props {
  products?: PopularProduct[];
}

export default function CardPopularProducts({ products = [] }: Props) {
  if (!Array.isArray(products) || products.length === 0) {
    return <p className="text-gray-500 text-sm">No popular items yet.</p>;
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div
          key={product.productId}
          className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
        >
          <div>
            <p className="font-medium text-gray-800">{product.name}</p>

            <p className="text-xs text-gray-500">
              Sold: {product.totalSold ?? 0}
            </p>
          </div>

          <span className="text-sm font-semibold text-blue-600">
            {product.stockQuantity} left
          </span>
        </div>
      ))}
    </div>
  );
}
