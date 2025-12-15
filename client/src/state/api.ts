// client/src/state/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ============================
   Types
============================ */

export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  expiryDate?: string | null;
  category?: string | null;
  storageLocation?: string | null;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  expiryDate?: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  expiryStats: {
    expiringSoon: number;
    expired: number;
  };
  stockStats: {
    totalItems: number;
    lowStock: number;
  };
  storageStats: {
    fridgeItems: number;
    pantryItems: number;
  };
  monthlyExpenses: number;
}

export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface ExpenseItem {
  expenseId: string;
  title: string;
  amount: number;
  timestamp: string;
}

export interface MonthlyExpenseResponse {
  total: number;
  expenses: ExpenseItem[];
}

/* ---------- Prediction Feature ---------- */

export interface PredictionItem {
  productId: string;
  name: string;
  stockLeft: number;
  dailyUsage: number;
  estimatedDaysLeft: number;
  stockWarning: "OUT_OF_STOCK" | "VERY_LOW" | "OK";  // ⭐ ADD THIS
}

/* ========= AI Recipes ========= */

export interface RecipeSuggestion {
  name: string;
  difficulty: string;
  ingredients: string[];
  steps: string[];
}

export interface RecipeResponse {
  recipes: RecipeSuggestion[];
}

/* ============================
   API Slice
============================ */

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),

  tagTypes: [
    "DashboardMetrics",
    "Products",
    "Users",
    "Expenses",
    "Expiring",
    "Recipes",
    "Predictions", // ⭐ NEW
  ],

  endpoints: (build) => ({
    /* ---------- Dashboard ---------- */
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),

    /* ---------- Products ---------- */
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),

    getExpiringSoonProducts: build.query<Product[], void>({
      query: () => "/expiring",
      providesTags: ["Expiring"],
    }),

    getExpiringSoon: build.query<Product[], void>({
      query: () => "/expiring",
      providesTags: ["Expiring"],
    }),

    createProducts: build.mutation<Product, NewProduct>({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products", "DashboardMetrics", "Expiring"],
    }),

    deleteProduct: build.mutation<{ message: string }, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "DashboardMetrics", "Expiring"],
    }),

    /* ---------- Users ---------- */
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    /* ---------- Expenses ---------- */
    getMonthlyExpenses: build.query<MonthlyExpenseResponse, void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),

    createExpense: build.mutation({
      query: (data) => ({
        url: "/expenses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Expenses", "DashboardMetrics"],
    }),

    /* ---------- Predictions (NEW FEATURE) ---------- */
    getPredictedNeeds: build.query<PredictionItem[], void>({
      query: () => "/predictions",
      providesTags: ["Predictions"],
    }),

    /* ---------- AI Recipes ---------- */
    getAiRecipeSuggestions: build.mutation<RecipeResponse, string[]>({
      query: (ingredients) => ({
        url: "/ai/recipes",
        method: "POST",
        body: { ingredients },
      }),
    }),
  }),
});

/* ============================
   Export Hooks
============================ */

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useGetExpiringSoonProductsQuery,
  useGetExpiringSoonQuery,
  useCreateProductsMutation,
  useDeleteProductMutation,
  useGetUsersQuery,
  useGetMonthlyExpensesQuery,
  useCreateExpenseMutation,
  useGetPredictedNeedsQuery, 
  useGetAiRecipeSuggestionsMutation,
} = api;
