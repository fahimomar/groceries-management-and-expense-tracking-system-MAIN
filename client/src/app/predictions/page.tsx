"use client";

import { useGetPredictedNeedsQuery, PredictionItem } from "@/state/api";
import { AlertTriangle, Clock, Package } from "lucide-react";

export default function PredictionsPage() {
  const { data, isLoading } = useGetPredictedNeedsQuery();

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Loading predictions...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load predictions.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Future Grocery Needs</h1>
        <p className="text-gray-500 mt-1">
          Estimated days left for each product based on your inventory.
        </p>
      </div>

      {/* If no historical usage exists */}
      {data.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded text-yellow-800">
          Not enough usage data to generate predictions yet.
        </div>
      )}

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((item: PredictionItem) => (
          <div
            key={item.productId}
            className="bg-white shadow rounded-xl p-6 border flex flex-col justify-between hover:shadow-md transition"
          >
            {/* NAME + WARNINGS */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{item.name}</h2>

              {/* WARNING BADGES */}
              {item.stockWarning === "VERY_LOW" && (
                <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                  Low Stock
                </span>
              )}

              {item.stockWarning === "OUT_OF_STOCK" && (
                <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 border border-red-200">
                  Out of Stock
                </span>
              )}
            </div>

            {/* DETAILS */}
            <div className="mt-4 space-y-2 text-sm">
              {/* Stock Left */}
              <p className="flex items-center gap-2 text-gray-700">
                <Package size={16} className="text-gray-500" />
                Stock Left:
                <span className="font-semibold">{item.stockLeft}</span>
              </p>

              {/* Estimated Days Left */}
              <p className="flex items-center gap-2 text-gray-700">
                <Clock size={16} className="text-gray-500" />
                Estimated Days Left:
                <span className="font-semibold">
                  {item.estimatedDaysLeft > 0
                    ? item.estimatedDaysLeft
                    : "No data"}
                </span>
              </p>

              {/* Daily Usage */}
              <p className="flex items-center gap-2 text-gray-700">
                <Clock size={16} className="text-gray-500" />
                Daily Usage:
                <span className="font-semibold">
                  {item.dailyUsage > 0
                    ? item.dailyUsage.toFixed(2)
                    : "Unknown"}
                </span>
              </p>
            </div>

            {/* STOCK SUGGESTIONS */}
            {item.stockWarning === "VERY_LOW" && (
              <div className="mt-4 p-3 rounded-lg bg-orange-100 text-orange-700 text-sm flex items-center gap-2 border border-orange-200">
                <AlertTriangle size={16} />
                This item may run out soon — consider adding it to your shopping
                list.
              </div>
            )}

            {item.stockWarning === "OUT_OF_STOCK" && (
              <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm flex items-center gap-2 border border-red-200">
                <AlertTriangle size={16} />
                This item is out of stock — restock as soon as possible.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
