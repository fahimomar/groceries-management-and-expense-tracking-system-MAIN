// server/src/controllers/dashboardController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // Get ALL products
    const allProducts = await prisma.products.findMany({
      orderBy: { name: "asc" },
    });

    /* ------------------------------------------
   1️⃣ POPULAR PRODUCTS (Fallback: Most stock)
------------------------------------------- */

// Try retrieving sales-based popularity
let popularProducts = [];

const popularSales = await prisma.sales.groupBy({
  by: ["productId"],
  _sum: { quantity: true },
  orderBy: { _sum: { quantity: "desc" } },
  take: 5,
});

// If sales exist → return real popular items
if (popularSales.length > 0) {
  popularProducts = await Promise.all(
    popularSales.map(async (item) => {
      const product = await prisma.products.findUnique({
        where: { productId: item.productId },
      });
      return {
        ...product,
        totalSold: item._sum.quantity || 0,
      };
    })
  );
} else {
  // No sales? → fallback to popular by stock
  popularProducts = allProducts
    .sort((a, b) => b.stockQuantity - a.stockQuantity)
    .slice(0, 5)
    .map((p) => ({
      ...p,
      totalSold: 0, // no sales
    }));
}

    /* ------------------------------------------
       2️⃣ EXPIRY STATS
    ------------------------------------------- */
    const expiryStats = {
      expiringSoon: allProducts.filter(
        (p) =>
          p.expiryDate &&
          new Date(p.expiryDate) >= today &&
          new Date(p.expiryDate) <= nextWeek
      ).length,

      expired: allProducts.filter(
        (p) => p.expiryDate && new Date(p.expiryDate) < today
      ).length,
    };

    /* ------------------------------------------
       3️⃣ STOCK STATS
    ------------------------------------------- */
    const stockStats = {
      totalItems: allProducts.length,
      lowStock: allProducts.filter((p) => p.stockQuantity <= 3).length,
    };

    /* ------------------------------------------
       4️⃣ STORAGE STATS
    ------------------------------------------- */
    const storageStats = {
      fridgeItems: allProducts.filter(
        (p) => p.storageLocation?.toLowerCase() === "fridge"
      ).length,

      pantryItems: allProducts.filter(
        (p) => p.storageLocation?.toLowerCase() === "pantry"
      ).length,
    };

    /* ------------------------------------------
       5️⃣ MONTHLY EXPENSES
    ------------------------------------------- */
    const purchases = await prisma.purchases.findMany();
    const currentMonth = new Date().getMonth();

    const monthlyExpenses = purchases
      .filter((p) => new Date(p.timestamp).getMonth() === currentMonth)
      .reduce((sum, p) => sum + p.totalCost, 0);

    /* ------------------------------------------
       FINAL RESPONSE
    ------------------------------------------- */
    res.json({
      popularProducts,
      expiryStats,
      stockStats,
      storageStats,
      monthlyExpenses,
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
