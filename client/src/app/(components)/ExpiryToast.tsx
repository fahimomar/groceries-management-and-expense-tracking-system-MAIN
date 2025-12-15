"use client";
import { useEffect } from "react";
import { useGetExpiringSoonProductsQuery } from "@/state/api";

export default function ExpiryToast() {
  const { data, refetch } = useGetExpiringSoonProductsQuery();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); // Keep checking every 60 sec
    }, 60000);

    return () => clearInterval(interval);
  }, [refetch]);

  // No popup if no expiry data
  if (!data || data.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {data.map((product) => (
        <div
          key={product.productId}
          className="bg-red-100 border-l-4 border-red-600 px-5 py-4 shadow-xl rounded-md animate-slide-in"
        >
          <p className="font-semibold text-red-700">
            ⚠ {product.name} expires soon!
          </p>
          <p className="text-gray-700 text-sm">
            Expiry: {new Date(product.expiryDate!).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
