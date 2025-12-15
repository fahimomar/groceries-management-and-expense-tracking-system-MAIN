"use strict";
// server/src/controllers/dashboardController.ts
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
exports.getDashboardMetrics = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDashboardMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        // Get ALL products
        const allProducts = yield prisma.products.findMany({
            orderBy: { name: "asc" },
        });
        /* ------------------------------------------
       1️⃣ POPULAR PRODUCTS (Fallback: Most stock)
    ------------------------------------------- */
        // Try retrieving sales-based popularity
        let popularProducts = [];
        const popularSales = yield prisma.sales.groupBy({
            by: ["productId"],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
            take: 5,
        });
        // If sales exist → return real popular items
        if (popularSales.length > 0) {
            popularProducts = yield Promise.all(popularSales.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield prisma.products.findUnique({
                    where: { productId: item.productId },
                });
                return Object.assign(Object.assign({}, product), { totalSold: item._sum.quantity || 0 });
            })));
        }
        else {
            // No sales? → fallback to popular by stock
            popularProducts = allProducts
                .sort((a, b) => b.stockQuantity - a.stockQuantity)
                .slice(0, 5)
                .map((p) => (Object.assign(Object.assign({}, p), { totalSold: 0 })));
        }
        /* ------------------------------------------
           2️⃣ EXPIRY STATS
        ------------------------------------------- */
        const expiryStats = {
            expiringSoon: allProducts.filter((p) => p.expiryDate &&
                new Date(p.expiryDate) >= today &&
                new Date(p.expiryDate) <= nextWeek).length,
            expired: allProducts.filter((p) => p.expiryDate && new Date(p.expiryDate) < today).length,
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
            fridgeItems: allProducts.filter((p) => { var _a; return ((_a = p.storageLocation) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "fridge"; }).length,
            pantryItems: allProducts.filter((p) => { var _a; return ((_a = p.storageLocation) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "pantry"; }).length,
        };
        /* ------------------------------------------
           5️⃣ MONTHLY EXPENSES
        ------------------------------------------- */
        const purchases = yield prisma.purchases.findMany();
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
    }
    catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Failed to load dashboard" });
    }
});
exports.getDashboardMetrics = getDashboardMetrics;
