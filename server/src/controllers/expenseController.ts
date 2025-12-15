import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMonthlyExpenses = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all purchases made this month
    const purchases = await prisma.purchases.findMany({
      where: {
        timestamp: {
          gte: firstDay,
        },
      },
      orderBy: { timestamp: "desc" },
    });

    // Calculate total
    const total = purchases.reduce((sum, p) => sum + p.totalCost, 0);

    res.json({
      total,
      expenses: purchases.map((p) => ({
        expenseId: p.purchaseId,
        title: `Purchased ${p.quantity} items`,
        amount: p.totalCost,
        timestamp: p.timestamp,
      })),
    });
  } catch (err) {
    console.error("Expense calculation error:", err);
    res.status(500).json({ message: "Failed to calculate expenses" });
  }
};
