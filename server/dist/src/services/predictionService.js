"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictProductNeed = predictProductNeed;
exports.predictAllProducts = predictAllProducts;
const prisma_1 = require("../prisma");
/**
 * Predict a single product's consumption + running-out date + low stock warnings
 */
function predictProductNeed(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const logs = yield prisma_1.prisma.usageLog.findMany({
            where: { productId },
            orderBy: { usedAt: "asc" },
        });
        // LOW STOCK WARNING ALWAYS AVAILABLE
        const product = yield prisma_1.prisma.products.findUnique({
            where: { productId },
        });
        if (!product)
            return null;
        let stockWarning = "OK";
        if (product.stockQuantity < 1)
            stockWarning = "OUT_OF_STOCK";
        else if (product.stockQuantity < 2)
            stockWarning = "VERY_LOW";
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
        logs.forEach((log) => {
            totalUsed += log.quantityUsed;
        });
        const daysBetween = (lastDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24) || 1;
        const dailyUsage = totalUsed / daysBetween;
        const estimatedDaysLeft = product.stockQuantity > 0
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
    });
}
/**
 * Predict all products
 */
function predictAllProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield prisma_1.prisma.products.findMany();
        const predictions = yield Promise.all(products.map((p) => predictProductNeed(p.productId)));
        return predictions.filter(Boolean);
    });
}
