"use client";

import {
  AlertTriangle,
  Flame,
  Refrigerator,
  Boxes,
} from "lucide-react";
import Link from "next/link";
import { useGetDashboardMetricsQuery } from "@/state/api";
import CardPopularProducts from "../(components)/CardPopularProducts";

export default function Dashboard() {
  const { data, isLoading } = useGetDashboardMetricsQuery();

  if (isLoading || !data)
    return (
      <div className="p-8 text-center text-gray-500 text-lg animate-pulse">
        Loading dashboard...
      </div>
    );

  const {
    popularProducts,
    expiryStats,
    stockStats,
    storageStats,
    monthlyExpenses,
  } = data;

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Track inventory, stock levels & expiry insights.
          </p>
        </div>

        {/* ADD PRODUCT */}
        <Link
          href="/products/add"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                     hover:opacity-90 text-white px-5 py-2.5 rounded-xl shadow-lg 
                     hover:shadow-xl transition-all active:scale-95"
        >
          Add Item
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* POPULAR PRODUCTS */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-lg border shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Popular Items
            </h2>
            <CardPopularProducts products={popularProducts} />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* EXPIRY CARD */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border shadow-md rounded-xl p-6 transition hover:shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-7 h-7 text-orange-600" />
              <h3 className="text-lg font-semibold text-orange-700">Expiry Overview</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-700">Expiring Soon</span>
                <span className="font-bold text-orange-700">
                  {expiryStats.expiringSoon}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-red-700">Already Expired</span>
                <span className="font-bold text-red-700">
                  {expiryStats.expired}
                </span>
              </div>
            </div>
          </div>

          {/* STOCK CARD */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border shadow-md rounded-xl p-6 transition hover:shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Boxes className="w-7 h-7 text-blue-700" />
              <h3 className="text-lg font-semibold text-blue-700">Stock Summary</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Total Items</span>
                <span className="font-bold text-blue-700">
                  {stockStats.totalItems}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-orange-600">Low Stock Items</span>
                <span className="font-bold text-orange-600">
                  {stockStats.lowStock}
                </span>
              </div>
            </div>
          </div>

          {/* STORAGE CARD */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 border shadow-md rounded-xl p-6 transition hover:shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Refrigerator className="w-7 h-7 text-teal-700" />
              <h3 className="text-lg font-semibold text-teal-700">Storage Overview</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-teal-700">Fridge Items</span>
                <span className="font-bold text-teal-700">
                  {storageStats.fridgeItems}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-indigo-700">Pantry Items</span>
                <span className="font-bold text-indigo-700">
                  {storageStats.pantryItems}
                </span>
              </div>
            </div>
          </div>

          {/* EXPENSE CARD */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border shadow-md rounded-xl p-6 transition hover:shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-7 h-7 text-red-700" />
              <h3 className="text-lg font-semibold text-red-700">Monthly Spend</h3>
            </div>

            <p className="text-3xl font-extrabold text-red-700">
              £{monthlyExpenses.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-red-600 mt-1">Total expense this month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
