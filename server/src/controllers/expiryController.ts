// server/src/controllers/expiryController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ====================================================
   GET PRODUCTS EXPIRING WITHIN 7 DAYS
==================================================== */
export const getExpiringSoonProducts = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    // ✅ Using prisma.products to match your generated client
    const products = await prisma.products.findMany({
      where: {
        expiryDate: {
          not: null,
          gte: today,
          lte: nextWeek,
        },
        stockQuantity: {
          gt: 0,
        },
      },
      orderBy: { expiryDate: "asc" },
    });

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching expiring soon products:", error);
    res.status(500).json({ message: "Failed to fetch expiring products" });
  }
};
