import { prisma } from "../prisma";
import { UsageLog, Products } from "@prisma/client";

/**
 * Predict a single product's consumption + running-out date + low stock warnings
 */
export async function predictProductNeed(productId: string) {
  const logs: UsageLog[] = await prisma.usageLog.findMany({
    where: { productId },
    orderBy: { usedAt: "asc" },
  });

  // LOW STOCK WARNING ALWAYS AVAILABLE
  const product: Products | null = await prisma.products.findUnique({
    where: { productId },
  });

  if (!product) return null;

  let stockWarning: "OUT_OF_STOCK" | "VERY_LOW" | "OK" = "OK";

  if (product.stockQuantity < 1) stockWarning = "OUT_OF_STOCK";
  else if (product.stockQuantity < 2) stockWarning = "VERY_LOW";

  // If not enough usage logs, still return low-stock info
  if (logs.length < 2) {
    return {
      productId,
      name: product.name,
      stockLeft: product.stockQuantity,
      dailyUsage: 0,
      estimatedDaysLeft: 0,
      stockWarning,
    };
  }

  // Calculate daily usage
  let totalUsed = 0;
  const firstDate = logs[0].usedAt;
  const lastDate = logs[logs.length - 1].usedAt;

  logs.forEach((log: UsageLog) => {
    totalUsed += log.quantityUsed;
  });

  const daysBetween =
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24) || 1;

  const dailyUsage = totalUsed / daysBetween;
  const estimatedDaysLeft =
    product.stockQuantity > 0
      ? product.stockQuantity / dailyUsage
      : 0;

  return {
    productId,
    name: product.name,
    stockLeft: product.stockQuantity,
    dailyUsage: Number(dailyUsage.toFixed(2)),
    estimatedDaysLeft: Math.round(estimatedDaysLeft),
    stockWarning,
  };
}

/**
 * Predict all products
 */
export async function predictAllProducts() {
  const products: Products[] = await prisma.products.findMany();

  const predictions = await Promise.all(
    products.map((p: Products) => predictProductNeed(p.productId))
  );

  return predictions.filter(Boolean);
}
