"use client";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/state/api";
import { PlusCircle, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import useDebounce from "@/app/(hooks)/debounce";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Products = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: products, isError, isLoading } =
    useGetProductsQuery(debouncedSearchTerm);

  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: string) => {
    if (!confirm("❗ Delete this product?")) return;

    try {
      await deleteProduct(id).unwrap();
      router.refresh();
    } catch (error) {
      alert("Failed to delete product.");
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "No expiry";
    return new Date(dateString).toLocaleDateString();
  };

  const getExpiryStatus = (dateString?: string | null) => {
    if (!dateString) return "No expiry";

    const today = new Date();
    const expiry = new Date(dateString);
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysLeft < 0) return "Expired";
    if (daysLeft <= 3) return "Expiring Soon";
    return "Fresh";
  };

  const getExpiryBadge = (status: string) => {
    switch (status) {
      case "Expired":
        return "bg-red-100 text-red-700 border-red-200";
      case "Expiring Soon":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Fresh":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  if (isLoading)
    return <div className="py-10 text-center text-gray-600">Loading inventory...</div>;

  if (isError || !products)
    return <div className="py-10 text-center text-red-500">Failed to load products.</div>;

  return (
    <div className="mx-auto pb-10 w-full space-y-8">

      {/* HEADER + ADD BUTTON */}
      <div className="flex justify-between items-center">
        <Header name="Inventory" />

        <Link
          href="/products/add"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                     text-white font-medium py-2 px-4 rounded-lg transition"
        >
          <PlusCircle className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-md">
        <div className="relative">
          <input
            type="search"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 py-3 w-full border border-gray-300 shadow-sm bg-white rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map((product) => {
          const status = getExpiryStatus(product.expiryDate);

          return (
            <div
              key={product.productId}
              className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 flex flex-col justify-between
                         hover:shadow-md transition-all hover:-translate-y-1"
            >
              {/* TOP SECTION */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {product.name}
                  </h3>

                  <span
                    className={`px-3 py-1 text-xs rounded-full border ${getExpiryBadge(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                {/* PRODUCT DETAILS */}
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    Quantity:{" "}
                    <span className="font-medium">{product.stockQuantity}</span>
                  </p>

                  <p className="text-gray-600">
                    Expiry:{" "}
                    <span className="font-semibold">{formatDate(product.expiryDate)}</span>
                  </p>

                  <p className="text-gray-500 text-xs">
                    Price: ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDelete(product.productId)}
                className="mt-5 w-full flex items-center justify-center gap-2
                           py-2 border border-red-300 text-red-600 rounded-lg
                           hover:bg-red-50 transition font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete Item
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
