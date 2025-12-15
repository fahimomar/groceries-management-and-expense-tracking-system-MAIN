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
exports.getExpiringSoonProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/* ====================================================
   GET PRODUCTS EXPIRING WITHIN 7 DAYS
==================================================== */
const getExpiringSoonProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        // ✅ Using prisma.products to match your generated client
        const products = yield prisma.products.findMany({
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
    }
    catch (error) {
        console.error("❌ Error fetching expiring soon products:", error);
        res.status(500).json({ message: "Failed to fetch expiring products" });
    }
});
exports.getExpiringSoonProducts = getExpiringSoonProducts;
