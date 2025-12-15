"use client";

import { useMemo } from "react";
import { useGetMonthlyExpensesQuery } from "@/state/api";
import { ArrowUpRight } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function ExpensesPage() {
  const { data, isLoading } = useGetMonthlyExpensesQuery();

  /* ======================
     BUILD DAILY CHART DATA
  ====================== */
  const dailyData = useMemo(() => {
    if (!data?.expenses) return [];

    const map: Record<string, number> = {};

    data.expenses.forEach((exp) => {
      const day = new Date(exp.timestamp).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });

      map[day] = (map[day] || 0) + exp.amount;
    });

    return Object.entries(map).map(([day, total]) => ({
      day,
      total,
    }));
  }, [data?.expenses]);

  /* ======================
      MONTHLY BAR DATA
  ====================== */
  const monthlyBarData = [{ name: "This Month", total: data?.total || 0 }];

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 space-y-10 max-w-5xl mx-auto">
      {/* TOTAL MONTHLY CARD */}
      <div className="bg-white p-6 shadow rounded-xl">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          Monthly Expenses
          <ArrowUpRight className="w-5 h-5 text-blue-600" />
        </h2>

        <p className="text-4xl font-bold text-blue-600">
          £{data?.total?.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-gray-500 text-sm mt-1">Total spent this month</p>
      </div>

      {/* ===== CHARTS SECTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* BAR CHART */}
        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Monthly Spend (Bar Chart)</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  `£${Number(value).toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                  })}`
                }
              />
              <Bar dataKey="total" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Daily Spending Trend</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  `£${Number(value).toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                  })}`
                }
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== EXPENSE LIST ===== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">This Month's Expenses</h3>

        {data?.expenses?.length === 0 && (
          <p className="text-gray-500">No expenses recorded this month.</p>
        )}

        {data?.expenses?.map((exp) => (
          <div
            key={exp.expenseId}
            className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{exp.title}</p>
              <p className="text-gray-500 text-sm">
                {new Date(exp.timestamp).toLocaleDateString("en-GB")}
              </p>
            </div>

            <p className="text-red-600 font-bold text-lg">
              - £{exp.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
